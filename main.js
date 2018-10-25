$( document ).ready(function() {

//----------PREPARE GAME-------------//
var circle = "./images/black-circle.png"
var square = "./images/black-square.png"
var triangle = "./images/black-triangle.png"

var levels = []
var card1 = new Card(circle)
var card2 = new Card(square)
var card3 = new Card(triangle)

var level1Cards = [card1, card2, card3];
var level1 = new Level(level1Cards, 1, 1000, 5); 
var level2 = new Level(level1Cards, 2, 1000, 10);
var level3 = new Level(level1Cards, 5, 1000, 10);

levels.push(level1);
levels.push(level2);
levels.push(level3);

var game = new Game(levels);

//set default modes
var tutorialMode = false; //activates tutorial 
var keyTutorialMode = false; //activates tutorial key button function
var repeatTutorialMode = false; //activates tutorial repeat button function
$('#screen-text').hide();



//----------PREPARE TUTORIAL-------------//


var tutorialLevel = new Level(level1Cards, 1, 1000, 5);
var tutorial = new Game([tutorialLevel]);
var singleExampleCount = 0;
var longExampleCount = 0;
var correctResponse = ["Correct. Again.", "Correct. One more time.", "Ok that's enough"];
var correctResponseLong = ["Correct", "Good job"];
var longSequences =[[card1, card2, card1],[card2, card3, card1],[card1, card1, card3, card2]];
tutorial.generateLevel(tutorialLevel)


//----------PREPARE TIMER----------------//


var timer = new Timer();


//---------------------------------------//
//---------------------------------------//
//----------BUTTON FUNCTIONS-------------//
//---------------------------------------//
//---------------------------------------//


//----------START BUTTON----------------//

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

//-------------KEY BUTTON----------------//


$('.key-button').click(function() {
  if (tutorialMode == false) displayKey(); 
  else { 
  displayKeyTutorial();
  }
});

//------------REPEAT BUTTON--------------//

$('.repeat-button').click(function() {
  if (!tutorialMode) displaySequence(game.sequenceCopy); 
  else if (repeatTutorialMode) {
    tutorial.currentSequence = [card1, card1, card3, card2]
    displaySequence(tutorial.currentSequence);
    $('#screen-text').text("Here is that sequence again");
    timer.start(25);
    $('.time').show()
    timeUpdate =setInterval(function() {
      displayTime()
      if (timer.timeLeft <= 0) {
        endTutorial();
      }
    }, 1000)
    repeatTutorialMode = false;
  }
});

//------------TUTORIAL BUTTON--------------//


$('#tutorial').click(function() {
  tutorialMode = true;
  $(this).hide();
  $('#start').hide();
  $('.text').hide();
  $('.screen').removeClass("dark");
  tutorial.assignKeys();
  setTimeout(function() {
    $('#screen-text').css("font-size", "12px");
    $('#screen-text').text("Here is the key:");
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
    $('#screen-text').text("Push the correct button");
    game.active = false;
    //tutorial.active = true;
  }, 12000); 
});

//------------MAIN BUTTONS: A NOVEL BY EMINA SONNAD--------------//


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
  
  else if (tutorial.active == true) { //Tutorial behavior
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
        //tutorial.active = true; // you can continue 
        singleExampleCount++;
      }
      if (singleExampleCount === 3) { //we need to transition into long examples
        setTimeout(function() {
          $('#screen-text').text("Let's try a longer sequence. Wait until it has finished.");
        }, 3000);
        tutorial.currentSequence = []
        singleExampleCount++;
        setTimeout(function() {
          tutorial.currentSequence = longSequences[longExampleCount];
          displaySequence(tutorial.currentSequence) 
        }, 4000);
        setTimeout(function() {
          $('#screen-text').text("");
        }, 11000);
      }
      else if ((longExampleCount <= 3) && (singleExampleCount > 3)) { // we're on the long examples
        if (tutorial.currentSequence.length === 1) {
          if (longExampleCount === 2) {
            $('.position').hide();
            setTimeout(function() {
              $('#screen-text').text("That's enough. Press the hint button");
              keyTutorialMode = true;
              longExampleCount++
          }, 2000 )}
          else if (longExampleCount === 3) {
            $('.position').hide();
            setTimeout(function() {
              $('#screen-text').text("You're doing great");
              longExampleCount++
            }, 2000 )
            setTimeout(function() {
              $('#screen-text').text("But in case you didn't notice...");
              longExampleCount++
            }, 5000 )
            setTimeout(function() {
              $('#screen-text').text("we're running out of time");
              longExampleCount++
            }, 8000 )
          }
          else  {// you just finished a sequence
            $('#screen-text').text(correctResponseLong[longExampleCount]);
            setTimeout(function() {
              $('#screen-text').text("");
            }, 1000);
            longExampleCount++;
            tutorial.currentSequence = longSequences[longExampleCount]; //sequence updates
            displaySequence(tutorial.currentSequence);
          }        
        }
        else { //still working on a sequence
          tutorial.currentSequence.shift(); // removes the one you got right from the sequence 
          tutorial.active = true;
        }
      }    
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



//------------GENERIC FUNCTIONS---------------//


function displayTime() {
  $('.time').text("Time: 00:" + timer.timeDisplay);
}


function hideCards() {
  $('.position').css("background-image", "none");
}


function hideKey() {
  $('.position').removeClass("active");
  hideCards();
}


function displaySequenceCallback(currentCard, delay) {setTimeout(() => {
  displayCard(currentCard);
  }, delay);
}


function displaySequence(sequence) {
  game.active = false; //disables clicking buttons while sequence is showing 
  tutorial.active = false;
  var delay = 0;
  var currentCard;
  for (let i = 0; i < sequence.length; i++) {
    currentCard = sequence[i];
    delay += 2000; 
    displaySequenceCallback(currentCard,delay)
    if (i == sequence.length-1) setTimeout(function() {
      tutorial.active = true
      }, delay);
  } 
  game.active = true; //reenables clicking buttons 
}


function displayCard(card) {
  var position = Math.floor(Math.random()*3) + 1;
  $('.p' + position).show();
  $('.p' + position).css("background-image", "url(" + card.img + ")");
  setTimeout(function() {hideCards()}, 1000); 

}


//------------GAME SPECIFIC FUNCTIONS---------------//


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


function update() {
  $('.score').text("Score: " + game.score)
  if (game.score >= game.pointsToAdvance) {
    game.levelUp();
    timer.stop();
    timer.start(25);
    $('.level').text("Level: " + game.currentLevel);
  }
}

function gameOver() {
  timer.stop()
  $('.screen').addClass("dark");
  game.endGame();
}


//------------TUTORIAL SPECIFIC FUNCTIONS---------------//



function displayKeyTutorial() {
  tutorial.active = false; //disables clicking buttons
  $('.position').show();
  $('.position').addClass("active");
  for (var i = 0; i < tutorial.cards.length; i++) {
    var card = tutorial.cards[i];
    $('.p' + card.key).css("background-image", "url(" + card.img + ")");
  }
  setTimeout(function() {
    $('.position').removeClass("active");
    $('.position').hide();
  }, 5000);

  if (keyTutorialMode == true) { //this is the first time pressing key button
    $('#screen-text').text("In case you forgot");
    repeatTutorialMode = true;
    setTimeout(function() {
      $('#screen-text').text("Now press the repeat button");
    }, 5000);
  }
  else tutorial.active = true; //reenables clicking buttons 
  keyTutorialMode = false; //prevents key-->repeat sequence from being triggered more than once
}

function endTutorial() {
  timer.stop();
  tutorialMode = false;
  tutorial.endGame();
  $('.screen').addClass("dark");
}


//-----------------THE END-----------------//


});
