<template>
  <div>
    Foo:
    <slot :default-value="defaultValue"> this is default slot </slot>
    <slot :list="list" name="foo"></slot>
    <slot :footer="footer" name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const defaultValue = ref('default')
const list = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const footer = ref('footer')
</script>
<style lang="scss" scoped></style>
