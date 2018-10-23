$( document ).ready(function() {
  


var levels = []

var card1 = new Card("../images/black-circle.png")
var card2 = new Card("../images/black-square.png")
var card3 = new Card("../images/black-triangle.png")

var level1Cards = [card1, card2, card3];
var level1 = new Level(level1Cards, 5, 1000);


levels.push(level1);

var game = new Game(levels);

$('.position').hide();

$('#start').click(function() {
  $(this).hide();
  $('.screen').removeClass("dark");
  game.startGame();
  setTimeout(function() {displayKeys()}, 2000); 

})

function displayKeys() {
  $('.position').show();
  $('.position').addClass("active");

    for (var i = 0; i < game.cards.length; i++) {
      var card = game.cards[i];
      $('.p' + card.key).css("background-image", "url(" + card.img + ")");
    }  
  setTimeout(function() {hideKeys()}, 5000); 
}

function hideKeys() {
  $('.position').hide();
}



});
