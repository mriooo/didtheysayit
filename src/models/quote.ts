export class QuoteDTO {
    id: number;
    quote: string;
    context: string;
    real: boolean;
    reveal: string;
    personId: string;
    author: string;

    
    constructor(id: number, quote: string, context: string, real: boolean, reveal: string, personId: string, author: string) {
        this.id = id;
        this.quote = quote;
        this.context = context;
        this.real = real;
        this.reveal = reveal;
        this.personId = personId;
        this.author = author;
    }
}