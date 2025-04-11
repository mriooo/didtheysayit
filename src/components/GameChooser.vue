<template>
  <div>
    <div v-if="!selectedPerson">
      <h2>Select a Person</h2>
      <ul>
        <li v-for="person in persons" :key="person.id">
          <button @click="selectPerson(person)" class="btn btn-secondary" style="width: 200px;">
            <img
              class="mb-3 app-logo"
              :src="getPersonImage(person.id)"
              :alt="`Image of ${person.id}`"
              width="120"
            />
            {{ person.name }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <GameComponent :personId="selectedPerson.id" :personName="selectedPerson.name" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuoteStore } from '../store';
import GameComponent from './GameComponent.vue';

const quoteStore = useQuoteStore();
const persons = ref([]);
const selectedPerson = ref(null);

// Function to load persons from the store
const loadPersons = async () => {
  await quoteStore.loadPersons(); // Ensure persons are loaded
  persons.value = quoteStore.persons; // Get the list of persons
};

// Function to select a person
const selectPerson = (person) => {
  selectedPerson.value = person;
};

// Function to get the image path for a person
const getPersonImage = (personId) => {
  return new URL(`../assets/${personId}.png`, import.meta.url).href;
};

// Load persons when the component is mounted
onMounted(() => {
  loadPersons();
  quoteStore.loadQuotes(); // Load quotes for the game
});
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}
</style>