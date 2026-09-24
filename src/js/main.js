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
    function selectCard(card) {
      if (firstChoice === null) {
        firstChoice = card;
        card.classList.remove("hidden");
        card.classList.add("active");
      } else if (secondChoice === null) {
        if (card.classList.contains("active")) {
          // rien
        } else {
          secondChoice = card;
          card.classList.remove("hidden");
          card.classList.add("active");
        }
      } else {
        if (firstChoice.dataset.symbole === secondChoice.dataset.symbole) {
          firstChoice.classList.remove("active");
          secondChoice.classList.remove("active");
          firstChoice.classList.add("found");
          secondChoice.classList.add("found");
          firstChoice = null;
          secondChoice = null;
          count += 1;
          pairsFoundNumber = document.querySelectorAll(".found").length / 2;
          if (pairsFoundNumber === pairsNumber) {
            const winScreen = document.createElement("div");
            winScreen.id = "win-alert";
            winScreen.textContent = "Win en: " + count + " coups. Chacal.";
            document.body.appendChild(winScreen);
            const restartButton = document.createElement("button");
            restartButton.id = "restart-button";
            restartButton.textContent = "Rejouer";
            document.getElementById("win-alert").appendChild(restartButton);
            restartButton.addEventListener("click", startGame);
          }
        } else {
          firstChoice.classList.add("hidden");
          secondChoice.classList.add("hidden");
          firstChoice.classList.remove("active");
          secondChoice.classList.remove("active");
          firstChoice = null;
          secondChoice = null;
          count += 1;
        }
      }
    }
  });
}

startGame();
