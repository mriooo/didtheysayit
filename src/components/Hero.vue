<template>
  <div class="text-center hero">
    <img class="mb-3 app-logo" src="../assets/KarlMarx.png" alt="Game logo" width="120" />
    <h1 v-if="isAuthenticated" class="mb-4">{{user.name}}, lets go.</h1>
    <h1 v-else="isAuthenticated" class="mb-4">Welcome to DTSI! </h1>
    <p class="lead">
      "Did they say it?" is the most cringe-worthy and anxiety-inducing game on the internet. <br />
      It's a game where you have to guess if a quote was said by a person or not.
    </p>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, onMounted } from 'vue';

const auth0 = useAuth0();
const isAuthenticated = auth0.isAuthenticated;
const user = auth0.user;

</script>
