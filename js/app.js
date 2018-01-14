/*
 * Create a list that holds all of your cards
 */
 let intervalToken = null;
 let cardList = [
   "fa-diamond",
   "fa-paper-plane-o",
   "fa-anchor",
   "fa-bolt",
   "fa-cube",
   "fa-leaf",
   "fa-bicycle",
   "fa-bomb",
   "fa-diamond",
   "fa-paper-plane-o",
   "fa-anchor",
   "fa-bolt",
   "fa-cube",
   "fa-leaf",
   "fa-bicycle",
   "fa-bomb",
 ];

/*

 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
restartGame(cardList);

function dealingOutCards(cardList) {
  const playingField = document.querySelector(".deck");

  for (let [index, icon] of shuffledCardList.entries()) {
    let card = document.createElement("li");
    card.setAttribute("class", "card");
    card.setAttribute("data-id", index)
    let iTag = document.createElement("i");
    iTag.setAttribute("class", `fa ${icon}`);
    card.appendChild(iTag);
    playingField.appendChild(card);
  }

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCardList = [];

function openCard () {
  if(openCardList.length >= 2) {
    return;
  }
  if(intervalToken === null) {
    intervalToken = startTimer();
  }
  if(openCardList.length === 1) {
    let secondCard = this;
    if(preventDoubleClick(openCardList[0], secondCard)) {
      return;
    }
    incrementCounter();
    if(checkMatch(openCardList[0], secondCard)) {
      lockMatchingCards(openCardList[0]);
      lockMatchingCards(secondCard);
      openCardList = clearOpenCardList(openCardList);
      endGame(cardList);
      return;
    } else {
      removeEventListener();
      markNotMatchingCard(secondCard);
      markNotMatchingCard(openCardList[0]);
      window.setTimeout(function() {
        closeCard(secondCard);
        closeCard(openCardList[0]);
        openCardList = clearOpenCardList(openCardList);
        registerEventListener();
      }, 1000)
      return;
    }
  }
  this.setAttribute("class", "card open show");
  openCardList.push(this);
}

function checkMatch(firstCard, secondCard) {
  if(firstCard.querySelector("i").getAttribute("class") !== secondCard.querySelector("i").getAttribute("class")){
    return false;
  }
  return true;
}

function preventDoubleClick(firstCard, secondCard) {
  if(firstCard.getAttribute("data-id") === secondCard.getAttribute("data-id")) {
    return true;
  }
  return false;
}

function lockMatchingCards(card) {
    card.removeEventListener("click", openCard);
    card.setAttribute("class", "card open show match");
}

function clearOpenCardList(openCardList) {
  openCardList = [];
  return openCardList;
}

function markNotMatchingCard(card) {
  card.setAttribute("class", "card open show not-match");
}

function closeCard(card) {
  card.setAttribute("class", "card");
}

function registerEventListener() {
  document.querySelectorAll("body > div > ul > li:not(.match)").forEach(
    function(cardObject) {
      cardObject.addEventListener("click", openCard);
    }
  );
}

function removeEventListener() {
  document.querySelectorAll("body > div > ul > li:not(.match)").forEach(
    function(cardObject) {
      cardObject.removeEventListener("click", openCard);
    }
  );
}

function endGame(cardList) {
  if(cardList.length !== document.querySelectorAll("body > div > ul > li.match").length) {
    return;
  }
  stopTimer(intervalToken);
  removeEventListener();
  winningNote();
}

function winningNote() {
  let starRating = document.querySelectorAll("body > div > section.score-panel > ul > li:not([style*='display: none'])").length;
  let playingTime = document.getElementsByClassName("timer")[0].textContent;
  document.querySelector("span.playingTime").textContent = playingTime;
  document.querySelector("span.starRating").textContent = starRating;
  document.querySelector(".popup").style.display = "block";
  registerPopupEvents();
}

function registerPopupEvents(){
  document.querySelector("a.start-new").addEventListener("click", function() {
    restartGame(cardList);
    document.querySelector(".popup").style.display = "none";
  });
  document.querySelector("a.close").addEventListener("click", function() {
  document.querySelector(".popup").style.display = "none";
  });
}

/*Moves Counter*/
function incrementCounter() {
  let counter = document.querySelector("span.moves");
  counter.textContent = parseInt(counter.textContent) + 1;
  updateStarRating(parseInt(counter.textContent));
}

function updateStarRating(counter) {
  if (counter === 11) {
    document.querySelector("body > div > section > ul > li:nth-child(3)").style.display = "none";
  }
  if (counter === 21) {
    document.querySelector("body > div > section > ul > li:nth-child(2)").style.display = "none";
  }
  if (counter === 25) {
    document.querySelector("body > div > section > ul > li:nth-child(1)").style.display = "none";
  }
}

/*Timer*/
function startTimer() {
  return window.setInterval(function(){
    let timer = document.querySelector("span.timer");
    timer.textContent = parseInt(timer.textContent) + 1;
  }, 1000)
}

function stopTimer(intervalToken) {
  window.clearInterval(intervalToken);
}

/*Main Game Handling*/
function restartGame(cardList) {
  stopTimer(intervalToken);
  intervalToken = null;
  document.querySelector("span.timer").textContent  = 0;
  document.querySelectorAll("body > div > section > ul > li").forEach(function(element){
    element.style.display = 'inline-block';
  });
  document.querySelector("span.moves").textContent  = 0;
  removeCards();
  shuffledCardList = shuffle(cardList);
  dealingOutCards(shuffledCardList);
  registerEventListener();
}

function removeCards() {
  elementList = document.querySelectorAll(".deck > li");

  if (elementList === null) {
    return;
  }

  elementList.forEach(function (element) {
    element.remove();
  })
}

(function() {
  document.querySelector("i.fa-repeat").addEventListener('click', function() {
    restartGame(cardList);
  });
})()
