<template>
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <div class="container">
      <error />
      <div class="mt-5 mb-5">
        <router-view />
      </div>
    </div>
    <footer class="bg-light text-center p-3">
      <p>
        Did they say it?
        <br />
        The best game you can play on the internet today (and tomorrow). Guaranteed. Maybe. Probably. Who knows?
        <br />
        &copy; 2025 some unemployed developer
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import NavBar from "./components/NavBar.vue";
import Error from "./components/Error.vue";

export default {
  components: {
    NavBar,
    Error
  }
};
</script>
