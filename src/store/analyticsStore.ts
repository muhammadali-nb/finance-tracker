import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
    Period,
    CategoryType,
    Granularity,
    BalanceResponse,
    CategoryBreakdownResponse,
    TrendsResponse,
    SummaryResponse,
    GetBalanceParams,
    GetCategoriesParams,
    GetTrendsParams,
    GetSummaryParams,
} from '@/composables/Analytics/types';
import { useAnalyticsRequests } from '@/composables/Analytics/requests';

export const useAnalyticsStore = defineStore('analytics', () => {
    // State
    const balance = ref<BalanceResponse | null>(null);
    const categoryBreakdown = ref<CategoryBreakdownResponse | null>(null);
    const trends = ref<TrendsResponse | null>(null);
    const summary = ref<SummaryResponse | null>(null);

    const loading = ref<boolean>(false);
    const loadingBalance = ref<boolean>(false);
    const loadingCategories = ref<boolean>(false);
    const loadingTrends = ref<boolean>(false);
    const isLoaded = ref<boolean>(false);

    // Current filters
    const currentPeriod = ref<Period>('month');
    const currentCategoryType = ref<CategoryType>('expense');
    const currentGranularity = ref<Granularity>('day');

    // Requests
    const { getBalance: fetchBalance, getCategories: fetchCategories, getTrends: fetchTrends, getSummary: fetchSummary } = useAnalyticsRequests();

    // Computed
    const balanceData = computed(() => balance.value);
    const categoriesData = computed(() => categoryBreakdown.value);
    const trendsData = computed(() => trends.value);
    const summaryData = computed(() => summary.value);

    // Actions
    const loadBalance = async (params: GetBalanceParams, force = false) => {
        // Проверяем, изменился ли период
        const periodChanged = currentPeriod.value !== params.period;

        // Если данные уже загружены, период не изменился и не требуется принудительная загрузка, не загружаем заново
        if (!force && !periodChanged && balance.value !== null) {
            return;
        }

        if (loadingBalance.value) return;

        try {
            loadingBalance.value = true;
            loading.value = true;
            currentPeriod.value = params.period;
            balance.value = await fetchBalance(params);
        } catch (error) {
            console.error('Failed to load balance:', error);
            throw error;
        } finally {
            loadingBalance.value = false;
            // Обновляем общий loading только если все загрузки завершены
            if (!loadingCategories.value && !loadingTrends.value) {
                loading.value = false;
            }
        }
    };

    const loadCategories = async (params: GetCategoriesParams, force = false) => {
        // Проверяем, изменились ли параметры
        const periodChanged = currentPeriod.value !== params.period;
        const typeChanged = currentCategoryType.value !== params.type;

        // Если данные уже загружены, параметры не изменились и не требуется принудительная загрузка, не загружаем заново
        if (!force && !periodChanged && !typeChanged && categoryBreakdown.value !== null) {
            return;
        }

        if (loadingCategories.value) return;

        try {
            loadingCategories.value = true;
            loading.value = true;
            currentPeriod.value = params.period;
            currentCategoryType.value = params.type;
            categoryBreakdown.value = await fetchCategories(params);
        } catch (error) {
            console.error('Failed to load categories:', error);
            throw error;
        } finally {
            loadingCategories.value = false;
            // Обновляем общий loading только если все загрузки завершены
            if (!loadingBalance.value && !loadingTrends.value) {
                loading.value = false;
            }
        }
    };

    const loadTrends = async (params: GetTrendsParams, force = false) => {
        // Проверяем, изменились ли параметры
        const periodChanged = currentPeriod.value !== params.period;
        const granularityChanged = currentGranularity.value !== params.granularity;

        // Если данные уже загружены, параметры не изменились и не требуется принудительная загрузка, не загружаем заново
        if (!force && !periodChanged && !granularityChanged && trends.value !== null) {
            return;
        }

        if (loadingTrends.value) return;

        try {
            loadingTrends.value = true;
            loading.value = true;
            currentPeriod.value = params.period;
            currentGranularity.value = params.granularity;
            trends.value = await fetchTrends(params);
        } catch (error) {
            console.error('Failed to load trends:', error);
            throw error;
        } finally {
            loadingTrends.value = false;
            // Обновляем общий loading только если все загрузки завершены
            if (!loadingBalance.value && !loadingCategories.value) {
                loading.value = false;
            }
        }
    };

    const loadSummary = async (params: GetSummaryParams, force = false) => {
        // Проверяем, изменились ли параметры
        const periodChanged = currentPeriod.value !== params.period;
        const categoryTypeChanged = params.type && currentCategoryType.value !== params.type;
        const granularityChanged = params.granularity && currentGranularity.value !== params.granularity;

        // Если данные уже загружены, параметры не изменились и не требуется принудительная загрузка, не загружаем заново
        if (!force && !periodChanged && !categoryTypeChanged && !granularityChanged && summary.value !== null) {
            return;
        }

        if (loading.value) return;

        try {
            loading.value = true;
            currentPeriod.value = params.period;
            if (params.type) {
                currentCategoryType.value = params.type;
            }
            if (params.granularity) {
                currentGranularity.value = params.granularity;
            }
            const summaryData = await fetchSummary(params);
            summary.value = summaryData;
            // Обновляем отдельные данные из summary для обратной совместимости
            balance.value = summaryData.balance;
            categoryBreakdown.value = summaryData.category_breakdown;
            trends.value = summaryData.trends;
            isLoaded.value = true;
        } catch (error) {
            console.error('Failed to load summary:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Удобные методы для загрузки всех данных для страницы аналитики
    const loadAnalyticsPage = async (period: Period, categoryType: CategoryType = 'expense', granularity: Granularity = 'day', force = false) => {
        if (loadingBalance.value || loadingCategories.value || loadingTrends.value) return;

        try {
            loadingBalance.value = true;
            loadingCategories.value = true;
            loadingTrends.value = true;
            loading.value = true;
            currentPeriod.value = period;
            currentCategoryType.value = categoryType;
            currentGranularity.value = granularity;

            // Загружаем все данные параллельно
            const [balanceData, categoriesData, trendsData] = await Promise.all([
                fetchBalance({ period }),
                fetchCategories({ period, type: categoryType }),
                fetchTrends({ period, granularity }),
            ]);

            balance.value = balanceData;
            categoryBreakdown.value = categoriesData;
            trends.value = trendsData;
            isLoaded.value = true;
        } catch (error) {
            console.error('Failed to load analytics page:', error);
            throw error;
        } finally {
            loadingBalance.value = false;
            loadingCategories.value = false;
            loadingTrends.value = false;
            loading.value = false;
        }
    };

    // Метод для сброса состояния
    const reset = () => {
        balance.value = null;
        categoryBreakdown.value = null;
        trends.value = null;
        summary.value = null;
        loading.value = false;
        loadingBalance.value = false;
        loadingCategories.value = false;
        loadingTrends.value = false;
        isLoaded.value = false;
        currentPeriod.value = 'month';
        currentCategoryType.value = 'expense';
        currentGranularity.value = 'day';
    };

    return {
        // State
        balance: balanceData,
        categoryBreakdown: categoriesData,
        trends: trendsData,
        summary: summaryData,
        loading,
        isLoaded,
        currentPeriod,
        currentCategoryType,
        currentGranularity,

        // Actions
        loadBalance,
        loadCategories,
        loadTrends,
        loadSummary,
        loadAnalyticsPage,
        reset,
    };
});
