<template>
    <div class="main-header">
        <div class="main-header__content">
            <div class="main-header__content-avatar">
                <img src="https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="logo" />
            </div>
            <div class="main-header__content-info">
                <h1>
                    Привет, Ali
                </h1>
                <p>Твой умный трекер расходов</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;

    }

    &__content-avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__content-info {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        h1 {
            font: var(--font-18-b);
        }

        p {
            font: var(--font-14-r);
        }
    }

}
</style>