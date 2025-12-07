import { useLocalStorage } from '@vueuse/core';

export type CategoryType = 'income' | 'expense' | 'debt';

export interface CategoryFormData {
    name: string;
    type: CategoryType;
    icon?: string;
    isHidden: boolean;
}

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    icon?: string;
    isHidden: boolean;
    createdAt: string;
    isDefault: boolean;
}

const STORAGE_KEY = 'categories';

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
    { name: 'Питание', type: 'expense', icon: '', isHidden: false, isDefault: true },
    { name: 'Транспорт', type: 'expense', icon: '', isHidden: false, isDefault: true },
    { name: 'Развлечения', type: 'expense', icon: '', isHidden: false, isDefault: true },
    { name: 'Покупки', type: 'expense', icon: '', isHidden: false, isDefault: true },
    { name: 'Услуги', type: 'expense', icon: '', isHidden: false, isDefault: true },
    { name: 'Зарплата', type: 'income', icon: '', isHidden: false, isDefault: true },
    { name: 'Долг', type: 'debt', icon: '', isHidden: false, isDefault: true },
];

export const useCategories = () => {
    const categories = useLocalStorage<Category[]>(STORAGE_KEY, []);

    if (categories.value.length === 0) {
        const now = new Date();
        categories.value = DEFAULT_CATEGORIES.map((cat) => ({
            ...cat,
            id: `default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now.toISOString(),
        }));
    }

    const addCategory = (formData: CategoryFormData) => {
        const newCategory: Category = {
            ...formData,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            isDefault: false,
        };

        categories.value = [...categories.value, newCategory];
        return newCategory;
    };

    const removeCategory = (id: string) => {
        const category = categories.value.find(cat => cat.id === id);
        // Нельзя удалять дефолтные категории
        if (category?.isDefault) {
            return false;
        }
        categories.value = categories.value.filter(cat => cat.id !== id);
        return true;
    };

    const updateCategory = (id: string, formData: CategoryFormData) => {
        const index = categories.value.findIndex(cat => cat.id === id);
        if (index !== -1) {
            const category = categories.value[index];
            // Нельзя менять тип дефолтных категорий
            if (category.isDefault && formData.type !== category.type) {
                return false;
            }
            categories.value[index] = {
                ...categories.value[index],
                ...formData,
            };
            return true;
        }
        return false;
    };

    const toggleCategoryVisibility = (id: string) => {
        const index = categories.value.findIndex(cat => cat.id === id);
        if (index !== -1) {
            categories.value[index].isHidden = !categories.value[index].isHidden;
            return true;
        }
        return false;
    };

    const getCategoriesByType = (type: CategoryType | null) => {
        if (!type) {
            return categories.value;
        }
        return categories.value.filter(cat => cat.type === type);
    };

    return {
        categories,
        addCategory,
        removeCategory,
        updateCategory,
        toggleCategoryVisibility,
        getCategoriesByType,
    };
};

