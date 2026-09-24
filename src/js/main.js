//tableau des emojis
const emojis = [
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
const cardNumber = emojis.length;

//racine carrée du nombre de carte
const squareRoot = Math.sqrt(cardNumber);

//définition de la taille de la grille en fonction du nombre de carte
let gridSize = 0;
const grid = document.getElementById("board");
if (Number.isInteger(squareRoot)) {
  const gridRowsColumns = squareRoot;
  grid.style.gridTemplateRows = "repeat(" + gridRowsColumns + ", 1fr)";
  grid.style.gridTemplateColumns = "repeat(" + gridRowsColumns + ", 1fr)";
} else {
  const gridRowsColumns = Math.ceil(squareRoot);
  grid.style.gridTemplateRows = "repeat(" + gridRowsColumns + ", 1fr)";
  grid.style.gridTemplateColumns = "repeat(" + gridRowsColumns + ", 1fr)";
}

//nombre de paires
const pairsNumber = emojis.length / 2;

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

  //mélange des cartes
  shuffle(emojis);
  //boucle pour la création des cartes
  emojis.forEach((emoji) => {
    //création d'un carte
    const card = document.createElement("div");

    //lien entre la carte et le style .card et .hidden
    card.classList.add("card", "hidden");

    //lien entre le dataset.emoji et les attribut css
    card.dataset.emoji = emoji;

    //ajout de la carte au board
    board.appendChild(card);
    //retourner la carte au click
    card.addEventListener("click", function () {
      //condition: si firstChoice n'a pas encore de carte assignée
      if (firstChoice === null) {
        //on attibue la carte actuelle à firstChoice
        firstChoice = card;
        //et on la révèle
        card.classList.remove("hidden");
        //style de carte active
        card.classList.add("active");
      } else if (secondChoice === null) {
        //on vérifie si la carte a déjà la classe active
        if (card.classList.contains("active")) {
          //si oui, on ne fait rien
        } else {
          //si non on peut activer la deuxième carte
          //on attribue la carte actuelle à secondChoice
          secondChoice = card;
          //et on la révèle
          card.classList.remove("hidden");
          //style de carte active
          card.classList.add("active");
        }
      } else {
        //vérification des deux cartes
        //Si les cartes ont le même symbole
        if (firstChoice.dataset.emoji === secondChoice.dataset.emoji) {
          //on active les cartes
          firstChoice.classList.remove("active");
          secondChoice.classList.remove("active");
          //on fait en sorte de ne plus pouvoir sélectionner ces cartes, car elles sont hors du jeu
          firstChoice.classList.add("found");
          secondChoice.classList.add("found");
          firstChoice = null;
          secondChoice = null;
          count += 1;
          //vérifier s'il reste des cartes
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
          //Si elles sont différentes
          //on les caches
          firstChoice.classList.add("hidden");
          secondChoice.classList.add("hidden");
          //on désactive les cartes
          firstChoice.classList.remove("active");
          secondChoice.classList.remove("active");
          firstChoice = null;
          secondChoice = null;
          count += 1;
        }
      }
    });
  });
}

startGame();
