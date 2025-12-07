<template>
    <VDrawer v-model:visible="localVisible" @update:visible="handleVisibilityChange">
        <template #header>
            <h2 class="limit-form__title">Добавить лимит</h2>
        </template>

        <VForm @submit-form="handleSubmit" class="limit-form__form-wrapper">
            <div class="limit-form__form">
                <div class="limit-form__form-section">
                    <VSelect v-model="formData.category" :options="categories" option-label="name" option-value="name"
                        placeholder="Выберите категорию для лимита" label="Категория" :rules="categoryRules"
                        size="small" class="font-14-r" />
                </div>

                <div class="limit-form__form-section">
                    <VInputNumber v-model="formData.budget" class="font-14-r" :min="0" :max-fraction-digits="0"
                        suffix=" UZS" placeholder="0" label="Месячный бюджет" :rules="budgetRules" />
                </div>

                <div class="limit-form__form-section">
                    <div class="limit-form__form-info">
                        <label class="limit-form__form-info-label">Период бюджета</label>
                        <p class="limit-form__form-info-text">
                            Этот бюджет будет применяться к текущему месяцу ({{ currentMonth }})
                        </p>
                    </div>
                </div>

                <div class="limit-form__form-section">
                    <p class="limit-form__form-hint">
                        Установите лимит расходов и нажмите "Сохранить лимит" ниже для начала отслеживания.
                    </p>
                </div>
            </div>

            <div class="limit-form__footer">
                <Button label="Сохранить лимит" type="submit" fluid severity="primary" class="limit-form__submit" />
            </div>
        </VForm>
    </VDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button } from 'primevue';
import VDrawer from '@/components/UI/VDrawer.vue';
import VForm from '@/components/Form/VForm.vue';
import VInputNumber from '@/components/Form/VInputNumber.vue';
import VSelect from '@/components/Form/VSelect.vue';
import type { FormRule } from '@/composables/Form/types';

export interface LimitFormData {
    category: string | undefined;
    budget: number;
}

export interface Category {
    name: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        visible: boolean;
        categories?: Category[];
    }>(),
    {
        categories: () => [
            { name: 'Питание', value: 'food' },
            { name: 'Транспорт', value: 'transport' },
            { name: 'Развлечения', value: 'entertainment' },
            { name: 'Покупки', value: 'shopping' },
            { name: 'Услуги', value: 'services' },
            { name: 'Прочее', value: 'other' },
        ],
    }
);

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: LimitFormData): void;
}>();

const localVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
});

const handleVisibilityChange = (value: boolean) => {
    localVisible.value = value;
    emit('update:visible', value);
    if (!value) {
        resetForm();
    }
};

const formData = ref<LimitFormData>({
    category: undefined,
    budget: 0,
});

const currentMonth = computed(() => {
    const date = new Date();
    const months = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()} г.`;
});

const categoryRules: FormRule<string | number | undefined>[] = [
    (value) => {
        if (!value) return 'Выберите категорию';
        return true;
    },
];

const budgetRules: FormRule<number>[] = [
    (value) => {
        if (!value || value <= 0) return 'Введите сумму больше 0';
        return true;
    },
];

const resetForm = () => {
    formData.value = {
        category: undefined,
        budget: 0,
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
.limit-form {
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

    &__form-hint {
        font: var(--font-12-r);
        color: var(--text-color-secondary);
        margin: 0;
        padding: 1.6rem;
        background-color: var(--card-default);
        border-radius: var(--radius-l);
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
