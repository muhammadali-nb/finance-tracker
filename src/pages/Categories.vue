<template>
    <div class="categories-page">
        <div class="categories-page__header">
            <Button :icon="arrowLeft" severity="secondary" @click="router.back()"
                class="categories-page__header-button" />
            <h1>Категории</h1>
            <div class="categories-page__header-empty" />
        </div>

        <div class="categories-page__filters">
            <SelectButton v-model="selectedType" :options="filterOptions" option-label="label" option-value="value"
                :allow-empty="false" />
        </div>

        <div class="categories-page__content">
            <div v-if="filteredCategories.length === 0" class="categories-page__empty">
                <p class="categories-page__empty-text">
                    {{ selectedType !== 'all' ? 'Нет категорий этого типа' : 'Нет добавленных категорий' }}
                </p>
            </div>
            <div v-else class="categories-page__list">
                <CategoryCard v-for="category in filteredCategories" :key="category.id" :category="category"
                    @remove="removeCategory(category.id)" @edit="editCategory(category)"
                    @toggle-visibility="toggleCategoryVisibility(category.id)" />
            </div>
        </div>

        <div class="categories-page__footer">
            <Button label="Добавить категорию" fluid :icon="plus" @click="drawerVisible = true" />
        </div>
        <CategoryForm v-model:visible="drawerVisible" :edit-data="editingCategory" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { arrowLeft, plus, arrowUpRight, arrowDownLeft, dollar } from '@/assets/icons';
import router from '@/router/router';
import { Button, SelectButton } from 'primevue';
import CategoryForm from '@/components/Categories/CategoryForm.vue';
import CategoryCard from '@/components/Categories/CategoryCard.vue';
import type { Category, CategoryType, CategoryFormData } from '@/composables/Categories/useCategories';
import { useCategories } from '@/composables/Categories/useCategories';
import { useToastStore } from '@/store/toastsStore';

const drawerVisible = ref(false);
const editingCategory = ref<(CategoryFormData & { isDefault?: boolean; id?: string }) | null>(null);
const selectedType = ref<CategoryType | 'all'>('all');
const { categories, addCategory, removeCategory: removeCategoryAction, updateCategory, toggleCategoryVisibility, getCategoriesByType } = useCategories();
const $toast = useToastStore();

const filterOptions = [
    { label: 'Все', value: 'all' as const },
    { label: 'Доходы', value: 'income' as CategoryType },
    { label: 'Расходы', value: 'expense' as CategoryType },
    { label: 'Долги', value: 'debt' as CategoryType },
];

const filteredCategories = computed(() => {
    const type = selectedType.value === 'all' ? null : selectedType.value;
    return getCategoriesByType(type);
});

watch(drawerVisible, (value) => {
    if (!value) {
        editingCategory.value = null;
    }
});

const editCategory = (category: Category) => {
    editingCategory.value = {
        id: category.id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        isHidden: category.isHidden,
        isDefault: category.isDefault,
    };
    drawerVisible.value = true;
};

const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
        case 'income':
            return arrowUpRight;
        case 'expense':
            return arrowDownLeft;
        case 'debt':
            return dollar;
        default:
            return arrowDownLeft;
    }
};

const removeCategory = (id: string) => {
    const category = categories.value.find(cat => cat.id === id);
    const success = removeCategoryAction(id);
    if (!success && category) {
        $toast.warning(
            'Нельзя удалить категорию по умолчанию',
            `Категория "${category.name}" является категорией по умолчанию и не может быть удалена`,
            getCategoryIcon(category.type)
        );
    }
};

const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory.value && editingCategory.value.id) {
        const category = categories.value.find(cat => cat.id === editingCategory.value?.id);
        const success = updateCategory(editingCategory.value.id, data);
        if (!success && category) {
            $toast.error(
                'Не удалось обновить категорию',
                category.isDefault && data.type !== category.type
                    ? 'Нельзя изменить тип категории по умолчанию'
                    : 'Произошла ошибка при обновлении категории',
                getCategoryIcon(category.type)
            );
        }
        editingCategory.value = null;
    } else {
        addCategory(data);
    }
    drawerVisible.value = false;
};

</script>

<style scoped lang="scss">
.categories-page {
    padding: 2.4rem;
    padding-bottom: 10rem;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    &__header-button {
        width: 3.6rem;
        height: 3.6rem;
    }

    &__header-empty {
        width: 3.6rem;
        height: 3.6rem;
    }

    &__filters {
        margin-bottom: 2rem;

        :deep(.p-selectbutton) {
            width: 100%;

            .p-togglebutton {
                width: 100%;
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
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
    }

    &__empty-text {
        font: var(--font-14-r);
        color: var(--text-color-secondary);
        margin: 0;
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
