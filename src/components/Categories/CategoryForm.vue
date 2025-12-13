<template>
    <VDrawer v-model:visible="localVisible" @update:visible="handleVisibilityChange">
        <template #header>
            <h2 class="category-form__title">{{ isEditMode ? 'Редактировать категорию' : 'Добавить категорию' }}</h2>
        </template>

        <VForm @submit-form="handleSubmit" class="category-form__form-wrapper">

            <div class="category-form__form">
                <div class="category-form__form-section">
                    <VSelect v-model="formData.type" :options="typeOptions" option-label="label" option-value="value"
                        placeholder="Выберите тип категории" label="Тип категории" :rules="typeRules" size="small"
                        class="font-14-r" :disabled="isEditMode && isDefaultCategory" />
                </div>

                <div class="category-form__form-section">
                    <VInputText v-model="formData.name" placeholder="Введите название категории" label="Название"
                        :rules="nameRules" size="small" class="font-14-r" />
                </div>

                <div class="category-form__form-section">
                    <div class="category-form__form-info">
                        <label class="category-form__form-info-label">Видимость категории</label>
                        <p class="category-form__form-info-text">
                            Скрытые категории не будут отображаться в списке транзакций
                        </p>
                    </div>
                    <div class="category-form__checkbox-wrapper">
                        <Checkbox v-model="formData.isHidden" :binary="true" inputId="isHidden" />
                        <label for="isHidden" class="category-form__checkbox-label">Скрыть категорию</label>
                    </div>
                </div>
            </div>

            <div class="category-form__footer">
                <Button :label="isEditMode ? 'Сохранить изменения' : 'Сохранить категорию'" type="submit" fluid
                    severity="primary" class="category-form__submit" />
            </div>
        </VForm>
    </VDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, Checkbox } from 'primevue';
import VDrawer from '@/components/UI/VDrawer.vue';
import VForm from '@/components/Form/VForm.vue';
import VInputText from '@/components/Form/VInputText.vue';
import VSelect from '@/components/Form/VSelect.vue';
import type { FormRule } from '@/composables/Form/types';
import type { CategoryFormData } from '@/composables/Categories/useCategories';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData?: CategoryFormData & { isDefault?: boolean } | null;
    }>(),
    {
        editData: null,
    }
);

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: CategoryFormData): void;
}>();

const localVisible = ref(props.visible);
const isEditMode = computed(() => !!props.editData);
const isDefaultCategory = computed(() => props.editData?.isDefault || false);

const typeOptions = [
    { label: 'Доходы', value: 'income' },
    { label: 'Расходы', value: 'expense' },
    { label: 'Долги', value: 'debt' },
];

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
    if (newValue && props.editData) {
        formData.value = {
            name: props.editData.name,
            type: props.editData.type,
            icon: props.editData.icon || '',
            isHidden: props.editData.isHidden,
        };
    } else if (!newValue) {
        resetForm();
    }
});

watch(() => props.editData, (newData) => {
    if (newData && localVisible.value) {
        formData.value = {
            name: newData.name,
            type: newData.type,
            icon: newData.icon || '',
            isHidden: newData.isHidden,
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

const formData = ref<CategoryFormData>({
    name: '',
    type: 'expense',
    icon: '',
    isHidden: false,
});

const nameRules: FormRule<string>[] = [
    (value) => {
        if (!value || value.trim().length === 0) return 'Введите название категории';
        if (value.trim().length < 2) return 'Название должно содержать минимум 2 символа';
        return true;
    },
];

const typeRules: FormRule<string | number>[] = [
    (value) => {
        if (!value) return 'Выберите тип категории';
        return true;
    },
];

const resetForm = () => {
    formData.value = {
        name: '',
        type: 'expense',
        icon: '',
        isHidden: false,
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
.category-form {
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

    &__form-info {
        padding: 1.6rem;
        background-color: var(--card-default);
        border-radius: var(--radius-l);
    }

    &__form-info-label {
        font: var(--font-14-r);
        display: block;
        margin-bottom: 0.8rem;
        color: var(--text-color);
    }

    &__form-info-text {
        font: var(--font-12-r);
        color: var(--text-color-secondary);
        margin: 0;
    }

    &__checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem 0 0 0;
    }

    &__checkbox-label {
        font: var(--font-14-r);
        color: var(--text-color);
        cursor: pointer;
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
