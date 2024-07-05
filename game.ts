// Define the types and interfaces

type CardType = {
    id: number;
    name: string;
    image: string; // URL or path to image
};

type GameState = {
    currentCardIndex: number;
    currentPlayerIndex: number;
    players: string[]; // Array of player names
    scoreBoard: Record<string, number>; // Object to track scores
};

// Example set of 24 unique cards
const cards: CardType[] = [
    { id: 1, name: "Card A", image: "cardA.jpg" },
    { id: 2, name: "Card B", image: "cardB.jpg" },
    // Add more cards...
];

// Initialize game state
let gameState: GameState = {
    currentCardIndex: 0,
    currentPlayerIndex: 0,
    players: ["Player 1", "Player 2"], // Example player names
    scoreBoard: {}, // To be populated with initial scores
};

// DOM elements
const playerTurnElem = document.getElementById("player-turn")!;
const cardImageElem = document.getElementById("card-image") as HTMLImageElement;
const guessInputElem = document.getElementById("guess-text") as HTMLInputElement;
const guessButtonElem = document.getElementById("guess-button")!;
const nextCardButtonElem = document.getElementById("next-card-button")!;
const scoresListElem = document.getElementById("scores")!;

// Function to display current card
function displayCurrentCard() {
    const currentCard = cards[gameState.currentCardIndex];
    cardImageElem.src = currentCard.image;
    playerTurnElem.textContent = `Current Player: ${gameState.players[gameState.currentPlayerIndex]}`;
}

// Function to update scoreboard UI
function updateScoreboard() {
    scoresListElem.innerHTML = "";
    for (const player in gameState.scoreBoard) {
        const score = gameState.scoreBoard[player];
        const li = document.createElement("li");
        li.innerHTML = `<span>${player}:</span> ${score}`;
        scoresListElem.appendChild(li);
    }
}

// Function to handle player's guess
function handleGuess() {
    const guessedCardName = guessInputElem.value.trim();
    const currentCard = cards[gameState.currentCardIndex];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentCard.name.toLowerCase() === guessedCardName.toLowerCase()) {
        // Correct guess logic
        if (!gameState.scoreBoard[currentPlayer]) {
            gameState.scoreBoard[currentPlayer] = 0;
        }
        gameState.scoreBoard[currentPlayer]++;
        // Move to the next card
        gameState.currentCardIndex++;
    } else {
        // Incorrect guess logic (optional)
        // Penalize points, skip turn, etc.
    }

    // Clear input
    guessInputElem.value = "";

    // Update scoreboard and display next card
    updateScoreboard();
    if (gameState.currentCardIndex < cards.length) {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        displayCurrentCard();
    } else {
        // End of game logic
        alert("Game Over!");
    }
}

// Function to handle drawing the next card manually
function drawNextCard() {
    if (gameState.currentCardIndex < cards.length) {
        gameState.currentCardIndex++;
        displayCurrentCard();
    } else {
        // End of game logic
        alert("No more cards left!");
    }
}

// Event listeners
guessButtonElem.addEventListener("click", handleGuess);
nextCardButtonElem.addEventListener("click", drawNextCard);

// Start the game
displayCurrentCard();
updateScoreboard();
