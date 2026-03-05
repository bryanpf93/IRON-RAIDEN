const parentElm = document.getElementById("board")
const playerElm = document.getElementById("player")
const scoreElm = document.getElementById("score")
const livesElm = document.getElementById("lives")
const shootSound = document.getElementById("shoot-sound")
const gameMusic = document.getElementById("game-music")
gameMusic.volume = 0.25
const loseLifeSound = document.getElementById("lose-life-sound");
loseLifeSound.volume = 0.25



class Player {
    constructor() {
        this.width = 110;
        this.height = 150;
        this.speed = 10 // velocidad del jugador
        this.positionX = (parentElm.clientWidth / 2) - (this.width / 2); // Su punto de partida es el medio de la posicion horizontal
        this.positionY = 0
        this.updateUI()
    }

    updateUI() {
        playerElm.style.left = this.positionX + "px"
        playerElm.style.bottom = this.positionY + "px"
        playerElm.style.width = this.width + "px"
        playerElm.style.height = this.height + "px"
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 10
            this.updateUI()
        }
    }

    moveRight() {
        if (this.positionX < parentElm.clientWidth - this.width) {
            this.positionX += 10
            this.updateUI()
        }
    }

    moveUp() {
        if (this.positionY < parentElm.clientHeight - this.height) {
            this.positionY += 10
            this.updateUI()
        }
    }

    moveDown() {
        if (this.positionY > 0) {
            this.positionY -= 10
            this.updateUI()
        }
    }
}

class Enemy {
    constructor() {
        this.width = 110;
        this.height = 80;
        this.positionX = Math.floor(Math.random() * (parentElm.clientWidth - this.width + 1)) // Spawn enemigo en una posición horizontal aleatoria
        this.positionY = parentElm.clientHeight

        this.createEnemyElement()
        this.updateUI()

    }

    createEnemyElement() {
        this.enemyElement = document.createElement("div")
        this.enemyElement.className = "enemy"
        parentElm.appendChild(this.enemyElement)

    }

    updateUI() {
        this.enemyElement.style.left = this.positionX + "px"
        this.enemyElement.style.bottom = this.positionY + "px"
        this.enemyElement.style.width = this.width + "px"
        this.enemyElement.style.height = this.height + "px"
    }

    moveDown() {
        this.positionY -= 4 // Mueve el enemigo hacia abajo lentamente
        this.updateUI()
    }
}

class Bullet {
    constructor(x, y) {
        this.width = 20;
        this.height = 80;
        this.positionX = x;
        this.positionY = y

        this.createBulletElement();
        this.updateUI();
    }

    createBulletElement() {
        this.bulletElement = document.createElement("div")
        this.bulletElement.className = "bullet"
        parentElm.appendChild(this.bulletElement)
    }

    updateUI() {
        this.bulletElement.style.left = this.positionX - this.width / 2 + "px"
        this.bulletElement.style.bottom = this.positionY + "px"
        this.bulletElement.style.width = this.width + "px"
        this.bulletElement.style.height = this.height + "px"
    }

    moveUp() {
        this.positionY = this.positionY + 10; // Velocidad de la bala
        this.updateUI()
    }

    remove() {
        this.bulletElement.remove()
    }


}


const player = new Player()

let enemiesArr = [] // array de los enemigos generados
let bulletArr = [] // array de las balas generadas
let lives = 3
let score = 0;

const keys = { // objeto que guarda el estado de las teclas del jugador
    ArrowLeft: false,  // true si la tecla izquierda está presionada
    ArrowRight: false, // true si la tecla derecha está presionada
    ArrowUp: false,    // true si la tecla arriba está presionada
    ArrowDown: false   // true si la tecla abajo está presionada
}

// Se inicializan en null para saber que aun no existen
let spawnInterval = null;
let moveInterval = null;



// Funcion que crea las balas
const shootBullet = () => {
    shootSound.currentTime = 0
    shootSound.play()
    const bullet = new Bullet(
        player.positionX + player.width / 2,  // En el centro horizontal del jugador
        player.positionY + player.height  //  Encima de su posicion vertical
    );
    bulletArr.push(bullet);

}

const movePlayer = () => {

    let dx = 0 // variable que guardará la dirección horizontal (-1 izquierda, 1 derecha)
    let dy = 0 // variable que guardará la dirección vertical (1 arriba, -1 abajo)

    if (keys.ArrowLeft) dx -= 1 // si la tecla izquierda está pulsada, restamos 1 → mover a la izquierda
    if (keys.ArrowRight) dx += 1 // si la tecla derecha está pulsada, sumamos 1 → mover a la derecha
    if (keys.ArrowUp) dy += 1 // si la tecla arriba está pulsada, sumamos 1 → mover hacia arriba
    if (keys.ArrowDown) dy -= 1 // si la tecla abajo está pulsada, restamos 1 → mover hacia abajo

    player.positionX += dx * player.speed // mueve al jugador horizontalmente según dirección y velocidad
    player.positionY += dy * player.speed // mueve al jugador verticalmente según dirección y velocidad

    player.updateUI() // actualiza la posición visual del jugador en el DOM
}

// Funcion que inicia el juego
const startGame = () => {
    if (!spawnInterval && !moveInterval) { // Solo crea intervalos si NO existen (evita duplicarlos accidentalmente)
        spawnInterval = setInterval(() => {
            const newEnemy = new Enemy()
            enemiesArr.push(newEnemy)
        }, 3000);

        moveInterval = setInterval(() => {

            movePlayer() // llama a la función que calcula el movimiento del jugador en cada frame

            enemiesArr.forEach((enemyInstance, enemyInstanceIndex) => {
                enemyInstance.moveDown()
                // Elimina el enemigo si llega al fondo del tablero
                if (enemyInstance.positionY < 0) {
                    enemyInstance.enemyElement.remove()
                    enemiesArr.splice(enemyInstanceIndex, 1)
                    lives--

                    loseLifeSound.currentTime = 0
                    loseLifeSound.play()

                    livesElm.innerText = "LIVES: " + "🚀 ".repeat(lives)

                    if (lives <= 0) {
                        location.href = "game-over.html" // Redirige a la pantalla de Game Over si el jugador pierde todas sus vidas
                    }
                }

                else if ( // Comprueba si el jugador toca un enemigo
                    player.positionX < enemyInstance.positionX + enemyInstance.width &&
                    player.positionX + player.width > enemyInstance.positionX &&
                    player.positionY < enemyInstance.positionY + enemyInstance.height &&
                    player.positionY + player.height > enemyInstance.positionY
                ) {
                    location.href = "game-over.html" // Redirige a la pantalla de Game Over si el jugador colisiona con un enemigo
                }
            })



            bulletArr.forEach((bullet, bulletIndex) => {
                bullet.moveUp();
                if (bullet.positionY > parentElm.clientHeight) {
                    bullet.remove()
                    bulletArr.splice(bulletIndex, 1)
                    return // Elimina la bala del array y el DOM cuando se sale de la pagina 
                }
                enemiesArr.forEach((enemy, enemyIndex) => {
                    if ( // Comprueba si la bala toca un enemigo
                        bullet.positionX < enemy.positionX + enemy.width &&
                        bullet.positionX + bullet.width > enemy.positionX &&
                        bullet.positionY < enemy.positionY + enemy.height &&
                        bullet.positionY + bullet.height > enemy.positionY
                    ) {
                        enemy.enemyElement.remove()
                        enemiesArr.splice(enemyIndex, 1)
                        bullet.remove()
                        bulletArr.splice(bulletIndex, 1)
                        score += 10
                        scoreElm.innerHTML = `SCORE: ${score}`
                        console.log(score)

                    }
                })
            });
        }, 30);
    }
}

// Función para pausar el juego
const pauseGame = () => {

    clearInterval(spawnInterval)
    clearInterval(moveInterval)
    // Resetea las variables
    // Permite reiniciar sin duplicados
    spawnInterval = null
    moveInterval = null
}

// Detecta cuando cambias de pestaña o minimizas el navegador
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pauseGame()
        gameMusic.pause()
    } else {
        startGame()
        setTimeout(() => {
            gameMusic.play()
        }, 700)
    }
})

window.addEventListener("blur", () => {
    pauseGame() // minimizas el navegador
    gameMusic.pause()
})
window.addEventListener("focus", () => {
    startGame() // vuelves al navegador
    setTimeout(() => {
        gameMusic.play()
    }, 1000)
})

// Inicia el juego al cargar la página siempre que el focus sea el navegador
if (document.hasFocus()) {
    startGame()
}




document.addEventListener("keydown", (e) => {

    if (keys.hasOwnProperty(e.code)) {
        // comprueba si la tecla que se pulsó es una de las que controlan movimiento
        keys[e.code] = true // marca esa tecla como PRESIONADA
    }

    if (e.code === "Space") {
        shootBullet()
    }

})

document.addEventListener("keyup", (e) => {

    if (keys.hasOwnProperty(e.code)) {
        // si soltamos una tecla de movimiento
        keys[e.code] = false // marcamos esa tecla como NO presionada
    }

})

window.addEventListener("load", () => {
    setTimeout(() => {
        gameMusic.play()
    }, 1000)
})



