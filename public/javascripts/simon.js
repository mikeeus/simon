var colors = ['red', 'blue', 'green', 'yellow'];
var series = [];
var num = 0;
var currentSeries;
var level = 1;
var playing = false; // on/off
var strictMode = false;
var playerMoves = [];
var playerTurn = false;

var redAudio = new Audio('sounds/simonSound1.mp3');
var greenAudio = new Audio('sounds/simonSound2.mp3');
var blueAudio = new Audio('sounds/simonSound3.mp3');
var yellowAudio = new Audio('sounds/simonSound4.mp3');

function toggleStrict(){
  strictMode = !strictMode;
  resetGame();
  updateDisplay();
}
function resetGame(){
  playing = false;
  playerTurn = false;
  level = 1;
  num = 0;
  playerMoves = [];
  series = [];
  updateDisplay();
}
function startSeries(){
  if(!playing){
    playing = true;
    generateSeries();
    activateSeries();
    $('.start').addClass('active-start');
  } else {
    $('.start').removeClass('active-start');  
    updateDisplay();
  }
}
function addToSeries(){
  rand = Math.floor((Math.random() * 4));
  color = colors[rand];
  series.push(color);
}
function generateSeries(){
  for(i = 0; i < level; i++){
    addToSeries();
  }
}
function activateSeries(){
  currentSeries = setInterval(activate, 1000);
  updateDisplay();
}
function activate(){
  if(num < level){
    color = series[num];
    playSound(color);
    $('.' + color).addClass('active-' + color);
    setTimeout(function(){
      $('.' + color).removeClass('active-' + color);  
    }, 500);
    num += 1;
  } else {
    playerTurn = true;
    clearInterval(currentSeries);
  }
  updateDisplay();
}

// Compare player moves to series, 
// if wrong, show warning, player move  = false, level -= 1, activateSeries
// if wrong and strict mode, show fail, player move = false, level = 1, activateSeries
// if right, show success, activate series
function playerMove(color){
  if(playerTurn){
    playSound(color);
    playerMoves.push(color);
    compareMoves();
  }
}

function compareMoves(){
  for(i = 0; i < playerMoves.length; i++){
    if(series[i] != playerMoves[i]){
      if(strictMode){
        resetGame();
        failStrict();
        setTimeout(function(){
          startSeries();
        }, 1000);
        return;
      } else {
        showError('Wrong move, watch again.');
        playerMoves = [];
        playSeries();
        return;
      }
    }
  }
  if(playerMoves.length == series.length){
    nextLevel();
  }
}
function nextLevel(){
  addToSeries();
  level = series.length;
  playerMoves = [];
  playSeries();
}
function playSeries(){
  playerTurn = false;
  num = 0;
  activateSeries();
}

function showError(message){
  msg = $('.message');
  msg.html(message);
  msg.fadeIn();
  $('.display').addClass('error-display');
  setTimeout(function(){
    $('.display').removeClass('error-display');
    msg.fadeOut();        
  }, 3000);
}
function showSuccess(){
  msg = $('.message');
  msg.html("Awesome, you've won!");
  msg.fadeIn(500);
  $('.message').addClass('success-message');
  setTimeout(function(){
    $('.display').removeClass('success-message');
    msg.fadeOut(500);        
  }, 5000);
}
function failStrict(){
  msg = $('.message');
  msg.html('Wrong move, try again.');
  msg.fadeIn(500);  
  $('.display').addClass('error-display');
  setTimeout(function(){
    $('.display').removeClass('error-display');
    msg.fadeOut(500);                    
  }, 3000);
}

function playSound(color){
  switch(color){
    case 'red':
      redAudio.play();
      break;
    case 'green':
      greenAudio.play();    
      break;    
    case 'blue':
      blueAudio.play();    
      break;    
    case 'yellow':    
      yellowAudio.play();    
      break;
    default:
      break;
  }
}

function updateDisplay(){
  if(!playing){
    $('.start').removeClass('active-start');
    $('.simon-frame').removeClass('simon-playing');    
  } else {
    $('.start').addClass('active-start');
    $('.simon-frame').addClass('simon-playing'); 
    playerTurn ? $('.level').addClass('active-level') : $('.level').removeClass('active-level');       
  }
  if($('.level').html() != level){
    $('.display').addClass('active-display');
    // change values at the end of the timeout
    $('.level').html(level);
    setTimeout(function(){
      $('.display').removeClass('active-display');
    }, 1000);
  }
  // strict mode
  if(strictMode){
    $('.mode').addClass('mode-active');
  } else {
    $('.mode').removeClass('mode-active');    
  }
}


$(document).ready(function(){

});