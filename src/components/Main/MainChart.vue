<template>
    <div class="main-chart">
        <div class="main-chart__header">
            <h1 class="font-20-b">Категории</h1>
        </div>
        <div ref="chartWrapperRef" class="main-chart__container-wrapper">
            <VChart ref="chartRef" :option="chartOption" class="main-chart__container" @click="handleChartClick" />
            <Transition name="fade">
                <div v-if="selectedCategory" class="main-chart__center">
                    <p class="main-chart__center-label font-14-r">{{ centerLabel }}</p>
                    <h2 class="main-chart__center-value font-30-b">{{ formattedCenterValue }}</h2>
                </div>
                <div v-else class="main-chart__center">
                    <p class="main-chart__center-label font-14-r">Текущий баланс</p>
                    <h2 class="main-chart__center-value font-30-b">{{ formattedBalance }}</h2>
                </div>
            </Transition>
        </div>
        <div class="main-chart__categories">
            <div v-for="category in expensesData" :key="category.name" class="main-chart__category"
                :class="{ 'main-chart__category--active': selectedCategory === category.name }"
                @click="selectCategory(category.name)">
                <div class="main-chart__category-icon" :style="{ backgroundColor: category.color }"></div>
                <p class="main-chart__category-name font-12-r">{{ category.name }}</p>
                <span class="main-chart__category-percent font-10-r">{{ category.percentage }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

const chartRef = ref<InstanceType<typeof VChart> | null>(null);
const chartWrapperRef = ref<HTMLElement | null>(null);
const selectedCategory = ref<string | null>(null);

// Сброс выбора при клике вне графика
onClickOutside(chartWrapperRef, () => {
    if (selectedCategory.value) {
        selectedCategory.value = null;
    }
});

// Моковый баланс
const balance = 100000;

// Моковые данные для расходов с цветами
const mockExpensesData = [
    {
        name: 'Питание',
        value: 45000,
        color: 'rgb(255, 107, 107)',
    },
    {
        name: 'Транспорт',
        value: 25000,
        color: 'rgb(74, 144, 226)',
    },
    {
        name: 'Развлечения',
        value: 30000,
        color: 'rgb(162, 89, 255)',
    },
    {
        name: 'Покупки',
        value: 20000,
        color: 'rgb(46, 213, 115)',
    },
    {
        name: 'Услуги',
        value: 15000,
        color: 'rgb(0, 206, 201)',
    },
    {
        name: 'Прочее',
        value: 10000,
        color: 'rgb(149, 165, 166)',
    },
];

// Форматирование суммы
const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    // До миллиона показываем полное число с разделителями
    return amount.toLocaleString('ru-RU');
};

// Форматированный баланс
const formattedBalance = computed(() => {
    return formatAmount(balance);
});

// Выбор категории
const selectCategory = (categoryName: string) => {
    if (selectedCategory.value === categoryName) {
        selectedCategory.value = null;
    } else {
        selectedCategory.value = categoryName;
    }
};

// Обработчик клика на график
const handleChartClick = (params: any) => {
    if (params.componentType === 'series' && params.name) {
        selectCategory(params.name);
    }
};

// Добавляем обработчик событий после монтирования
onMounted(() => {
    // Используем setTimeout для того, чтобы график успел инициализироваться
    setTimeout(() => {
        if (chartRef.value?.chart) {
            chartRef.value.chart.on('click', handleChartClick);
        }
    }, 100);
});

// Текст и значение для центра
const centerLabel = computed(() => {
    if (selectedCategory.value) {
        const category = expensesData.value.find(c => c.name === selectedCategory.value);
        return category?.name || 'Текущий баланс';
    }
    return 'Текущий баланс';
});

const formattedCenterValue = computed(() => {
    if (selectedCategory.value) {
        const category = expensesData.value.find(c => c.name === selectedCategory.value);
        if (category) {
            return formatAmount(category.value);
        }
    }
    return formattedBalance.value;
});

const expensesData = computed(() => {
    const total = mockExpensesData.reduce((sum, item) => sum + item.value, 0);
    return mockExpensesData.map((item) => ({
        name: item.name,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
        formatted: `${item.name}: ${(item.value / 1000).toFixed(0)}k (${((item.value / total) * 100).toFixed(1)}%)`,
        color: item.color,
    }));
});

const chartOption = computed<EChartsOption>(() => ({
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
                    borderWidth: 3,
                },
                scale: true,
                scaleSize: 5,
            },
            labelLine: {
                show: false,
            },
            data: mockExpensesData.map((item) => ({
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
</script>

<style scoped lang="scss">
.main-chart {
    width: 100%;
    margin-top: 1.2rem;
    padding: 1.6rem 1.2rem;
    border-radius: 1.6rem;
    background-color: var(--card-default);

    &__header {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 1.6rem;
    }

    &__container-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__container {
        width: 100%;
        height: 300px;
    }

    &__center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        pointer-events: none;
        z-index: 10;
    }

    &__center-label {
        color: var(--text-color);
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    &__center-value {
        color: var(--text-color);
        transition: transform 0.3s ease, color 0.3s ease;
    }

    &__categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
        justify-content: center;
    }

    &__category {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.4rem 0.8rem;
        border-radius: var(--radius-m);
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
        border: 1px solid transparent;

        &:hover {
            background: var(--card-hover);
            border-color: var(--border-light);
        }

        &--active {
            background: var(--card-accent);
            border-color: var(--border-medium);
        }
    }

    &__category-icon {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }

    &__category-name {
        transition: color 0.3s ease;
    }

    &__category-percent {
        color: var(--text-color);
        opacity: 0.6;
        font-size: 1rem;
    }

    &__category:hover &__category-icon {
        transform: scale(1.2);
    }

    &__category--active &__category-icon {
        transform: scale(1.3);
        box-shadow: 0 0 8px currentColor;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -60%);
}
</style>
