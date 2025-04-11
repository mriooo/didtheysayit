import { QuoteDTO } from '../models/quote';
import { defineStore } from 'pinia'
import { firebaseConfig } from "../services/api";


import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


export const useQuoteStore = defineStore('quotes', {
    state: () => ({
        quotes: [] as QuoteDTO[],
        persons: [] as { id: string; name: string}[], // Add persons state
    }),
    getters: {
        quotesCount(state) {
            return state.quotes.length
        },
        allQuotes(state) {
            return state.quotes
        }
    },
    actions: {
        async loadQuotes() {
            if (this.quotes.length > 0) {
                console.log("Quotes already loaded, skipping database fetch.");
                return;
              }
            

            try {
                // Initialize Firebase app and Firestore
                const app = initializeApp(firebaseConfig);
                const analytics = getAnalytics(app); // Optional: Only if you need analytics
                const db = getFirestore(app);
        
                // Fetch documents from the "persons" collection
                const personsSnapshot = await getDocs(collection(db, 'persons'));
        
                // Iterate over each document in the "persons" collection
                for (const personDoc of personsSnapshot.docs) {
                    const personId = personDoc.id; // Get the document ID
                    console.log(`Fetching quotes for person: ${personId}`);

                    // Fetch the "quotes" subcollection for this person
                    const quotesSnapshot = await getDocs(collection(db, `persons/${personId}/quotes`));
        
                    // Process each document in the "quotes" subcollection
                    quotesSnapshot.forEach((quoteDoc) => {
                        const data = quoteDoc.data();
                        const newQuote = new QuoteDTO(
                            data.id || quoteDoc.id, // Use the document ID if no `id` field exists
                            data.quote,
                            data.context,
                            data.real,
                            data.reveal,
                            personId,
                            personDoc.data().name
                        );
                        this.quotes.push(newQuote);
                    });
                }
        
                console.log("Quotes loaded successfully:", this.quotes);
            } catch (error) {
                console.error("Error loading quotes:", error);
            }
        },
        async loadPersons() {
            try {
                const app = initializeApp(firebaseConfig);
                const db = getFirestore(app);
        
                const personsSnapshot = await getDocs(collection(db, 'persons'));
                this.persons = personsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name
                }));
            } catch (error) {
                console.error('Error loading persons:', error);
            }
        },
    }
});