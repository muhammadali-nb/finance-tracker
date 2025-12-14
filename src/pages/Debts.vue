<template>
    <div class="debts-page">
        <div class="debts-page__header">
            <Button :icon="arrowLeft" severity="secondary" @click="router.back()" class="debts-page__header-button" />
            <div>
                <h1 class="font-24-b gold-text">Долги</h1>
            </div>
            <div class="debts-page__header-empty" />
        </div>

        <div class="debts-page__balance">
            <div class="debts-page__balance-item">
                <VIcon :icon="arrowDownLeft" class="debts-page__balance-icon" />
                <div class="debts-page__balance-content">
                    <h5 class="font-14-r">Я занял(а)</h5>
                    <p class="font-16-r gold-text">{{ formatAmount(totalBorrowed) }} UZS</p>
                </div>
            </div>
            <div class="debts-page__balance-item">
                <VIcon :icon="arrowUpRight" class="debts-page__balance-icon" />
                <div class="debts-page__balance-content">
                    <h5 class="font-14-r">Мне должны</h5>
                    <p class="font-16-r gold-text">{{ formatAmount(totalLent) }} UZS</p>
                </div>
            </div>
        </div>

        <div class="debts-page__filters">
            <div class="debts-page__filters-row">
                <SelectButton v-model="selectedType" :options="typeFilterOptions" option-label="label"
                    option-value="value" :allow-empty="false" />
            </div>
            <div class="debts-page__filters-row">
                <SelectButton v-model="selectedStatus" :options="statusFilterOptions" option-label="label"
                    option-value="value" :allow-empty="false" />
            </div>
        </div>

        <div class="debts-page__content">
            <div v-if="loading" class="debts-page__loading">
                <ProgressSpinner />
            </div>
            <div v-else-if="filteredDebts.length === 0" class="debts-page__empty">
                <div class="debts-page__empty-icon">
                    <VIcon :icon="warning" />
                </div>
                <p class="debts-page__empty-text">Долги не найдены</p>
                <p class="debts-page__empty-hint">Попробуйте другие фильтры</p>
            </div>
            <div v-else class="debts-page__list">
                <DebtCard v-for="debt in filteredDebts" :key="debt.id" :debt="debt" @remove="removeDebtHandler(debt.id)"
                    @edit="editDebt(debt)" @mark-paid="markAsPaid(debt.id)" />
            </div>
        </div>

        <div class="debts-page__footer">
            <Button label="Добавить долг" fluid :icon="plus" @click="drawerVisible = true" />
        </div>
        <DebtForm v-model:visible="drawerVisible" :edit-data="formEditData" @submit="handleSubmitWrapper"
            @update:visible="handleDrawerVisibilityChange" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, SelectButton, ProgressSpinner } from 'primevue';
import DebtForm from '@/components/Debts/DebtForm.vue';
import DebtCard from '@/components/Debts/DebtCard.vue';
import VIcon from '@/components/UI/VIcon.vue';
import type { Debt, DebtFormData } from '@/composables/Debts/types';
import { DebtType, DebtStatus } from '@/composables/Debts/types';
import { DEBT_TYPE_FILTER_OPTIONS, DEBT_STATUS_FILTER_OPTIONS } from '@/composables/Debts/data';
import { useDebtsStore } from '@/store/debtsStore';
import { useToastStore } from '@/store/toastsStore';
import { arrowDownLeft, arrowUpRight, plus, arrowLeft, warning } from '@/assets/icons';
import router from '@/router/router';
import { formatAmount } from '@/utils';

const selectedType = ref<DebtType | 'all'>('all');
const selectedStatus = ref<DebtStatus | 'all'>('all');

const debtsStore = useDebtsStore();
const { debts, balance, drawerVisible, editingDebt, loading } = storeToRefs(debtsStore);
const { removeDebt, editDebt: editDebtInStore, handleSubmit: handleSubmitInStore, markDebtAsPaid, loadDebts, loadDebtBalance } = debtsStore;
const $toast = useToastStore();

const totalBorrowed = computed(() => {
    return balance.value ? parseFloat(balance.value.i_owe_total) : 0;
});

const totalLent = computed(() => {
    return balance.value ? parseFloat(balance.value.owe_me_total) : 0;
});

const typeFilterOptions = DEBT_TYPE_FILTER_OPTIONS;
const statusFilterOptions = DEBT_STATUS_FILTER_OPTIONS;

const filteredDebts = computed(() => {
    let filtered = debts.value;

    if (selectedType.value !== 'all') {
        filtered = filtered.filter(debt => debt.type === selectedType.value);
    }

    if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(debt => debt.status === selectedStatus.value);
    }

    return filtered;
});

const formEditData = computed(() => {
    if (!editingDebt.value) return null;
    return {
        type: editingDebt.value.type,
        person_name: editingDebt.value.person_name,
        amount: parseFloat(editingDebt.value.amount),
        currency: editingDebt.value.currency,
        description: editingDebt.value.description,
        due_date: editingDebt.value.due_date,
    };
});

const editDebt = (debt: Debt) => {
    editDebtInStore(debt);
};

const removeDebtHandler = async (id: string) => {
    try {
        await removeDebt(id);
    } catch (error) {
        $toast.error('Ошибка', 'Не удалось удалить долг');
    }
};

const markAsPaid = async (id: string) => {
    try {
        await markDebtAsPaid(id);
    } catch (error) {
        $toast.error('Ошибка', 'Не удалось отметить долг как погашенный');
    }
};

const handleSubmitWrapper = async (data: DebtFormData) => {
    try {
        await handleSubmitInStore(data);
    } catch (error) {
        $toast.error('Ошибка', 'Не удалось сохранить долг');
    }
};

const handleDrawerVisibilityChange = (value: boolean) => {
    if (!value) {
        debtsStore.closeForm();
    }
};

onBeforeMount(async () => {
    await Promise.all([
        loadDebts(false),
        loadDebtBalance()
    ]);
});

</script>

<style scoped lang="scss">
.debts-page {
    padding: 2.4rem;
    padding-bottom: 10rem;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    &__header-button {
        width: 3.6rem;
        height: 3.6rem;
        flex-shrink: 0;
    }

    &__header-empty {
        width: 3.6rem;
        height: 3.6rem;
    }

    &__header>div {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    &__subtitle {
        font: var(--font-14-r);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 0 0;
    }

    &__balance {
        display: flex;
        gap: 1.2rem;
        margin-bottom: 2rem;

        &-item {
            flex: 1;
            padding: 1.6rem;
            border-radius: 1.6rem;
            background: var(--gold-card-bg);
            border: 1px solid var(--gold-border);
            box-shadow: var(--gold-shadow);
            display: flex;
            align-items: center;
            gap: 1.2rem;
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 1.6rem;
                background: var(--gold-card-radial);
                pointer-events: none;
            }
        }

        &-icon {
            width: 3.6rem;
            height: 3.6rem;
            color: var(--primary-500);
            position: relative;
            z-index: 1;
            flex-shrink: 0;
        }

        &-content {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            position: relative;
            z-index: 1;

            h5 {
                color: var(--text-color-secondary);
            }
        }
    }

    &__filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;

        &-row {
            :deep(.p-selectbutton) {
                width: 100%;

                .p-togglebutton {
                    width: 100%;
                }
            }
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        background: var(--gold-card-bg);
        border-radius: 1.6rem;
        border: 1px solid var(--gold-border);
        box-shadow: var(--gold-shadow);
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 1.6rem;
            background: var(--gold-card-radial);
            pointer-events: none;
        }

        &-icon {
            width: 6.4rem;
            height: 6.4rem;
            color: var(--primary-500);
            margin-bottom: 1.6rem;
            position: relative;
            z-index: 1;
            opacity: 0.5;
        }

        &-text {
            font: var(--font-18-b);
            color: var(--text-color);
            margin: 0 0 0.4rem 0;
            position: relative;
            z-index: 1;
        }

        &-hint {
            font: var(--font-14-r);
            color: var(--text-color-secondary);
            margin: 0;
            position: relative;
            z-index: 1;
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    &__loading {
        display: flex;
        justify-content: center;
        padding: 4rem 2rem;
    }

    &__footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem 2.4rem;
        background-color: var(--card-default);
        border-radius: 1.6rem 1.6rem 0 0;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
        z-index: 10;
    }
}
</style>
