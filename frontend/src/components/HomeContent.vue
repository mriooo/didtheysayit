<template>
  <div v-if="isAuthenticated">
  </div>
  <div v-else>
    <h1>Please login to play this epic game.</h1>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();
const isAuthenticated = auth0.isAuthenticated;
</script>

<style>

</style>