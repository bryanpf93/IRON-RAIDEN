const menuMusic = document.getElementById("menuMusic")

menuMusic.volume = 0.4

document.addEventListener("click", () => {
    menuMusic.play()
}, { once: true })
