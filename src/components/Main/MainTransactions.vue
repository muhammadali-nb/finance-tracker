<script setup lang="ts">
import { Button } from 'primevue';


</script>

<template>
    <div class="main-transactions">
        <div class="main-transactions__header">
            <h1 class="font-20-b">Транзакции</h1>
            <Button label="Посмотреть все" text size="small" />
        </div>
    </div>

</template>

<style scoped lang="scss">
.main-transactions {
    background-color: var(--card-default);
    padding: 1.2rem;
    border-radius: 1.6rem;
    margin-top: 1.2rem;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>