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
                    <p class="font-20-r gold-text">{{ formatAmount(totalBorrowed) }} UZS</p>
                </div>
            </div>
            <div class="debts-page__balance-item">
                <VIcon :icon="arrowUpRight" class="debts-page__balance-icon" />
                <div class="debts-page__balance-content">
                    <h5 class="font-14-r">Мне должны</h5>
                    <p class="font-20-r gold-text">{{ formatAmount(totalLent) }} UZS</p>
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
            <div v-if="filteredDebts.length === 0" class="debts-page__empty">
                <div class="debts-page__empty-icon">
                    <VIcon :icon="warning" />
                </div>
                <p class="debts-page__empty-text">Долги не найдены</p>
                <p class="debts-page__empty-hint">Попробуйте другие фильтры</p>
            </div>
            <div v-else class="debts-page__list">
                <DebtCard v-for="debt in filteredDebts" :key="debt.id" :debt="debt" @remove="removeDebt(debt.id)"
                    @edit="editDebt(debt)" @mark-paid="markAsPaid(debt.id)" />
            </div>
        </div>

        <div class="debts-page__footer">
            <Button label="Добавить долг" fluid :icon="plus" @click="drawerVisible = true" />
        </div>
        <DebtForm v-model:visible="drawerVisible" :edit-data="editingDebt" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, SelectButton } from 'primevue';
import DebtForm from '@/components/Debts/DebtForm.vue';
import DebtCard from '@/components/Debts/DebtCard.vue';
import VIcon from '@/components/UI/VIcon.vue';
import type { Debt, DebtType, DebtStatus, DebtFormData } from '@/composables/Debts/useDebts';
import { useDebts } from '@/composables/Debts/useDebts';
import { arrowDownLeft, arrowUpRight, plus, arrowLeft, warning } from '@/assets/icons';
import router from '@/router/router';

const drawerVisible = ref(false);
const editingDebt = ref<(DebtFormData & { id?: string }) | null>(null);
const selectedType = ref<DebtType | 'all'>('all');
const selectedStatus = ref<DebtStatus | 'all'>('all');

const {
    debts,
    addDebt,
    removeDebt: removeDebtAction,
    updateDebt,
    markAsPaid: markAsPaidAction,
    getFilteredDebts,
    getTotalBorrowed,
    getTotalLent,
} = useDebts();

const totalBorrowed = computed(() => getTotalBorrowed());
const totalLent = computed(() => getTotalLent());

const typeFilterOptions = [
    { label: 'Все', value: 'all' as const },
    { label: 'Я занял(а)', value: 'borrowed' as DebtType },
    { label: 'Мне должны', value: 'lent' as DebtType },
];

const statusFilterOptions = [
    { label: 'Открытые', value: 'open' as DebtStatus },
    { label: 'Просрочено', value: 'overdue' as DebtStatus },
    { label: 'Погашено', value: 'paid' as DebtStatus },
];

const filteredDebts = computed(() => {
    const type = selectedType.value === 'all' ? 'all' : selectedType.value;
    const status = selectedStatus.value === 'all' ? 'all' : selectedStatus.value;
    return getFilteredDebts(type, status);
});

watch(drawerVisible, (value) => {
    if (!value) {
        editingDebt.value = null;
    }
});

const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU');
};

const editDebt = (debt: Debt) => {
    editingDebt.value = {
        id: debt.id,
        type: debt.type,
        personName: debt.personName,
        amount: debt.amount,
        description: debt.description,
        dueDate: debt.dueDate,
        status: debt.status,
    };
    drawerVisible.value = true;
};

const removeDebt = (id: string) => {
    removeDebtAction(id);
};

const markAsPaid = (id: string) => {
    markAsPaidAction(id);
};

const handleSubmit = (data: DebtFormData) => {
    if (editingDebt.value && editingDebt.value.id) {
        updateDebt(editingDebt.value.id, data);
        editingDebt.value = null;
    } else {
        addDebt(data);
    }
    drawerVisible.value = false;
};

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
