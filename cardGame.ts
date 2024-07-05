type Language = 'en' | 'ja';

class NanjaMonja {
    constructor(public id: number, public imageUrl: string, public name: string = '') {}
}

class Game {
    private deck: NanjaMonja[] = [];
    private currentCard: NanjaMonja | null = null;
    private nameCards: Array<string> = [];
    private namedCards: { [id: number]: string } = {};
    private players: { name: string, score: number }[] = [];
    private language: Language = 'en';
    private isGuessingTime: boolean = false;

    private translations = {
        en: {
            newName: 'New name given: ',
            correct: ' is correct!',
            incorrect: ' is incorrect!',
            enterName: 'Enter the name for this creature:',
            gameOver: 'Game Over! The winner is ',
            nextCard: 'Next Card',
            giveName: 'Give Name',
            guessName: 'Guess Name',
            score: 'Score: ',
            invalidName: 'Enter valid name!',
            nameAlreadyTaken: 'Name is already taken!'
        },
        ja: {
            newName: '新しい名前が付けられました: ',
            correct: 'が正解！',
            incorrect: 'が不正解！',
            enterName: 'この仲間の名前は？',
            gameOver: 'ゲーム終了！勝者は',
            nextCard: '次のカード',
            giveName: '名前を付ける',
            guessName: '名前を言う',
            score: 'スコア: ',
            invalidName: '有効な名前を入力してください!',
            nameAlreadyTaken: '名前はすでに採用されています！'
        }
    };

    constructor(playerNames: string[], language: Language = 'en') {
        this.initializeDeck();
        this.shuffleDeck();
        this.players = playerNames.map(function(name) { return { name: name, score: 0 }; });
        this.language = language;
        this.updatePlayersDisplay();
        this.updateUILanguage();
        this.autoDraw();
    }

    private autoDraw() {
        this.drawCard();
        this.updateCardDisplay(); // Ensure card display is updated initially
    }

    private initializeDeck() {
        for (let i = 1; i <= 12; i++) {
            this.deck.push(new NanjaMonja(i, `images/${i}.jpg`));
            this.deck.push(new NanjaMonja(i, `images/${i}.jpg`));
        }
    }

    private shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }

    public drawCard() {
        if (this.deck.length === 0) {
            this.endGame();
            return;
        }

        this.currentCard = this.deck.pop() || null;
        this.updateCardDisplay();

        if (this.currentCard && this.namedCards.hasOwnProperty(this.currentCard.id)) {
            this.showPlayerInstructions();
            this.isGuessingTime = true; // It's guessing time
        } else if (this.currentCard) {
            this.showNameInput();
            this.isGuessingTime = false; // Not guessing time
        }
    }

    private showNameInput() {
        document.getElementById('name-input')!.style.display = 'block';
        document.getElementById('player-instructions')!.style.display = 'none';
    }

    private showPlayerInstructions() {
        document.getElementById('name-input')!.style.display = 'none';
        document.getElementById('player-instructions')!.style.display = 'block';
    }

    public nameCard(name: string) {
        if (name === '') {
            this.updateMessage(this.translations[this.language].invalidName);
            return;
        }

        if (this.nameCards.indexOf(name) !== -1) {
            this.updateMessage(this.translations[this.language].nameAlreadyTaken);
            return;
        } else {
            this.nameCards.push(name);
        }

        if (this.currentCard) {
            this.namedCards[this.currentCard.id] = name;
            this.updateMessage(this.translations[this.language].newName + name);
        }

        this.autoDraw(); // Ensure card display is updated initially
    }

    public guessCorrect(playerIndex: number) {
        if (!this.isGuessingTime || !this.currentCard) {
            return;
        }

        const correctName = this.namedCards[this.currentCard.id];
        const guessedName = prompt(`${this.players[playerIndex].name}, ${this.translations[this.language].enterName}`);

        if (guessedName && guessedName.toLowerCase() === correctName.toLowerCase()) {
            this.players[playerIndex].score++;
            this.updatePlayersDisplay();
            this.updateMessage(this.players[playerIndex].name + this.translations[this.language].correct);
            this.autoDraw();
        } else {
            this.updateMessage(this.players[playerIndex].name + this.translations[this.language].incorrect);
        }
    }

    private updateCardDisplay() {
        const cardImage = document.getElementById('card-image') as HTMLImageElement;
        if (this.currentCard) {
            cardImage.src = this.currentCard.imageUrl;
        }
    }

    private updatePlayersDisplay() {
        const playersDiv = document.getElementById('players');
        if (playersDiv) {
            playersDiv.innerHTML = this.players.map((player) => {
                return '<div class="player">' +
                    '<div>' + player.name + '</div>' +
                    '<div>' + this.translations[this.language].score + player.score + '</div>' +
                    '</div>';
            }).join('');
        }
    }

    private updateMessage(message: string) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    private endGame() {
        const winner = this.players.reduce(function(prev, current) {
            return (prev.score > current.score) ? prev : current;
        });
        this.updateMessage(this.translations[this.language].gameOver + winner.name + '!');
    }

    public changeLanguage(lang: Language) {
        this.language = lang;
        this.updateUILanguage();
        this.updatePlayersDisplay();
    }

    private updateUILanguage() {
        document.getElementById('next-card')!.textContent = this.translations[this.language].nextCard;
        document.getElementById('submit-name')!.textContent = this.translations[this.language].giveName;

        // Update player instructions
        const playerInstructions = document.getElementById('player-instructions');
        if (playerInstructions) {
            playerInstructions.innerHTML = this.players.map((player, index) => {
                return `<p>${player.name}: ${this.getGuessInstruction(index)}</p>`;
            }).join('');
        }
    }

    private getGuessInstruction(playerIndex: number): string {
        switch (playerIndex) {
            case 0: // Player 1
                return this.language === 'en' ? 'Press "a" for Player 1' : 'プレイヤー1は「a」を押してください';
            case 1: // Player 2
                return this.language === 'en' ? 'Press spacebar for Player 2' : 'プレイヤー2はスペースを押してください';
            case 2: // Player 3
                return this.language === 'en' ? 'Press apostrophe (\'") for Player 3' : 'プレイヤー3は「\'」を押してください';
            default:
                return '';
        }
    }
}

// Game initialization
const game = new Game(['Player 1', 'Player 2', 'Player 3'], 'en');

document.getElementById('next-card')!.addEventListener('click', function() {
    game.drawCard();
});

document.getElementById('submit-name')!.addEventListener('click', function() {
    const nameInput = document.getElementById('new-name') as HTMLInputElement;
    game.nameCard(nameInput.value);
    nameInput.value = '';
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'a') {
        game.guessCorrect(0); // Player 1
    } else if (event.key === ' ' || event.key === 'Spacebar') {
        game.guessCorrect(1); // Player 2
    } else if (event.key === '\'') {
        game.guessCorrect(2); // Player 3
    }
});

document.getElementById('language-select')!.addEventListener('change', function(event) {
    const select = event.target as HTMLSelectElement;
    game.changeLanguage(select.value as Language);
});
