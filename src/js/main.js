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
        const separation = document.createElement("p");
        separation.textContent =
          "_________________________________________________________________________________________________";
        document.body.appendChild(separation);
        const winText = document.createElement("p");
        winText.textContent = "CONGRATS, You won in " + count + " moves.";
        document.body.appendChild(winText);
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

  //Utilisation du clavier pour se déplacer dans la grille
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
  cardElement[0].focus();
}

//variables pour le terminal
const output = document.getElementById("output");
const typedElement = document.getElementById("typed");
const promptElement = document.getElementById("prompt");

//texte en cours de saisie
let buffer = "";
//interrupteur, tant qu'il est false, on est dans le terminal
let gameStarted = false;
//tableau qui garde les commandes déjà tapées et index
const history = [];
let historyIndex = 0;

//création de la fonction de print
function print(text) {
  const p = document.createElement("p");
  p.textContent = text;
  output.appendChild(p);
}

//création des commandes disponibles dans le terminal
const commands = {
  startgame() {
    //interrupteur true, on ne capte plus le clavier pour écrire dans le terminal
    gameStarted = true;
    promptElement.hidden = true;
    print("-> launching game...");
    startGame(); //lancement de la partie
  },
  help() {
    //afficher la liste des commandes
    print("-> available commands: startgame, help, clear");
  },
  clear() {
    //on efface tout le contenu du terminal
    output.innerHTML = "";
  },
};

//création de la fonction run, qui est appelée quand le joueur
//appuie sur enter. input = texte écrit
function run(input) {
  //imprime la commande, comme dans un terminal
  print("-> " + input.toUpperCase());
  //nettoie la commande en enlevant les espaces autour et en mettant en minuscule
  const name = input.trim().toLowerCase();

  //condition: si l'utilisateur n'a rien écrit, on sort
  if (name === "") return;

  //ajout à l'historique pour le réutiliser plus tard avec haut/bas
  history.push(name);
  historyIndex = history.length;

  //on va chercher la commande entrée et si elle existe on l'exécute
  if (commands[name]) {
    commands[name]();
  } else {
    print("-> command not found: " + name.toUpperCase());
  }
}

//écouteur de touches pour le terminal
document.addEventListener("keydown", (e) => {
  //si la partie est déjà lancée, on ne fait rien
  if (gameStarted) return;
  //si on appuie sur entrée
  if (e.key === "Enter") {
    //on lance la commande ave run
    run(buffer);
    buffer = "";
  }
  //sinon, si on appuie sur backspace
  else if (e.key === "Backspace") {
    //on retire le dernier caractère
    buffer = buffer.slice(0, -1);
  }
  //si ArrowUp
  else if (e.key === "ArrowUp") {
    //on empeche le comportement par défaut
    e.preventDefault();
    //si on est pas déjà tout en haut de l'hitorique, on recule d'un cran et on mets cette ancienne commade dans le buffer
    if (historyIndex > 0) buffer = history[--historyIndex];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    //on avance d'un cran, mais math.min empêche de dépasser la fin de l'historique
    historyIndex = Math.min(historyIndex + 1, history.length);
    //on met la commande dans le buffer
    buffer = history[historyIndex] || "";
  } //caractère normal sans ctrl/cmd/alt -> on ajoute buffer
  else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    buffer += e.key;
  }

  typedElement.textContent = buffer;
  window.scrollTo(0, document.body.scrollHeight);
});
