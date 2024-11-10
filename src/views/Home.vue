<template>
  <div>HOME</div>
  <Child :name="'名字'"></Child>
  <RouterLink to="/demo">Go to DEMO</RouterLink>
  <br />
  <RouterLink to="/calendar">Go to calendar</RouterLink>
</template>

<script setup lang="ts">
import Child from '../components/Children.vue'
</script>
