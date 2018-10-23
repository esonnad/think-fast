$( document ).ready(function() {
  


var levels = []

var card1 = new Card("../images/black-circle.png")
var card2 = new Card("../images/black-square.png")
var card3 = new Card("../images/black-triangle.png")

var level1Cards = [card1, card2, card3];
var level1 = new Level(level1Cards, 1, 1000, 5);
var level2 = new Level(level1Cards, 2, 1000, 10);
var level3 = new Level(level1Cards, 5, 1000, 10);



levels.push(level1);
levels.push(level2);
levels.push(level3);

var game = new Game(levels);

$('#screen-text').hide();

$('#start').click(function() {
  $(this).hide();
  $('.screen').removeClass("dark");
  game.startGame();
  setTimeout(function() {displayKey()}, 1000); 
})

function displayKey() {
  game.active = false;
  $('.position').addClass("active");
  for (var i = 0; i < game.cards.length; i++) {
    var card = game.cards[i];
    $('.p' + card.key).css("background-image", "url(" + card.img + ")");
  }  
  setTimeout(function() {
    hideKey();
    displaySequence(game.currentSequence);
  }, 3000); 
}

function hideCards() {
  $('.position').css("background-image", "none");
}

function hideKey() {
  $('.position').removeClass("active");
  hideCards();
}

function displayCard(card) {
  console.log("displaying card:", card);
  var position = Math.floor(Math.random()*3) + 1;
  $('.p' + position).show();
  $('.p' + position).css("background-image", "url(" + card.img + ")");
  setTimeout(function() {hideCards()}, 1000); 

}


function displaySequenceCallback(currentCard, delay) {setTimeout(() => {
      displayCard(currentCard);
      }, delay);
    }

function displaySequence(sequence) {
  game.active = false;
  var delay = 0;
  var currentCard;
  for (let i = 0; i < sequence.length; i++) {
    currentCard = sequence[i];
    console.log("current card is", currentCard)
    delay += 2000; 
    displaySequenceCallback(currentCard,delay)

  }
  game.active = true;
}

$('.key-button').click(function() {
  displayKey(); 
});

$('.repeat-button').click(function() {
  displaySequence(game.sequenceCopy); 
  console.log("sequence copy", game.sequenceCopy);
});

//main button functions

$('.main-button').click(function() {
  if (game.active = true) {
    if (game.checkClick($(this).attr('id'))) {
      $(this).addClass("correct");
      var that = this
      setTimeout(function() {
        $(that).removeClass("correct")}, 500);
      if (game.currentSequence.length == 0) {
        game.givePoints();
        update();
        game.generateSequence();
        displaySequence(game.currentSequence);
      }
    }
    else {
      $(this).addClass("incorrect");
      var that = this
      setTimeout(function() {
        $(that).removeClass("incorrect")}, 500);
      }
      game.currentSequence = game.sequenceCopy.slice()
      console.log("try again")

  }
});

function update() {
  $('.score').text("Score: " + game.score)
  if (game.score >= game.pointsToAdvance) game.levelUp();
  $('.level').text("Level: " + game.currentLevel)

}



});
