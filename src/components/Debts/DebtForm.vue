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
                    <VInputText v-model="formData.person_name" placeholder="Введите имя человека" label="Имя"
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
                    <VInputText v-model="formData.due_date" type="date" label="Срок возврата (необязательно)"
                        size="small" class="font-14-r" />
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
import type { DebtFormData } from '@/composables/Debts/types';
import { DebtType, DebtStatus } from '@/composables/Debts/types';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData?: DebtFormData | null;
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
    { label: 'Я занял(а)', value: DebtType.I_OWE },
    { label: 'Мне должны', value: DebtType.OWE_ME },
];

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
    if (newValue && props.editData) {
        formData.value = {
            type: props.editData.type,
            person_name: props.editData.person_name,
            amount: props.editData.amount,
            currency: props.editData.currency || 'uzs',
            description: props.editData.description || '',
            due_date: props.editData.due_date || '',
        };
    } else if (!newValue) {
        resetForm();
    }
});

watch(() => props.editData, (newData) => {
    if (newData && localVisible.value) {
        formData.value = {
            type: newData.type,
            person_name: newData.person_name,
            amount: newData.amount,
            currency: newData.currency || 'uzs',
            description: newData.description || '',
            due_date: newData.due_date || '',
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
    type: DebtType.I_OWE,
    person_name: '',
    amount: 0,
    currency: 'uzs',
    description: '',
    due_date: '',
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

const resetForm = () => {
    formData.value = {
        type: DebtType.I_OWE,
        person_name: '',
        amount: 0,
        currency: 'uzs',
        description: '',
        due_date: '',
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
