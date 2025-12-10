import { computed, ref } from 'vue';
import type { EChartsOption } from 'echarts';

export type Period = 'day' | 'week' | 'month' | 'year';

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

const formatAmount = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '0';
    }
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toLocaleString('ru-RU');
};

// Моковые данные для статистики
const mockStats: Record<Period, StatCard> = {
    day: {
        income: 500000,
        expense: 150000,
        balance: 350000,
        averageExpense: 150000,
        incomeChange: 12.5,
        expenseChange: -8.3,
        balanceChange: 15.2,
        averageChange: -5.1,
    },
    week: {
        income: 2500000,
        expense: 1200000,
        balance: 1300000,
        averageExpense: 171428,
        incomeChange: 8.7,
        expenseChange: -12.4,
        balanceChange: 22.1,
        averageChange: -10.2,
    },
    month: {
        income: 10000000,
        expense: 7500000,
        balance: 2500000,
        averageExpense: 250000,
        incomeChange: 15.3,
        expenseChange: -5.8,
        balanceChange: 28.5,
        averageChange: -3.4,
    },
    year: {
        income: 120000000,
        expense: 90000000,
        balance: 30000000,
        averageExpense: 7500000,
        incomeChange: 22.1,
        expenseChange: -8.9,
        balanceChange: 35.7,
        averageChange: -6.2,
    },
};

// Моковые данные для категорий
const mockCategoryData = [
    { name: 'Питание', value: 450000, color: 'rgb(255, 107, 107)' },
    { name: 'Транспорт', value: 250000, color: 'rgb(74, 144, 226)' },
    { name: 'Развлечения', value: 300000, color: 'rgb(162, 89, 255)' },
    { name: 'Покупки', value: 200000, color: 'rgb(46, 213, 115)' },
    { name: 'Услуги', value: 150000, color: 'rgb(0, 206, 201)' },
    { name: 'Прочее', value: 100000, color: 'rgb(149, 165, 166)' },
];

// Моковые данные для линейного графика
const mockLineData: Record<Period, LineChartDataPoint[]> = {
    day: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: Math.floor(Math.random() * 50000) + 100000,
    })),
    week: Array.from({ length: 7 }, (_, i) => ({
        time: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i],
        value: Math.floor(Math.random() * 200000) + 300000,
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
        time: `${i + 1}`,
        value: Math.floor(Math.random() * 100000) + 200000,
    })),
    year: Array.from({ length: 12 }, (_, i) => ({
        time: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i],
        value: Math.floor(Math.random() * 2000000) + 5000000,
    })),
};

export const useAnalytics = () => {
    const selectedPeriod = ref<Period>('month');
    const selectedCategory = ref<string | null>(null);

    const stats = computed(() => mockStats[selectedPeriod.value]);

    const categoryData = computed<CategoryData[]>(() => {
        const total = mockCategoryData.reduce((sum, item) => sum + item.value, 0);
        return mockCategoryData.map((item) => ({
            name: item.name,
            value: item.value,
            percentage: ((item.value / total) * 100).toFixed(1),
            color: item.color,
        }));
    });

    const topCategories = computed(() => {
        return [...categoryData.value]
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    });

    const lineChartData = computed(() => mockLineData[selectedPeriod.value]);

    const getCategoryAmount = (categoryName: string): number => {
        const category = mockCategoryData.find(c => c.name === categoryName);
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
                return `${param.name}<br/>${formatAmount(param.value)} UZS`;
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
                formatter: (value: number) => formatAmount(value),
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
                data: mockCategoryData.map((item) => ({
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
                return `${param.name}<br/>Средний: ${formatAmount(param.value)} UZS`;
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
                formatter: (value: number) => formatAmount(value),
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
        stats,
        categoryData,
        topCategories,
        lineChartData,
        lineChartOption,
        pieChartOption,
        trendChartOption,
        formatAmount,
        getCategoryAmount,
        selectCategory,
    };
};
