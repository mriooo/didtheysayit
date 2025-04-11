<template>
  <div v-if="isAuthenticated" class="game-container" :class="{'correct-answer': isCorrect, 'wrong-answer': isCorrect === false}">
    <div class="person-image">
      <img :src="getPersonImage(props.personId)" :alt="`Image of ${props.personId}`" />
    </div>
    <div class="quote-container">
      <div v-if="!gameOver">
        <div v-if="currentQuote">
          <h2>Did {{ props.personName }} really say it?</h2>
          <h3> {{  currentQuote.context }}</h3>
          <blockquote>
            <p>{{ currentQuote.quote }}</p>
          </blockquote>
          <div v-if="!answered">
            <button @click="handleAnswer(true)">True</button>
            <button @click="handleAnswer(false)">False</button>
          </div>
          <div v-else class="reveal-container">
            <p class="reveal-message">{{ currentQuote.reveal }}</p>
            <button @click="loadNextQuote">Next</button>
          </div>
        </div>
        <div v-else>
          <h2>Loading a random quote...</h2>
        </div>
      </div>
      <div v-else>
        <h2>Game Over!</h2>
        <p>Your Score: {{ score }}/{{ totalQuestions }}</p>
        <p>{{ getScoreExplanation() }}</p>
        <button @click="restartGame">Play Again</button>
      </div>
    </div>
  </div>
  <div v-else>
    <h1>Please login to play this epic game.</h1>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useQuoteStore } from '../store';
import { useAuth0 } from '@auth0/auth0-vue';

const props = defineProps({
  personId: String, // Accept the selected person's ID as a prop
  personName: String
});

const quoteStore = useQuoteStore();
const auth0 = useAuth0();
const isAuthenticated = auth0.isAuthenticated;

// Reactive state for the current quote, score, and game status
const currentQuote = ref(null);
const answered = ref(false);
const isCorrect = ref(null); // Tracks whether the user's answer is correct
const score = ref(0); // Tracks the number of correct answers
const totalQuestions = ref(0); // Total number of questions
const gameOver = ref(false); // Tracks whether the game is over

var currentQuoteNumber = ref(0);

// Function to load quotes for the selected person
const loadQuotesForPerson = () => {
  const personQuotes = quoteStore.allQuotes.filter(
    (quote) => quote.personId === props.personId
  );
  totalQuestions.value = personQuotes.length; // Set total questions
  if (personQuotes.length > 0 && currentQuoteNumber.value < personQuotes.length) {
    currentQuote.value = personQuotes[currentQuoteNumber.value];
    answered.value = false; // Reset answered state
    isCorrect.value = null; // Reset correctness state
  } else {
    gameOver.value = true; // End the game if no more quotes
  }
};

// Function to handle the user's answer
const handleAnswer = (userAnswer) => {
  if (currentQuote.value) {
    isCorrect.value = currentQuote.value.real === userAnswer; // Determine if the answer is correct
    if (isCorrect.value) {
      score.value++; // Increment score if the answer is correct
    }
    answered.value = true; // Mark as answered
  }
};

// Function to load the next quote
const loadNextQuote = () => {
  currentQuoteNumber.value++;
  loadQuotesForPerson();
};

// Function to restart the game
const restartGame = () => {
  score.value = 0;
  currentQuoteNumber.value = 0;
  gameOver.value = false;
  loadQuotesForPerson();
};

// Function to get an edgy explanation of the score
const getScoreExplanation = () => {
  const percentage = (score.value / totalQuestions.value) * 100;
  if (percentage === 100) {
    return "You're a genius! You know everything about this person!";
  } else if (percentage >= 75) {
    return "Great job! You really know your stuff.";
  } else if (percentage >= 50) {
    return "Not bad, but you could do better!";
  } else {
    return "Ouch... Maybe you should read up on this person.";
  }
};

// Watch for changes in the `personId` prop and reload quotes
watch(() => props.personId, () => {
  restartGame();
});

// Function to get the image path for a person
const getPersonImage = (personId) => {
  return new URL(`../assets/${personId}.png`, import.meta.url).href;
};

// Load quotes when the component is mounted
onMounted(() => {
  if (isAuthenticated) {
    loadQuotesForPerson();
  }
});
</script>

<style scoped>
.game-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
  height: 400px;
}

.correct-answer {
  background-color: #d4edda; /* Light green */
  border-color: #c3e6cb;
}

.wrong-answer {
  background-color: #f8d7da; /* Light red */
  border-color: #f5c6cb;
}

.person-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.quote-container {
  flex: 1;
}

blockquote {
  font-style: italic;
  font-size: 1.5rem;
  color: #555;
  margin: 20px 0;
  padding: 10px 20px;
  border-left: 4px solid #ccc;
  background-color: #fdfdfd;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

p {
  font-size: 18px;
  margin: 10px 0;
}

.reveal-container {
  display: flex;
  align-items: center;
  gap: 20px; /* Space between the reveal message and the button */
}

.reveal-message {
  flex: 1; /* Allow the message to take up available space */
  font-size: 1.2rem;
  color: #333;
}
</style>