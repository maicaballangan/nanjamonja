var NanjaMonja = /** @class */ (function () {
    function NanjaMonja(id, imageUrl, name) {
        if (name === void 0) { name = ''; }
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
    }
    return NanjaMonja;
}());
var Game = /** @class */ (function () {
    function Game(playerNames, language) {
        if (language === void 0) { language = 'en'; }
        this.deck = [];
        this.currentCard = null;
        this.namedCards = {};
        this.players = [];
        this.language = 'en';
        this.translations = {
            en: {
                newName: 'New name given: ',
                correct: ' is correct!',
                incorrect: 'Incorrect. The correct name was ',
                enterName: 'Enter the name for this creature:',
                gameOver: 'Game Over! The winner is ',
                nextCard: 'Next Card',
                giveName: 'Give Name',
                guessName: 'Guess Name',
                score: 'Score: '
            },
            ja: {
                newName: '新しい名前が付けられました: ',
                correct: 'が正解！',
                incorrect: '不正解。正しい名前は ',
                enterName: 'この仲間の名前は？',
                gameOver: 'ゲーム終了！勝者は',
                nextCard: '次のカード',
                giveName: '名前を付ける',
                guessName: '名前を言う',
                score: 'スコア: '
            }
        };
        this.initializeDeck();
        this.shuffleDeck();
        this.players = playerNames.map(function (name) { return { name: name, score: 0 }; });
        this.language = language;
        this.updatePlayersDisplay();
        this.updateUILanguage();
    }
    Game.prototype.initializeDeck = function () {
        for (var i = 1; i <= 2; i++) {
            this.deck.push(new NanjaMonja(i, 'images/' + i + '.jpg'));
            this.deck.push(new NanjaMonja(i, 'images/' + i + '.jpg'));
        }
    };
    Game.prototype.shuffleDeck = function () {
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    };
    Game.prototype.drawCard = function () {
        if (this.deck.length === 0) {
            this.endGame();
            return;
        }
        this.currentCard = this.deck.pop() || null;
        this.updateCardDisplay();
        if (this.currentCard && this.namedCards.hasOwnProperty(this.currentCard.id)) {
            this.showPlayerButtons();
        }
        else if (this.currentCard) {
            this.showNameInput();
        }
    };
    Game.prototype.nameCard = function (name) {
        if (this.currentCard) {
            this.namedCards[this.currentCard.id] = name;
            this.updateMessage(this.translations[this.language].newName + name);
        }
    };
    Game.prototype.guessCorrect = function (playerIndex) {
        if (this.currentCard) {
            var correctName = this.namedCards[this.currentCard.id];
            var guessedName = prompt(this.players[playerIndex].name + ', ' + this.translations[this.language].enterName);
            if (guessedName && guessedName.toLowerCase() === correctName.toLowerCase()) {
                this.players[playerIndex].score++;
                this.updatePlayersDisplay();
                this.updateMessage(this.players[playerIndex].name + this.translations[this.language].correct);
            }
            else {
                this.updateMessage(this.translations[this.language].incorrect + correctName + '。');
            }
        }
    };
    Game.prototype.updateCardDisplay = function () {
        var cardImage = document.getElementById('card-image');
        if (this.currentCard) {
            cardImage.src = this.currentCard.imageUrl;
        }
    };
    Game.prototype.showNameInput = function () {
        document.getElementById('name-input').style.display = 'block';
        document.getElementById('player-buttons').style.display = 'none';
    };
    Game.prototype.showPlayerButtons = function () {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('player-buttons').style.display = 'block';
    };
    Game.prototype.updatePlayersDisplay = function () {
        var _this = this;
        var playersDiv = document.getElementById('players');
        if (playersDiv) {
            playersDiv.innerHTML = this.players.map(function (player) {
                return '<div class="player">' +
                    '<div>' + player.name + '</div>' +
                    '<div>' + _this.translations[_this.language].score + player.score + '</div>' +
                    '</div>';
            }).join('');
        }
    };
    Game.prototype.updateMessage = function (message) {
        var messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    };
    Game.prototype.endGame = function () {
        var winner = this.players.reduce(function (prev, current) {
            return (prev.score > current.score) ? prev : current;
        });
        this.updateMessage(this.translations[this.language].gameOver + winner.name + '!');
    };
    Game.prototype.changeLanguage = function (lang) {
        this.language = lang;
        this.updateUILanguage();
        this.updatePlayersDisplay();
    };
    Game.prototype.updateUILanguage = function () {
        document.getElementById('next-card').textContent = this.translations[this.language].nextCard;
        document.getElementById('submit-name').textContent = this.translations[this.language].giveName;
        var playerButtons = document.getElementsByClassName('player-button');
        for (var i = 0; i < playerButtons.length; i++) {
            playerButtons[i].textContent = this.translations[this.language].guessName;
        }
    };
    return Game;
}());
// Game initialization
var game = new Game(['Player 1', 'Player 2', 'Player 3'], 'en');
document.getElementById('next-card').addEventListener('click', function () {
    game.drawCard();
});
document.getElementById('submit-name').addEventListener('click', function () {
    var nameInput = document.getElementById('new-name');
    game.nameCard(nameInput.value);
    nameInput.value = '';
});
document.getElementById('player-buttons').addEventListener('click', function (event) {
    var target = event.target;
    if (target.classList.contains('player-button')) {
        var playerIndex = parseInt(target.getAttribute('data-player') || '0', 10);
        game.guessCorrect(playerIndex);
    }
});
document.getElementById('language-select').addEventListener('change', function (event) {
    var select = event.target;
    game.changeLanguage(select.value);
});
