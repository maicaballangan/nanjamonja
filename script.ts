// Define card types and their corresponding images
const cardTypes: string[] = [
    'card1.jpg',
    'card2.jpg',
    // Add all 24 unique card images here
];

class Card {
    constructor(public type: string, public isMatched: boolean = false) {}
}

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cards: Card[] = [];
    private currentCardIndex: number = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.loadCards();
    }

    private loadCards() {
        // Create 48 cards with 24 unique types (duplicated)
        for (let i = 0; i < 48; i++) {
            const type = cardTypes[Math.floor(i / 2) % cardTypes.length];
            this.cards.push(new Card(type));
        }
        // Shuffle cards
        this.shuffleArray(this.cards);
    }

    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    public drawNextCard() {
        if (this.currentCardIndex < this.cards.length) {
            const card = this.cards[this.currentCardIndex];
            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = `images/${card.type}`;
            this.currentCardIndex++;
        } else {
            console.log('All cards drawn.');
        }
    }
}

// Usage
const game = new Game('gameCanvas');
game.drawNextCard();
