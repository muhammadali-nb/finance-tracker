<template>
    <VDrawer v-model:visible="localVisible" @update:visible="handleVisibilityChange">
        <template #header>
            <h2 class="debt-form__title">{{ isEditMode ? 'Редактировать долг' : 'Добавить долг' }}</h2>
        </template>

        <VForm @submit-form="handleSubmit" class="debt-form__form-wrapper">
            <div class="debt-form__form">
                <div class="debt-form__form-section">
                    <VSelect v-model="formData.type" :options="typeOptions" option-label="label" option-value="value"
                        placeholder="Выберите тип долга" label="Тип долга" :rules="typeRules" size="small"
                        class="font-14-r" />
                </div>

                <div class="debt-form__form-section">
                    <VInputText v-model="formData.personName" placeholder="Введите имя человека" label="Имя"
                        :rules="nameRules" size="small" class="font-14-r" />
                </div>

                <div class="debt-form__form-section">
                    <VInputNumber v-model="formData.amount" class="font-14-r" :min="0" :max-fraction-digits="0"
                        suffix=" UZS" placeholder="0" label="Сумма" :rules="amountRules" />
                </div>

                <div class="debt-form__form-section">
                    <VInputText v-model="formData.description" placeholder="Описание (необязательно)" label="Описание"
                        size="small" class="font-14-r" />
                </div>

                <div class="debt-form__form-section">
                    <VInputText v-model="formData.dueDate" placeholder="ДД.ММ.ГГГГ" label="Срок возврата (необязательно)"
                        size="small" class="font-14-r" />
                </div>

                <div class="debt-form__form-section">
                    <VSelect v-model="formData.status" :options="statusOptions" option-label="label" option-value="value"
                        placeholder="Выберите статус" label="Статус" :rules="statusRules" size="small"
                        class="font-14-r" />
                </div>
            </div>

            <div class="debt-form__footer">
                <Button :label="isEditMode ? 'Сохранить изменения' : 'Добавить долг'" type="submit" fluid
                    severity="primary" class="debt-form__submit" />
            </div>
        </VForm>
    </VDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button } from 'primevue';
import VDrawer from '@/components/UI/VDrawer.vue';
import VForm from '@/components/Form/VForm.vue';
import VInputText from '@/components/Form/VInputText.vue';
import VInputNumber from '@/components/Form/VInputNumber.vue';
import VSelect from '@/components/Form/VSelect.vue';
import type { FormRule } from '@/composables/Form/types';
import type { DebtFormData, DebtType, DebtStatus } from '@/composables/Debts/useDebts';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData?: DebtFormData & { id?: string } | null;
    }>(),
    {
        editData: null,
    }
);

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: DebtFormData): void;
}>();

const localVisible = ref(props.visible);
const isEditMode = computed(() => !!props.editData);

const typeOptions = [
    { label: 'Я занял(а)', value: 'borrowed' as DebtType },
    { label: 'Мне должны', value: 'lent' as DebtType },
];

const statusOptions = [
    { label: 'Открыт', value: 'open' as DebtStatus },
    { label: 'Просрочен', value: 'overdue' as DebtStatus },
    { label: 'Погашен', value: 'paid' as DebtStatus },
];

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
    if (newValue && props.editData) {
        formData.value = {
            type: props.editData.type,
            personName: props.editData.personName,
            amount: props.editData.amount,
            description: props.editData.description || '',
            dueDate: props.editData.dueDate || '',
            status: props.editData.status,
        };
    } else if (!newValue) {
        resetForm();
    }
});

watch(() => props.editData, (newData) => {
    if (newData && localVisible.value) {
        formData.value = {
            type: newData.type,
            personName: newData.personName,
            amount: newData.amount,
            description: newData.description || '',
            dueDate: newData.dueDate || '',
            status: newData.status,
        };
    }
});

const handleVisibilityChange = (value: boolean) => {
    localVisible.value = value;
    emit('update:visible', value);
    if (!value) {
        resetForm();
    }
};

const formData = ref<DebtFormData>({
    type: 'borrowed',
    personName: '',
    amount: 0,
    description: '',
    dueDate: '',
    status: 'open',
});

const nameRules: FormRule<string>[] = [
    (value) => {
        if (!value || value.trim().length === 0) return 'Введите имя человека';
        if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
        return true;
    },
];

const typeRules: FormRule<string | number>[] = [
    (value) => {
        if (!value) return 'Выберите тип долга';
        return true;
    },
];

const amountRules: FormRule<number>[] = [
    (value) => {
        if (!value || value <= 0) return 'Введите сумму больше 0';
        return true;
    },
];

const statusRules: FormRule<string | number>[] = [
    (value) => {
        if (!value) return 'Выберите статус';
        return true;
    },
];

const resetForm = () => {
    formData.value = {
        type: 'borrowed',
        personName: '',
        amount: 0,
        description: '',
        dueDate: '',
        status: 'open',
    };
};

const handleSubmit = () => {
    emit('submit', { ...formData.value });
    localVisible.value = false;
    emit('update:visible', false);
    resetForm();
};

</script>

<style scoped lang="scss">
.debt-form {
    &__form-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    &__title {
        font: var(--font-20-b);
        margin: 0;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        padding-bottom: 1.6rem;
    }

    &__form-section {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    &__footer {
        padding: 2rem 0 .6rem 0;
        border-top: 1px solid var(--border-light);
        margin-top: auto;
    }

    &__submit {
        width: 100%;
    }
}
</style>

