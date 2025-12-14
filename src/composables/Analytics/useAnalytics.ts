import { computed, ref, onMounted, watch } from 'vue';
import type { EChartsOption } from 'echarts';
import { MONTHS_SHORT, DAYS_SHORT } from '@/composables/Categories/data';
import { formatAmountShort, formatDateLabel } from '@/utils';
import { useAnalyticsStore } from '@/store/analyticsStore';
import type { Period } from './types';

// Экспортируем Period для обратной совместимости
export type { Period };

export interface StatCard {
    income: number;
    expense: number;
    balance: number;
    averageExpense: number;
    incomeChange: number;
    expenseChange: number;
    balanceChange: number;
    averageChange: number;
}


export interface CategoryData {
    name: string;
    value: number;
    percentage: string;
    color: string;
}

export interface LineChartDataPoint {
    time: string;
    value: number;
}


export const useAnalytics = () => {
    const analyticsStore = useAnalyticsStore();
    const selectedPeriod = ref<Period>('month');
    const selectedCategory = ref<string | null>(null);

    const fetchAnalyticsData = async () => {
        try {
            const granularity: 'hour' | 'day' = selectedPeriod.value === 'day' ? 'hour' : 'day';
            // Используем summary для получения всех данных включая изменения
            await analyticsStore.loadSummary({
                period: selectedPeriod.value,
                type: 'expense',
                granularity,
            });
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        }
    };

    onMounted(() => {
        fetchAnalyticsData();
    });

    watch(selectedPeriod, () => {
        fetchAnalyticsData();
    });

    // Используем summary если доступен, иначе отдельные данные
    const summaryData = computed(() => analyticsStore.summary);
    const balanceData = computed(() => summaryData.value?.balance || analyticsStore.balance);
    const categoriesData = computed(() => summaryData.value?.category_breakdown || analyticsStore.categoryBreakdown);
    const trendsData = computed(() => {
        const trends = summaryData.value?.trends || analyticsStore.trends;
        if (!trends) {
            return [];
        }
        return trends.data.map(point => ({
            time: formatDateLabel(point.date, selectedPeriod.value),
            value: parseFloat(point.expense),
        }));
    });
    const incomeTrend = computed(() => summaryData.value?.income_trend);
    const expenseTrend = computed(() => summaryData.value?.expense_trend);

    const loading = computed(() => analyticsStore.loading);

    const stats = computed<StatCard>(() => {
        if (!balanceData.value) {
            return {
                income: 0,
                expense: 0,
                balance: 0,
                averageExpense: 0,
                incomeChange: 0,
                expenseChange: 0,
                balanceChange: 0,
                averageChange: 0,
            };
        }

        const totalExpense = parseFloat(balanceData.value.total_expense);
        const dataPoints = trendsData.value.length || 1;

        const incomeChange = incomeTrend.value?.change_percentage || 0;
        const expenseChange = expenseTrend.value?.change_percentage || 0;
        // Для balanceChange используем разницу между текущим и предыдущим балансом
        const balanceChange = incomeChange - expenseChange; // Упрощенный расчет
        const averageChange = 0; // Не приходит с бэкенда

        return {
            income: parseFloat(balanceData.value.total_income),
            expense: totalExpense,
            balance: parseFloat(balanceData.value.balance),
            averageExpense: totalExpense / dataPoints,
            incomeChange,
            expenseChange,
            balanceChange,
            averageChange,
        };
    });

    const categoryData = computed<CategoryData[]>(() => {
        if (!categoriesData.value) {
            return [];
        }

        return categoriesData.value.categories.map((cat) => ({
            name: cat.category_name,
            value: parseFloat(cat.amount),
            percentage: cat.percentage.toString(),
            color: cat.color || 'rgb(149, 165, 166)',
        }));
    });

    const topCategories = computed(() => {
        return [...categoryData.value]
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    });

    const lineChartData = computed(() => trendsData.value);

    const getCategoryAmount = (categoryName: string): number => {
        const category = categoryData.value.find(c => c.name === categoryName);
        return category?.value || 0;
    };

    const selectCategory = (categoryName: string) => {
        if (selectedCategory.value === categoryName) {
            selectedCategory.value = null;
        } else {
            selectedCategory.value = categoryName;
        }
    };

    const lineChartOption = computed<EChartsOption>(() => ({
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 215, 0, 0.3)',
            borderWidth: 1,
            textStyle: {
                color: 'var(--primary-500)',
            },
            formatter: (params: any) => {
                const param = Array.isArray(params) ? params[0] : params;
                return `${param.name}<br/>${formatAmountShort(param.value)} UZS`;
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lineChartData.value.map(item => item.time),
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 215, 0, 0.2)',
                },
            },
            axisLabel: {
                color: 'var(--primary-500)',
                fontSize: 12,
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 215, 0, 0.1)',
                },
            },
            axisLabel: {
                color: 'var(--primary-500)',
                fontSize: 12,
                formatter: (value: number) => formatAmountShort(value),
            },
        },
        series: [
            {
                name: 'Расходы',
                type: 'line',
                smooth: true,
                data: lineChartData.value.map(item => item.value),
                itemStyle: {
                    color: 'var(--primary-500)',
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
                            { offset: 1, color: 'rgba(255, 215, 0, 0.05)' },
                        ],
                    },
                },
                lineStyle: {
                    width: 3,
                },
                symbol: 'circle',
                symbolSize: 6,
            },
        ],
    }));

    const pieChartOption = computed<EChartsOption>(() => ({
        tooltip: {
            show: false,
        },
        animation: true,
        animationType: 'scale',
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100,
        series: [
            {
                type: 'pie',
                radius: ['80%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 30,
                    borderColor: 'rgb(30, 30, 30)',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowOffsetX: 0,
                        shadowOffsetY: 5,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        borderWidth: 4,
                    },
                    scale: true,
                    scaleSize: 5,
                },
                labelLine: {
                    show: false,
                },
                data: categoryData.value.map((item) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: item.color,
                        opacity: selectedCategory.value && selectedCategory.value !== item.name ? 0.3 : 1,
                    },
                })),
            },
        ],
    }));

    // Данные для графика среднего тренда
    const trendLineData = computed(() => {
        const data = lineChartData.value.map(item => item.value);
        const average = data.reduce((sum, val) => sum + val, 0) / data.length;
        return data.map(() => average);
    });

    const trendChartOption = computed<EChartsOption>(() => ({
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 215, 0, 0.3)',
            borderWidth: 1,
            textStyle: {
                color: 'var(--primary-500)',
            },
            formatter: (params: any) => {
                const param = Array.isArray(params) ? params[0] : params;
                return `${param.name}<br/>Средний: ${formatAmountShort(param.value)} UZS`;
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lineChartData.value.map(item => item.time),
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 215, 0, 0.2)',
                },
            },
            axisLabel: {
                color: 'var(--primary-500)',
                fontSize: 12,
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 215, 0, 0.1)',
                },
            },
            axisLabel: {
                color: 'var(--primary-500)',
                fontSize: 12,
                formatter: (value: number) => formatAmountShort(value),
            },
        },
        series: [
            {
                name: 'Расходы',
                type: 'line',
                smooth: true,
                data: lineChartData.value.map(item => item.value),
                itemStyle: {
                    color: 'var(--primary-500)',
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
                            { offset: 1, color: 'rgba(255, 215, 0, 0.05)' },
                        ],
                    },
                },
                lineStyle: {
                    width: 3,
                },
                symbol: 'circle',
                symbolSize: 6,
            },
            {
                name: 'Средний тренд',
                type: 'line',
                smooth: true,
                data: trendLineData.value,
                itemStyle: {
                    color: 'rgba(255, 215, 0, 0.6)',
                },
                lineStyle: {
                    width: 2,
                    type: 'dashed',
                },
                symbol: 'none',
                z: 10,
            },
        ],
    }));

    return {
        selectedPeriod,
        selectedCategory,
        loading,
        stats,
        categoryData,
        topCategories,
        lineChartData,
        lineChartOption,
        pieChartOption,
        trendChartOption,
        formatAmount: formatAmountShort,
        getCategoryAmount,
        selectCategory,
    };
};
