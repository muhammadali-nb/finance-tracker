<script setup lang="ts">
import { Button } from 'primevue';
import Transaction from '../UI/Transaction.vue';
import { barber, burger, shop, taxi } from '@/assets/icons';

const transactions = [
    {
        id: 1,
        icon: taxi,
        title: 'Такси',
        amount: 1340,
        date: '12:00',
    },
    {
        id: 2,
        icon: burger,
        title: 'Бургер',
        amount: 112000,
        date: '11:00',
    },
    {
        id: 3,
        icon: shop,
        title: 'Магазин',
        amount: 100000,
        date: '14:33',
    },
    {
        id: 4,
        icon: barber,
        title: 'Барбер',
        amount: 10200,
        date: '15:01',
    },
];
</script>

<template>
    <div class="main-transactions">
        <div class="main-transactions__header">
            <h1 class="font-20-b gold-text">Транзакции</h1>
            <Button label="Посмотреть все" text size="small" />
        </div>
        <div class="main-transactions__list">
            <Transaction v-for="i in transactions" :key="i.id" :transaction="i" />
        </div>
    </div>

</template>

<style scoped lang="scss">
.main-transactions {
    background: var(--gold-card-bg);
    padding: 1.2rem;
    border-radius: 1.6rem;
    margin-top: 1.2rem;
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

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 1.2rem 0;
        position: relative;
        z-index: 1;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: .4rem;
        position: relative;
        z-index: 1;
    }
}
</style>