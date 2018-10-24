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
var timer = new Timer();

var tutorialMode = false;

$('#screen-text').hide();

$('#start').click(function() {
  $(this).hide();
  $('#tutorial').hide();
  $('.screen').removeClass("dark");
  game.startGame();
  setTimeout(function() {displayKey()}, 1000); 
  timer.start(25);
  timeUpdate =setInterval(function() {
    displayTime()
    if (timer.timeLeft <= 0) {
      gameOver();
    }
  }, 1000)
});

function displayTime() {
  $('.time').text("Time: " + timer.timeDisplay);
}

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
});

//Normal game behavior
$('.main-button').click(function() {
  if ((game.active = true) && (tutorialMode == false)) { //we're in game mode and allowed to press buttons
    if (game.checkClick($(this).attr('id'))) { //it was the correct button
      $(this).addClass("correct");
      var that = this
      setTimeout(function() {
        $(that).removeClass("correct")}, 500);
      if (game.currentSequence.length == 0) { //reached end of sequence
        game.givePoints();
        update();
        game.generateSequence();
        displaySequence(game.currentSequence);
      }
    }
    else { // it was the wrong button
      $(this).addClass("incorrect");
      var that = this
      setTimeout(function() {
        $(that).removeClass("incorrect")}, 500);
        game.currentSequence = game.sequenceCopy.slice() //resets sequence
      }          
  } //end of game mode behavior 
  
  else if (tutorial.active == true) { //"Tutorial behavior" a novel by Emina Sonnad
  tutorial.active = false; //you can't click again 
  if ($(this).attr('id') == tutorial.currentSequence[0].key) { //if the button clicked is correct
      $(this).addClass("correct");
      var that = this
      setTimeout(function() {
        $(that).removeClass("correct")
      }, 1000);
      if (singleExampleCount < 3) { //we're still on the short examples
        $('#screen-text').text(correctResponse[singleExampleCount]);
        setTimeout(function() {
          $('#screen-text').text("");
        }, 1000);
        tutorial.generateSequence();
        setTimeout(function() {
          displaySequence(tutorial.currentSequence);
        }, 500);
        tutorial.active = true; // you can continue 
        singleExampleCount++;
      }
      if (singleExampleCount === 3) { //we need to transition into long examples
        setTimeout(function() {
          $('#screen-text').text("Let's try a longer sequence");
        }, 3000);
        tutorial.currentSequence = []
        singleExampleCount++;
        setTimeout(function() {
          tutorial.currentSequence = longSequences[longExampleCount];
          displaySequence(tutorial.currentSequence) 
        }, 4000);
        setTimeout(function() {
          $('#screen-text').text("");
          tutorial.active = true
        }, 11000);
        
      }

      else if ((longExampleCount < 2) && (singleExampleCount > 3)) { // we're on the long examples
        if (tutorial.currentSequence.length === 1) { // you just finished a sequence
          $('#screen-text').text(correctResponseLong[longExampleCount]);
          setTimeout(function() {
            $('#screen-text').text("");
          }, 1000);
          longExampleCount++;
          tutorial.currentSequence = longSequences[longExampleCount]; //sequence updates
          displaySequence(tutorial.currentSequence);
          tutorial.active = true;
        }
        else { //still working on a sequence
          tutorial.currentSequence.shift(); // removes the one you got right from the sequence 
          tutorial.active = true;
        }
      }

      else if (longExampleCount === 2) {
        setTimeout(function() {
          $('#screen-text').text("Forgot the key? Ask for a hint");
      }, 2000 )};
    }

    else { // button was incorrect
      $('#screen-text').text("No");
      $(this).addClass("incorrect");
      var that = this
      setTimeout(function() {
        $(that).removeClass("incorrect");
        $('#screen-text').text("");
      }, 500);
      tutorial.active = true;
    }
  } // end of tutorial behavior 


}); //end of main button function

function update() {
  $('.score').text("Score: " + game.score)
  if (game.score >= game.pointsToAdvance) {
    game.levelUp();
    timer.start(25);
    $('.level').text("Level: " + game.currentLevel);
  }
}

function gameOver() {
  timer.stop()
  $('.screen').addClass("dark");
  game.endGame();
}


//-------------------------------//
//-------------------------------//
//-----------TUTORIAL------------//
//-------------------------------//
//-------------------------------//



var tutorialLevel = new Level(level1Cards, 1, 1000, 5);

var tutorial = new Game([tutorialLevel]);

var singleExampleCount = 0;
var longExampleCount = 0;
var correctResponse = ["Correct. Again.", "Correct. One more time.", "Ok that's enough"];
var correctResponseLong = ["Correct", "Good job"];
var longSequences =[[card1, card2, card1],[card2, card3, card1],[card1, card1, card3, card2]];
tutorial.generateLevel(tutorialLevel)

function displayKeyTutorial() {
  tutorial.active = false;
  $('.position').addClass("active");
  for (var i = 0; i < tutorial.cards.length; i++) {
    var card = tutorial.cards[i];
    $('.p' + card.key).css("background-image", "url(" + card.img + ")");
  }
}



$('#tutorial').click(function() {
  tutorialMode = true;
  $(this).hide();
  $('#start').hide();
  $('.text').hide();
  $('.screen').removeClass("dark");
  tutorial.assignKeys();
  setTimeout(function() {
    $('#screen-text').css("font-size", "12px");
    $('#screen-text').text("Study the key:");
    $('#screen-text').show();
  }, 500); 
  setTimeout(function() {
    $('#screen-text').text("Each symbol corresponds to a color.");
  }, 4000); 
  setTimeout(function() {displayKeyTutorial()}, 2000); 
  setTimeout(function() {hideKey()}, 8000); 
  setTimeout(function() {
    $('#screen-text').text("Now watch:");
    tutorial.generateSequence();
    displaySequence(tutorial.currentSequence);
  }, 8000); 
  setTimeout(function() {
    $('#screen-text').text("Select the correct button");
    game.active = false;
    tutorial.active = true;
  }, 12000); 




});



});
