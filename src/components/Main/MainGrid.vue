<script setup lang="ts">
import { analitcs, book, categories, rounded } from '@/assets/icons';
import VIcon from '../UI/VIcon.vue';
import { Button } from 'primevue';
const items = [
  {
    id: 1,
    title: 'Лимиты',
    icon: rounded,
    color: 'var(--primary-500)',
    link: '/limits'
  },
  {
    id: 2,
    title: 'Категории',
    icon: categories,
    color: 'var(--p-blue-500)',
    link: '/categories'
  },
  {
    id: 3,
    title: 'Долги',
    icon: book,
    color: 'var(--p-red-500)',
    link: '/limits'
  },
  {
    id: 4,
    title: 'Аналитика',
    icon: analitcs,
    color: '#8b00ff',
    link: '/limits'
  }
];
//   {
//     id: 1,
//     title: 'Лимиты',
//     icon: rounded,
//     color: 'var(--primary-500)'
//   },
//   {
//     id: 2,
//     title: 'Категории',
//     icon: categories,
//     color: 'var(--primary-500)'
//   },
//   {
//     id: 3,
//     title: 'Долги',
//     icon: book,
//     color: 'var(--primary-500)'
//   },
//   {
//     id: 4,
//     title: 'Аналитика',
//     icon: analitcs,
//     color: 'var(--primary-500)'
//   }
// ];
</script>


<template>
  <div class="main-grid">
    <Button class="main-grid__item" v-for="i in items" :key="i.id" as="router-link" :to="i.link" severity="secondary">
      <VIcon :icon="i.icon" class="main-grid__item-icon" :color="i.color" />
      <h1 class="font-16-r">{{ i.title }}</h1>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.main-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  border-radius: 1.6rem;
  margin-top: 1.6rem;


  &__item {
    padding: 1.6rem;
    border-radius: 1.6rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 1.4rem;
    aspect-ratio: 1.5/1;
    text-decoration: none;
  }

  &__item-icon {
    width: 3rem;
    height: 3rem;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>