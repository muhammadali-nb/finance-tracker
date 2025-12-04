<template>
    <div class="main-balance">
        <div class="main-balance__item">
            <Button :icon="arrowDownLeft" severity="success" outlined class="main-balance__item-button" />
            <div class="main-balance__item-content">
                <h5 class="font-14-r">Приход</h5>
                <p class="font-20-r">500.000</p>
            </div>
        </div>
        <div class="main-balance__item">
            <Button :icon="arrowUpRight" severity="danger" outlined class="main-balance__item-button" />
            <div class="main-balance__item-content">
                <h5 class="font-14-r">Расход</h5>
                <p class="font-20-r">354.299</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import { arrowDownLeft, arrowUpRight } from '@/assets/icons';
</script>

<style scoped lang="scss">
.main-balance {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    padding: 3rem 0 0 0;


    &__item {
        width: 50%;
        padding: 1.2rem;
        border-radius: 1.6rem;
        background-color: var(--card-default);
        height: 11rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    &__item-content {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        h5 {
            color: var(--text-color-secondary);
        }
    }

    &__item-button {
        align-self: flex-end;
        width: 3.6rem;
        height: 3.6rem;
        --p-button-border-radius: 50%;
    }
}
</style>