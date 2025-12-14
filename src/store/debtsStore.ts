import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Debt, DebtCreateData, DebtUpdateData, DebtFormData, DebtBalance } from '@/composables/Debts/types';
import { DebtType, DebtStatus } from '@/composables/Debts/types';
import { useDebtsRequests } from '@/composables/Debts/requests';

export const useDebtsStore = defineStore('debts', () => {
    const debts = ref<Debt[]>([]);
    const balance = ref<DebtBalance | null>(null);
    const loading = ref<boolean>(false);
    const isLoaded = ref<boolean>(false);
    const drawerVisible = ref(false);
    const editingDebt = ref<Debt | null>(null);
    const { getDebts: fetchDebts, getDebtBalance: fetchDebtBalance, addDebt: addDebtRequest, updateDebt: updateDebtRequest, deleteDebt: deleteDebtRequest, markDebtAsPaid: markDebtAsPaidRequest } = useDebtsRequests();

    const sortedDebts = computed(() => {
        return [...debts.value].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        });
    });

    const convertFormDataToCreateData = (formData: DebtFormData): DebtCreateData => {
        return {
            type: formData.type,
            person_name: formData.person_name,
            amount: formData.amount,
            currency: formData.currency,
            description: formData.description,
            due_date: formData.due_date,
        };
    };

    const convertFormDataToUpdateData = (formData: DebtFormData): DebtUpdateData => {
        return {
            person_name: formData.person_name,
            amount: formData.amount,
            description: formData.description,
            status: editingDebt.value?.status || DebtStatus.OPEN,
            due_date: formData.due_date,
            settled_at: editingDebt.value?.settled_at || null,
        };
    };

    const loadDebts = async (force = false) => {
        if (!force && isLoaded.value && debts.value.length > 0) {
            return;
        }
        if (loading.value) return;
        try {
            loading.value = true;
            debts.value = await fetchDebts();
            isLoaded.value = true;
        } catch (error) {
            console.error('Failed to load debts:', error);
        } finally {
            loading.value = false;
        }
    };

    const loadDebtBalance = async () => {
        try {
            balance.value = await fetchDebtBalance();
        } catch (error) {
            console.error('Failed to load debt balance:', error);
        }
    };

    const addDebt = async (debtData: DebtCreateData) => {
        try {
            loading.value = true;
            await addDebtRequest(debtData);
            debts.value = await fetchDebts();
            await loadDebtBalance();
        } catch (error) {
            console.error('Failed to create debt:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const updateDebt = async (id: string, debtData: DebtUpdateData) => {
        try {
            loading.value = true;
            await updateDebtRequest(id, debtData);
            debts.value = await fetchDebts();
            await loadDebtBalance();
        } catch (error) {
            console.error('Failed to update debt:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const removeDebt = async (id: string) => {
        try {
            loading.value = true;
            await deleteDebtRequest(id);
            debts.value = debts.value.filter(debt => debt.id !== id);
            await loadDebtBalance();
        } catch (error) {
            console.error('Failed to delete debt:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const markDebtAsPaid = async (id: string) => {
        try {
            loading.value = true;
            await markDebtAsPaidRequest(id);
            debts.value = await fetchDebts();
            await loadDebtBalance();
        } catch (error) {
            console.error('Failed to mark debt as paid:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const editDebt = (debt: Debt) => {
        editingDebt.value = debt;
        drawerVisible.value = true;
    };

    const handleSubmit = async (formData: DebtFormData) => {
        if (editingDebt.value) {
            const updateData = convertFormDataToUpdateData(formData);
            await updateDebt(editingDebt.value.id, updateData);
            editingDebt.value = null;
        } else {
            const createData = convertFormDataToCreateData(formData);
            await addDebt(createData);
        }
        drawerVisible.value = false;
    };

    const closeForm = () => {
        drawerVisible.value = false;
        editingDebt.value = null;
    };

    return {
        debts: sortedDebts,
        balance,
        loading,
        isLoaded,
        drawerVisible,
        editingDebt,
        loadDebts,
        loadDebtBalance,
        addDebt,
        removeDebt,
        updateDebt,
        markDebtAsPaid,
        editDebt,
        handleSubmit,
        closeForm,
    };
});
