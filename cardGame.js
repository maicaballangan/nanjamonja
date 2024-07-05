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
    function Game(playerNames) {
        this.deck = [];
        this.currentCard = null;
        this.stack = [];
        this.players = [];
        this.currentPlayerIndex = 0;
        this.initializeDeck();
        this.shuffleDeck();
        this.players = playerNames.map(function (name) { return ({ name: name, score: 0 }); });
        this.updatePlayersDisplay();
    }
    Game.prototype.initializeDeck = function () {
        for (var i = 1; i <= 24; i++) {
            this.deck.push(new NanjaMonja(i, "card".concat(i, ".jpg")));
            this.deck.push(new NanjaMonja(i, "card".concat(i, ".jpg")));
        }
    };
    Game.prototype.shuffleDeck = function () {
        var _a;
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this.deck[j], this.deck[i]], this.deck[i] = _a[0], this.deck[j] = _a[1];
        }
    };
    Game.prototype.drawCard = function () {
        if (this.deck.length === 0) {
            this.endGame();
            return;
        }
        this.currentCard = this.deck.pop();
        this.stack.push(this.currentCard);
        this.updateCardDisplay();
        if (this.currentCard.name) {
            document.getElementById('guess-name').style.display = 'inline-block';
            document.getElementById('name-input').style.display = 'none';
        }
        else {
            document.getElementById('name-input').style.display = 'block';
            document.getElementById('guess-name').style.display = 'none';
        }
    };
    Game.prototype.nameCard = function (name) {
        if (this.currentCard) {
            this.currentCard.name = name;
            this.nextPlayer();
            this.updateMessage("".concat(this.players[this.currentPlayerIndex].name, "\u306E\u756A\u3067\u3059\u3002"));
        }
    };
    Game.prototype.guessName = function (playerIndex, name) {
        if (this.currentCard && this.currentCard.name === name) {
            this.players[playerIndex].score += this.stack.length;
            this.stack = [];
            this.updatePlayersDisplay();
            this.updateMessage("".concat(this.players[playerIndex].name, "\u304C\u6B63\u89E3\uFF01"));
        }
        else {
            this.updateMessage('不正解。続けます。');
        }
    };
    Game.prototype.nextPlayer = function () {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    };
    Game.prototype.updateCardDisplay = function () {
        var cardImage = document.getElementById('card-image');
        if (this.currentCard) {
            cardImage.src = this.currentCard.imageUrl;
        }
    };
    Game.prototype.updatePlayersDisplay = function () {
        var playersDiv = document.getElementById('players');
        playersDiv.innerHTML = this.players.map(function (player) {
            return "<div class=\"player\">\n                <div>".concat(player.name, "</div>\n                <div>\u30B9\u30B3\u30A2: ").concat(player.score, "</div>\n            </div>");
        }).join('');
    };
    Game.prototype.updateMessage = function (message) {
        document.getElementById('message').textContent = message;
    };
    Game.prototype.endGame = function () {
        var winner = this.players.reduce(function (prev, current) {
            return (prev.score > current.score) ? prev : current;
        });
        this.updateMessage("\u30B2\u30FC\u30E0\u7D42\u4E86\uFF01\u52DD\u8005\u306F".concat(winner.name, "\u3067\u3059\uFF01"));
    };
    return Game;
}());
// Game initialization
var game = new Game(['プレイヤー1', 'プレイヤー2', 'プレイヤー3']);
document.getElementById('next-card').addEventListener('click', function () { return game.drawCard(); });
document.getElementById('submit-name').addEventListener('click', function () {
    var nameInput = document.getElementById('new-name');
    game.nameCard(nameInput.value);
    nameInput.value = '';
});
document.getElementById('guess-name').addEventListener('click', function () {
    var name = prompt('名前を言ってください：');
    if (name) {
        game.guessName(game['currentPlayerIndex'], name);
    }
});
