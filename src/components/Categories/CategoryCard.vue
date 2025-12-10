<template>
    <div class="category-card">
        <div class="category-card__content">
            <div class="category-card__icon">
                <VIcon :icon="categoryIcon" />
            </div>
            <div class="category-card__info">
                <h3 class="category-card__name">{{ category.name }}</h3>
                <div class="category-card__meta">
                    <span class="category-card__type">{{ typeLabel }}</span>
                    <span v-if="category.isDefault" class="category-card__badge">По умолчанию</span>
                    <span v-if="category.isHidden"
                        class="category-card__badge category-card__badge--hidden">Скрыта</span>
                </div>
            </div>
        </div>
        <div class="category-card__menu-wrapper">
            <Button @click="toggleMenu" :icon="menuDots" text class="category-card__menu-button" />
            <TieredMenu ref="menu" :model="menuItems" popup />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button, TieredMenu } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import type { Category, CategoryType } from '@/composables/Categories/useCategories';
import { menuDots, arrowUpRight, arrowDownLeft, categories as defaultIcon, dollar } from '@/assets/icons';
import VIcon from '@/components/UI/VIcon.vue';

const props = defineProps<{
    category: Category;
}>();

const emit = defineEmits<{
    (e: 'remove'): void;
    (e: 'edit'): void;
    (e: 'toggle-visibility'): void;
}>();

const menu = ref();

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const typeLabel = computed(() => {
    const labels = {
        income: 'Доходы',
        expense: 'Расходы',
        debt: 'Долги',
    };
    return labels[props.category.type];
});

const typeIcons: Record<CategoryType, string> = {
    income: arrowDownLeft,
    expense: arrowUpRight,
    debt: dollar,
};

const categoryIcon = computed(() => {
    if (props.category.type === 'debt') console.log(props.category.icon, typeIcons[props.category.type], defaultIcon);
    return props.category.icon || typeIcons[props.category.type] || defaultIcon;
});

const menuItems = computed<MenuItem[]>(() => [
    {
        label: props.category.isHidden ? 'Показать' : 'Скрыть',
        command: () => {
            emit('toggle-visibility');
        },
    },
    {
        label: 'Редактировать',
        command: () => {
            emit('edit');
        },
    },
    {
        label: 'Удалить',
        command: () => {
            emit('remove');
        },
        disabled: props.category.isDefault,
    },
]);

</script>

<style scoped lang="scss">
.category-card {
    background: var(--gold-card-bg);
    border-radius: var(--radius-l);
    padding: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    border: 1px solid var(--gold-border);
    box-shadow: var(--gold-shadow);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: var(--radius-l);
        background: var(--gold-card-radial);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        border-color: var(--gold-border-hover);
        box-shadow: var(--gold-shadow-hover);

        &::before {
            opacity: 1;
        }
    }

    &__content {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        flex: 1;
        position: relative;
        z-index: 1;
    }

    &__icon {
        width: 4.4rem;
        height: 4.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1.2rem;
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.15) 100%);
        border: 1px solid rgba(255, 215, 0, 0.3);
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
        color: var(--primary-600);
        flex-shrink: 0;
        position: relative;
        z-index: 1;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        flex: 1;
        min-width: 0;
    }

    &__name {
        font: var(--font-16-b);
        margin: 0;
        color: var(--text-color);
    }

    &__meta {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
    }

    &__type {
        font: var(--font-12-r);
        color: var(--text-color-secondary);
    }

    &__badge {
        font: var(--font-10-r);
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-s);
        background-color: var(--secondary-200);
        color: var(--text-color-secondary);

        &--hidden {
            background-color: var(--p-red-100);
            color: var(--p-red-600);
        }
    }

    &__menu-wrapper {
        position: relative;
        flex-shrink: 0;
        z-index: 1;
    }

    &__menu-button {
        width: 2.4rem;
        height: 2.4rem;
    }
}
</style>
