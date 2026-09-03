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
    card.classList.remove("hidden");
  });
});
