$( document ).ready(function() {
  


var levels = []

var card1 = new Card("../images/black-circle.png")
var card2 = new Card("../images/black-square.png")
var card3 = new Card("../images/black-triangle.png")

var level1Cards = [card1, card2, card3];
var level1 = new Level(level1Cards, 5, 1000);


levels.push(level1);

var game = new Game(levels);

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
    displaySequence();
  }, 1000); 
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

function displaySequence() {
  game.active = false;
  var sequence = game.currentSequence;
  var delay = 0;
  var currentCard;
  for (i = 0; i < sequence.length; i++) {
    currentCard = sequence[i];
    console.log("current card is", currentCard)
    delay += 2000; 
    setTimeout(() => {
      displayCard(currentCard);
      }, delay);
  }
  game.active = true;
}

$('.key-button').click(function() {
  displayKey(); 
});




});
