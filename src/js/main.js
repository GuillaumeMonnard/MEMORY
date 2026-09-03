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
  "✌️",
  "🫥",
  "❤️",
  "👹",
  "🦷",
  "👻",
]; //tableau des emojis

//récupération du board
const board = document.querySelector("#board");

//boucle pour la création des cartes
emojis.forEach((emoji) => {
  //création d'un carte
  const card = document.createElement("div");
  //lien entre la carte et le style .card
  card.classList.add("card");
  //lien entre le dataset.emoji et les attribut css
  card.dataset.emoji = emoji;
  //ajout de la carte au board
  board.appendChild(card);
});
