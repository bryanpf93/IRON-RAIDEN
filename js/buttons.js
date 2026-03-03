const playButton = document.getElementById("play-game-button");
const controlsButton = document.getElementById("options-button");
const tryAgainButton = document.getElementById("try-again-button");
const menuButton = document.getElementById("menu-button");
const backToMenuButton = document.getElementById("back-to-menu-button");



if (playButton) {
  playButton.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

if (controlsButton) {
  controlsButton.addEventListener("click", () => {
    window.location.href = "controls.html";
  });
}

if (tryAgainButton) {
  tryAgainButton.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

if (menuButton) {
  menuButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

if (backToMenuButton) {
    backToMenuButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}