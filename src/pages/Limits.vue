<template>
    <div class="limits-page">
        <div class="limits-page__header">
            <Button :icon="arrowLeft" severity="secondary" @click="router.back()" class="limits-page__header-button" />
            <h1 class="gold-text">Лимиты</h1>
            <div class="limits-page__header-empty" />
        </div>

        <div class="limits-page__content">
            <div v-if="limits.length === 0" class="limits-page__empty">
                <div class="limits-page__empty-icon">
                    <VIcon :icon="warning" />
                </div>ы
                <p class="limits-page__empty-text">Нет добавленных лимитов</p>
                <p class="limits-page__empty-hint">Добавьте первый лимит</p>
            </div>
            <div v-else class="limits-page__list">
                <LimitCard v-for="limit in limits" :key="limit.id" :limit="limit" @remove="removeLimit(limit.id)"
                    @edit="editLimit(limit)" />
            </div>
        </div>

        <div class="limits-page__footer">
            <Button label="Добавить лимит" fluid :icon="plus" @click="drawerVisible = true" />
        </div>
        <LimitForm v-model:visible="drawerVisible" :edit-data="editingLimit" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { arrowLeft, plus, warning } from '@/assets/icons';
import router from '@/router/router';
import { Button } from 'primevue';
import LimitForm from '@/components/Limits/LimitForm.vue';
import LimitCard from '@/components/Limits/LimitCard.vue';
import VIcon from '@/components/UI/VIcon.vue';
import type { LimitFormData } from '@/components/Limits/LimitForm.vue';
import type { Limit } from '@/composables/Limits/useLimits';
import { useLimits } from '@/composables/Limits/useLimits';

const drawerVisible = ref(false);
const editingLimit = ref<Limit | null>(null);
const { limits, addLimit, removeLimit, updateLimit } = useLimits();

watch(drawerVisible, (value) => {
    if (!value) {
        editingLimit.value = null;
    }
});

const editLimit = (limit: Limit) => {
    editingLimit.value = limit;
    drawerVisible.value = true;
};

const handleSubmit = (data: LimitFormData) => {
    if (editingLimit.value) {
        updateLimit(editingLimit.value.id, data);
        editingLimit.value = null;
    } else {
        addLimit(data);
    }
    drawerVisible.value = false;
};

</script>

<style scoped lang="scss">
.limits-page {
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