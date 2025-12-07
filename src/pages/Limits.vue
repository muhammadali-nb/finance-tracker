<template>
    <div class="limits-page">
        <div class="limits-page__header">
            <Button :icon="arrowLeft" severity="secondary" @click="router.back()" class="limits-page__header-button" />
            <h1>Лимиты</h1>
            <div class="limits-page__header-empty" />
        </div>

        <div class="limits-page__footer">
            <Button label="Добавить лимит" fluid :icon="plus" @click="drawerVisible = true" />
        </div>

        <LimitForm v-model:visible="drawerVisible" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { arrowLeft, plus } from '@/assets/icons';
import router from '@/router/router';
import { Button } from 'primevue';
import LimitForm from '@/components/Limits/LimitForm.vue';
import type { LimitFormData } from '@/components/Limits/LimitForm.vue';

const drawerVisible = ref(false);

const handleSubmit = (data: LimitFormData) => {
    console.log('Form submitted:', data);
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
    }

    &__header-button {
        width: 3.6rem;
        height: 3.6rem;
    }

    &__header-empty {
        width: 3.6rem;
        height: 3.6rem;
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