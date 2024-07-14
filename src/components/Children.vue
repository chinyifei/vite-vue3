<template>
  <div>children:{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style></style>
