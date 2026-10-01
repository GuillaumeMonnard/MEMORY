import { gsap } from "gsap";

//tableau des symboles
const symboles = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

//ajout d'un compteur de coup
let count = 0;

//nombre de cartes
const cardNumber = symboles.length;

//racine carrée du nombre de carte
const squareRoot = Math.sqrt(cardNumber);

//définition de la taille de la grille en fonction du nombre de carte
const grid = document.getElementById("board");
let gridColumns = Number.isInteger(squareRoot)
  ? squareRoot
  : Math.ceil(squareRoot);

grid.style.gridTemplateRows = "repeat(" + gridColumns + ", 1fr)";
grid.style.gridTemplateColumns = "repeat(" + gridColumns + ", 1fr)";

//nombre de paires
const pairsNumber = symboles.length / 2;

//fonction de mélange aléatoire
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

//récupération du board
let board = document.querySelector("#board");

//création d'une fonction pour lancer la partie
function startGame() {
  //vider le board existant
  board.innerHTML = "";
  count = 0;

  // //supprimer l'alerte de fin de partie SI il y en a un qui existe
  const existingWinScreen = document.getElementById("win-alert");
  if (existingWinScreen) {
    existingWinScreen.remove();
  }

  //création des variables de choix
  let firstChoice = null;
  let secondChoice = null;
  let cardFoundNumber = 0;

  //création d'un tableau d'index pour les carte
  let cardElement = [];
  //activeIndex retient l'index de la carte active
  let activeIndex = 0;

  //mélange des cartes
  shuffle(symboles);

  //création de la fonction de sélection de carte
  //placée ICI, avant le forEach, pour rester accessible dans tout startGame
  let locked = false; // à déclarer avec firstChoice et secondChoice

  function selectCard(card) {
    //si le jeu est bloqué (pendant l'affichage d'une mauvaise paire), on ne fait rien
    if (locked) return;
    //si la carte a déjà été trouvée, on ne fait rien
    if (card.classList.contains("found")) return;
    //si la carte est déjà retournée, on ne fait rien
    if (card.classList.contains("active")) return;

    //on révèle la carte
    card.classList.remove("hidden");
    card.classList.add("active");

    if (firstChoice === null) {
      //première carte : on la retient
      firstChoice = card;
      return;
    }

    //deuxième carte : on vérifie tout de suite
    secondChoice = card;
    count += 1;

    if (firstChoice.dataset.symbole === secondChoice.dataset.symbole) {
      //même symbole : on désactive et on met hors jeu
      firstChoice.classList.remove("active");
      secondChoice.classList.remove("active");
      firstChoice.classList.add("found");
      secondChoice.classList.add("found");
      firstChoice = null;
      secondChoice = null;

      //vérifier s'il reste des cartes
      const pairsFoundNumber = document.querySelectorAll(".found").length / 2;
      if (pairsFoundNumber === pairsNumber) {
        const winScreen = document.createElement("div");
        winScreen.id = "win-alert";
        winScreen.textContent = "Win en: " + count + " coups. Chacal.";
        document.body.appendChild(winScreen);
        const restartButton = document.createElement("button");
        restartButton.id = "restart-button";
        restartButton.textContent = "Rejouer";
        winScreen.appendChild(restartButton);
        restartButton.addEventListener("click", startGame);
      }
    } else {
      //symboles différents : on bloque, on laisse voir 800 ms, puis on cache
      locked = true;
      setTimeout(function () {
        firstChoice.classList.add("hidden");
        secondChoice.classList.add("hidden");
        firstChoice.classList.remove("active");
        secondChoice.classList.remove("active");
        firstChoice = null;
        secondChoice = null;
        locked = false;
      }, 800);
    }
  }

  //boucle pour la création des cartes
  symboles.forEach((symbole, index) => {
    //création d'un carte
    const card = document.createElement("div");
    //lien entre la carte et le style .card et .hidden
    card.classList.add("card", "hidden");
    //lien entre le dataset.symbole et les attribut css
    card.dataset.symbole = symbole;
    card.dataset.index = index;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", index === 0 ? "0" : "-1");

    //ajout de la carte au board
    board.appendChild(card);
    cardElement.push(card);

    //retourner la carte au click
    //reste DANS le forEach car "card" n'existe que le temps d'un tour de boucle
    card.addEventListener("click", function () {
      selectCard(card);
    });
  });

  //l'étape 7 (le clavier) viendra juste ici, une fois ce code testé
  board.addEventListener("keydown", function (e) {
    const key = e.key;

    if (key === "Enter" || key === " ") {
      e.preventDefault(); //empêche le comportement natif (espace fait défiler la page)
      selectCard(cardElement[activeIndex]); //on appelle selectCard pour retourner la carte qui est en focus, même effet qu'au click
    }

    let newIndex = activeIndex;

    if (key === "ArrowRight") newIndex++;
    else if (key === "ArrowLeft") newIndex--;
    else if (key === "ArrowDown") newIndex += gridColumns;
    else if (key === "ArrowUp") newIndex -= gridColumns;
    else return;

    e.preventDefault();

    if (newIndex >= 0 && newIndex < cardElement.length) {
      cardElement[activeIndex].setAttribute("tabindex", "-1");
      activeIndex = newIndex;
      cardElement[activeIndex].setAttribute("tabindex", "0");
      cardElement[activeIndex].focus();
    }
  });
}

startGame();
