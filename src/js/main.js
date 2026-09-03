//récupération du board
const board = document.querySelector("#board");

//création d'un carte
const card = document.createElement("div");
//lien entre la carte et le style .card
card.classList.add("card");

card.dataset.emoji = "👀";

//boucle pour la création des cartes
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
];

//ajout de la carte au board
board.appendChild(card);
