<template>
    <div class="main-balance">
        <div class="main-balance__item">
            <Button :icon="arrowDownLeft" severity="success" outlined class="main-balance__item-button" />
            <div class="main-balance__item-content">
                <h5 class="font-14-r">Приход</h5>
                <p class="font-20-r gold-text">500.000</p>
            </div>
        </div>
        <div class="main-balance__item">
            <Button :icon="arrowUpRight" severity="danger" outlined class="main-balance__item-button" />
            <div class="main-balance__item-content">
                <h5 class="font-14-r">Расход</h5>
                <p class="font-20-r gold-text">354.299</p>
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
        background: var(--gold-card-bg);
        height: 11rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid var(--gold-border);
        box-shadow: var(--gold-shadow);
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60%;
            height: 100%;
            background: var(--gold-card-radial);
            pointer-events: none;
        }

        &:hover {
            border-color: var(--gold-border-hover);
            box-shadow: var(--gold-shadow-hover);
            transform: translateY(-2px);
        }
    }

    &__item-content {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        position: relative;
        z-index: 1;

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