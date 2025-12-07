import { useLocalStorage } from '@vueuse/core';
import type { LimitFormData } from '@/components/Limits/LimitForm.vue';

export interface Limit extends LimitFormData {
    id: string;
    createdAt: string;
    month: string;
    year: number;
    spent?: number;
}

const STORAGE_KEY = 'limits';

export const useLimits = () => {
    const limits = useLocalStorage<Limit[]>(STORAGE_KEY, []);

    const addLimit = (formData: LimitFormData) => {
        const now = new Date();
        const month = now.toLocaleString('ru-RU', { month: 'long' });
        const year = now.getFullYear();

        const newLimit: Limit = {
            ...formData,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now.toISOString(),
            month,
            year,
        };

        limits.value = [...limits.value, newLimit];
        return newLimit;
    };

    const removeLimit = (id: string) => {
        limits.value = limits.value.filter(limit => limit.id !== id);
    };

    const updateLimit = (id: string, formData: LimitFormData) => {
        const index = limits.value.findIndex(limit => limit.id === id);
        if (index !== -1) {
            limits.value[index] = {
                ...limits.value[index],
                ...formData,
            };
        }
    };

    const getLimitsByMonth = (month: string, year: number) => {
        return limits.value.filter(limit => limit.month === month && limit.year === year);
    };

    return {
        limits,
        addLimit,
        removeLimit,
        updateLimit,
        getLimitsByMonth,
    };
};

