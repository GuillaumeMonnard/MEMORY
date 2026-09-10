const emojis = [
  "👄",
  "🧚‍♀️",
  "💩",
  "🐢",
  "🤡",
  "👁️",
  "🐤",
  "🙊",
  "🌽",
  "🌵",
  "🌻",
  "🐝",
  "👄",
  "🧚‍♀️",
  "💩",
  "🐢",
  "🤡",
  "👁️",
  "🐤",
  "🙊",
  "🌽",
  "🌵",
  "🌻",
  "🐝",
]; //tableau des emojis

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
const board = document.querySelector("#board");

//mélange des cartes
shuffle(emojis);

//création des variables de choix
let firstChoice = null;
let secondChoice = null;

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
      //style de bouton pressé
      card.classList.add("pressed");
      //style de carte active
      card.classList.add("active");
    } else if (secondChoice === null) {
      //on attribue la carte actuelle à secondChoice
      secondChoice = card;
      //et on la révèle
      card.classList.remove("hidden");
      //style de bouton pressé
      card.classList.add("pressed");
      //style de carte active
      card.classList.add("active");
    } else {
      //vérification des deux cartes
      //Si les cartes ont le même symbole
      if (firstChoice.dataset.emoji === secondChoice.dataset.emoji) {
        //on atctive les cartes
        firstChoice.classList.remove("active");
        secondChoice.classList.remove("active");
        firstChoice = null;
        secondChoice = null;
      } else {
        //Si elles sont différentes
        //on les caches
        firstChoice.classList.add("hidden");
        secondChoice.classList.add("hidden");
        //on enleve le style de bouton pressé
        firstChoice.classList.remove("pressed");
        secondChoice.classList.remove("pressed");
        //on désactive les cartes
        firstChoice.classList.remove("active");
        secondChoice.classList.remove("active");
        firstChoice = null;
        secondChoice = null;
      }
    }
  });
});
