<template>
    <Drawer v-model:visible="localVisible" position="bottom" class="v-drawer"
        style="height: 66%; border-radius: var(--radius-l) var(--radius-l) 0 0;" :modal="true" :dismissable="true"
        @update:visible="handleVisibilityChange">
        <template #header>
            <slot name="header" />
        </template>

        <div class="v-drawer__content">
            <slot />
        </div>
    </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Drawer } from 'primevue';

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
}>();

const localVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
    localVisible.value = newValue;
});

const handleVisibilityChange = (value: boolean) => {
    localVisible.value = value;
    emit('update:visible', value);
};

</script>

<style scoped lang="scss">
.v-drawer {

    &__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        padding: 2rem 0 0 0;
    }
}
</style>
