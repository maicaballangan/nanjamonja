class NanjaMonja {
    constructor(public id: number, public imageUrl: string, public name: string = '') {}
}

class Game {
    private deck: NanjaMonja[] = [];
    private currentCard: NanjaMonja | null = null;
    private stack: NanjaMonja[] = [];
    private players: { name: string, score: number }[] = [];
    private currentPlayerIndex: number = 0;

    constructor(playerNames: string[]) {
        this.initializeDeck();
        this.shuffleDeck();
        this.players = playerNames.map(name => ({ name, score: 0 }));
        this.updatePlayersDisplay();
    }

    private initializeDeck() {
        for (let i = 1; i <= 24; i++) {
            this.deck.push(new NanjaMonja(i, `card${i}.jpg`));
            this.deck.push(new NanjaMonja(i, `card${i}.jpg`));
        }
    }

    private shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    public drawCard() {
        if (this.deck.length === 0) {
            this.endGame();
            return;
        }

        this.currentCard = this.deck.pop()!;
        this.stack.push(this.currentCard);
        this.updateCardDisplay();

        if (this.currentCard.name) {
            document.getElementById('guess-name')!.style.display = 'inline-block';
            document.getElementById('name-input')!.style.display = 'none';
        } else {
            document.getElementById('name-input')!.style.display = 'block';
            document.getElementById('guess-name')!.style.display = 'none';
        }
    }

    public nameCard(name: string) {
        if (this.currentCard) {
            this.currentCard.name = name;
            this.nextPlayer();
            this.updateMessage(`${this.players[this.currentPlayerIndex].name}の番です。`);
        }
    }

    public guessName(playerIndex: number, name: string) {
        if (this.currentCard && this.currentCard.name === name) {
            this.players[playerIndex].score += this.stack.length;
            this.stack = [];
            this.updatePlayersDisplay();
            this.updateMessage(`${this.players[playerIndex].name}が正解！`);
        } else {
            this.updateMessage('不正解。続けます。');
        }
    }

    private nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    private updateCardDisplay() {
        const cardImage = document.getElementById('card-image') as HTMLImageElement;
        if (this.currentCard) {
            cardImage.src = this.currentCard.imageUrl;
        }
    }

    private updatePlayersDisplay() {
        const playersDiv = document.getElementById('players')!;
        playersDiv.innerHTML = this.players.map(player => 
            `<div class="player">
                <div>${player.name}</div>
                <div>スコア: ${player.score}</div>
            </div>`
        ).join('');
    }

    private updateMessage(message: string) {
        document.getElementById('message')!.textContent = message;
    }

    private endGame() {
        const winner = this.players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
        );
        this.updateMessage(`ゲーム終了！勝者は${winner.name}です！`);
    }
}

// Game initialization
const game = new Game(['プレイヤー1', 'プレイヤー2', 'プレイヤー3']);

document.getElementById('next-card')!.addEventListener('click', () => game.drawCard());

document.getElementById('submit-name')!.addEventListener('click', () => {
    const nameInput = document.getElementById('new-name') as HTMLInputElement;
    game.nameCard(nameInput.value);
    nameInput.value = '';
});

document.getElementById('guess-name')!.addEventListener('click', () => {
    const name = prompt('名前を言ってください：');
    if (name) {
        game.guessName(game['currentPlayerIndex'], name);
    }
});