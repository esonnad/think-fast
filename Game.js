class Card {
  constructor(img) {
    this.key = 0;
    this.img = img;
  }
}

class Level {
  constructor(cards, maxSequenceLength, sequenceSpeed, pointsToAdvance) {
    this.cards = cards;
    this.maxSequenceLength = maxSequenceLength;
    this.sequenceSpeed = sequenceSpeed;
    this.pointsToAdvance = pointsToAdvance;
  }
}

class Game {
  constructor(levels) {
    this.levels = levels;
    this.currentLevel = 0;
    this.score = 0
    this.timeLeft = 100;
    this.cards = [];
    this.currentSequence = []
    this.sequenceCopy = []
    this.sequencePointValue = 0;
    this.maxSequenceLength = 0;
    this.sequenceSpeed = 0;
    this.active = false;
    this.pointsToAdvance;
  }

  generateLevel(level) {
    this.cards = level.cards;
    this.maxSequenceLength = level.maxSequenceLength;
    this.sequenceSpeed = level.sequenceSpeed;
    this.pointsToAdvance = level.pointsToAdvance;
  }

  startGame() {
    this.generateLevel(this.levels[this.currentLevel])
    this.assignKeys()
    this.generateSequence()
  }

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

  assignKeys() {
    var keys = [1,2,3];
    this.shuffle(keys);
    var cards = this.cards;
    for (var i = 0; i < cards.length; i++) {
      cards[i].key = keys[i];
    }
  }


  generateSequence() {
    this.currentSequence = [];
    var sequenceLength = Math.floor(Math.random() *this.maxSequenceLength)+1;
    for (var i = 0; i < sequenceLength; i++) {
      var index = Math.floor(Math.random() * this.cards.length);
      var nextCard = this.cards[index];
      this.currentSequence.push(nextCard);
    }
    this.sequencePointValue = this.currentSequence.length;
    this.sequenceCopy = this.currentSequence.slice();
  }


  checkClick(key) {
    if (key == this.currentSequence[0].key) {
      this.currentSequence.shift();
      return true;
    } 
    else {
      return false;
    }
  }

  givePoints() {
    this.score += this.sequencePointValue;
  }

  isGameOver() {
    if (this.timeLeft == 0) return true;
    else return false;
  }

  isLevelComplete() {
    if (score >= 20) return true;
    else return false;
  }

  levelUp() {
    this.currentLevel++;
    this.generateLevel(this.levels[this.currentLevel]);
  }

  endGame() {
    this.active = false;
    this.cards = [];
    this.currentSequence = []
    this.sequenceCopy = []
    this.levels = []
  }
}

