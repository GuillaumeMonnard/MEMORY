//affichage de la date et l'heure actuelles dans la ligne "last login"
const lastLogin = document.getElementById("last-login");
const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
const month = now.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
const date = now.getDate();
const time = now.toLocaleTimeString("en-GB"); // format 24h : 08:26:58

lastLogin.textContent =
  "-> last login: " +
  day +
  " " +
  month +
  " " +
  date +
  " " +
  time +
  " on ttys000";

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

//racine carrée du nombre de carte
const squareRoot = Math.sqrt(symboles.length);

//nombre de paires
const pairsNumber = symboles.length / 2;

//fonction de mélange aléatoire
function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

//création d'une fonction pour lancer la partie
function startGame() {
  //reset du score
  count = 0;
  //marquer l'ancien board comme terminé
  const previousBoard = output.querySelector(".board:not(.finished)");
  if (previousBoard) {
    previousBoard.classList.add("finished");
    previousBoard.querySelectorAll(".card").forEach((card) => {
      card.removeAttribute("tabindex");
      card.removeAttribute("role");
    });
  }

  //définition de la taille de la grille en fonction du nombre de carte
  const board = document.createElement("div");
  board.classList.add("board");

  const gridColumns = Number.isInteger(squareRoot)
    ? squareRoot
    : Math.ceil(squareRoot);

  board.style.gridTemplateRows = "repeat(" + gridColumns + ", 1fr)";
  board.style.gridTemplateColumns = "repeat(" + gridColumns + ", 1fr)";

  //création des variables de choix
  let firstChoice = null;
  let secondChoice = null;
  let locked = false;

  //création d'un tableau d'index pour les carte
  let cardElement = [];
  //activeIndex retient l'index de la carte active
  let activeIndex = 0;

  //mélange des cartes
  shuffle(symboles);

  //création de la fonction de sélection de carte
  //placée ICI, avant le forEach, pour rester accessible dans tout startGame
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
      const pairsFoundNumber = board.querySelectorAll(".found").length / 2;
      if (pairsFoundNumber === pairsNumber) {
        //réactivation du terminal une fois la partie terminée
        gameStarted = false;
        promptElement.hidden = false;

        const separation = document.createElement("p");
        separation.textContent =
          "_________________________________________________________________________________________________";
        output.appendChild(separation);
        const winText = document.createElement("p");
        winText.textContent = "CONGRATS, You won in " + count + " moves.";
        output.appendChild(winText);
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

      selectCard(cardElement[activeIndex]);
      return;
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
  output.appendChild(board);
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
const foundCommands = new Set();
let historyIndex = 0;

//création de la fonction de print
function print(text) {
  const p = document.createElement("p");
  p.textContent = text;
  output.appendChild(p);
}

//création des commandes disponibles dans le terminal
const commands = {
  hello() {
    print(`->            
              -|-------------------|-
               |       Hello :)    | 
              -|-------------------|-
      ⠀              ⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠚⠉⠀⣀⠈⠱⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⠀⠀⠀⡠⠟⠀⠀⣿⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⡀⣀⠀⠀⠀⠀⢸⠀⠘⡿⠁⠀⠀⣠⠞⠁⠀⠉⠉⠓⠲⠦⢤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⢀⡤⡎⢹⠉⡷⢤⠀⠀⠈⠳⣄⣀⡠⠴⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠉⠛⠶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠸⡇⠸⠀⠃⡇⠸⣇⠀⠀⣠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡀⠀⠀⠈⠙⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⢀⡇⠀⠀⠀⠀⠀⠘⣦⠾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⠀⠀⠀⠀⠀⠉⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⢸⡇⠀⠀⠀⠀⠀⠀⠘⣷⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⡟⢦⡀⠀⠀⠀⠀⠀⠀⠀
      ⢸⡇⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣦⠀⠀⠀⠀⠀⠘⡌⢷⡀⠀⠀⠀⠀⠀⠀
      ⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⡀⠀⠀⠀⠀⠈⠺⣧⠀⠀⠀⠀⠀⠀
      ⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⠀⠀⠀⠹⡆⠀⠀⠀⠀⠀
      ⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀
      ⠀⠀⠹⣦⡀⠀⠀⠀⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⠀⠀⢿⠀⠀⠀⠀⠀
      ⠀⠀⠀⠈⠙⠒⠦⠔⠚⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣇⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠏⣷⠀⣏⢠⡏⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⣦⠟⡘⢠⡟⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⠁⡋⠓⠟⠉⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡾⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠏⠙⠶⢤⣄⣀⡀⠀⠀⢀⣀⣠⡤⠞⠋⠁⡇⢸⠇⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡾⠀⠀⠀⠀⠀⠈⠉⠉⡏⠉⠁⠀⠀⠀⠀⠀⢡⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⣸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⠀⠀⣀⣀⣇⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣤⠔⠒⠉⠀⢈⣏⠀⠉⠑⠒⢄⣠⠏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠲⠶⠒⠋⠉⠙⠓⠒⠒⠛⠁⠀⠀⠀
      
      Welcome to my terminal themed memory game :)

      I hope you will enjoy playing it, don't hesitate to try all the commands available (type 'help' to see most of them)
      
      some of them are hidden command, will you be able to find them? 0_0`);
  },

  rules() {
    print(
      "--------------------------------------------------------------------------------",
    );
    print("-> the board is full of face-down cards.");
    print("-> every card has an identical twin somewhere on the board.");
    print("-> flip two cards per turn. if they match, they stay revealed.");
    print("-> if they don't match, they flip back after a short moment.");
    print("-> a move = two cards flipped.");
    print("-> find all the pairs to win. the fewer moves, the better.");
    print("-> ");
  },

  howtoplay() {
    print(
      "--------------------------------------------------------------------------------",
    );
    print('-> 1. type "startgame" and press enter.');
    print(
      '-> 2. Use arrows to move between cards and press "space" or "enter" to flip it',
    );
    print("-> 3. flip a second card and try to find its twin.");
    print(
      "-> 4. remember where the cards are. mismatched cards are hidden again.",
    );
    print(
      "-> 5. once every pair is found, you see your score and the terminal comes back.",
    );
    print("-> ");
  },

  startgame() {
    //interrupteur true, on ne capte plus le clavier pour écrire dans le terminal
    gameStarted = true;
    promptElement.hidden = true;
    print("-> launching game...");
    startGame(); //lancement de la partie
  },

  sudo() {
    print("-> ");
    print("-> nice try. you are not in the sudoers file.");
    print("-> ");
  },

  hack() {
    print("-> ");
    print("-> connecting to network...");
    setTimeout(() => print("-> bypassing firewall..."), 400);
    setTimeout(() => print("-> decrypting password... 37%"), 1000);
    setTimeout(() => print("-> decrypting password... 52%"), 1200);
    setTimeout(() => print("-> decrypting password... 82%"), 2500);
    setTimeout(() => print("-> decrypting password... 100%"), 3500);
    setTimeout(() => print("-> access granted. just kidding."), 3600);
    setTimeout(() => print("-> "), 3600);
  },

  howmanyleft() {
    const hiddenCommands = ["sudo", "hack"];
    const found = hiddenCommands.filter((command) =>
      foundCommands.has(command),
    );
    const left = hiddenCommands.length - found.length;
    if (left > 0) {
      print("-> " + left + " hidden command(s) left.");
    } else {
      print('-> almost there! type "LASTONE" to reveal the last one');
    }
  },

  help() {
    //afficher la liste des commandes
    print(
      "-> available commands: hello, rules, howtoplay, startgame, howmanyleft, help, clear",
    );
  },

  lastone() {
    print("-> Got you, it was a trap :P");
    gameStarted = true; // bloque la saisie
    promptElement.hidden = true; // cache le prompt
    setTimeout(function () {
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "black";
    }, 2000);

    setTimeout(function () {
      const thankYou = document.createElement("p");
      thankYou.textContent =
        "thank you for playing :) refresh the page to start again";
      document.body.appendChild(thankYou);
    }, 2001);
  },

  clear() {
    //on efface tout le contenu du terminal
    output.innerHTML = "";
  },
};

//création de la fonction run, qui est appelée quand le joueur appuie sur enter. input = texte écrit
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
    foundCommands.add(name);
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
    //si on est pas déjà tout en haut de l'hitorique, on recule d'un cran et on mets cette ancienne commande dans le buffer
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
