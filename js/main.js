const parentElm = document.getElementById("board")
const playerElm = document.getElementById("player")
const scoreElm = document.getElementById("score")
const livesElm = document.getElementById("lives")

class Player {
    constructor() {
        this.width = 110;
        this.height = 150;
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

// Se inicializan en null para saber que aun no existen
let spawnInterval = null;
let moveInterval = null;

// Funcion que crea las balas
const shootBullet = () => {
    const bullet = new Bullet(
        player.positionX + player.width / 2,  // En el centro horizontal del jugador
        player.positionY + player.height  //  Encima de su posicion vertical
    );
    bulletArr.push(bullet);

}

// Funcion que inicia el juego
const startGame = () => {
    if (!spawnInterval && !moveInterval) { // Solo crea intervalos si NO existen (evita duplicarlos accidentalmente)
        spawnInterval = setInterval(() => {
            const newEnemy = new Enemy()
            enemiesArr.push(newEnemy)
        }, 3000);

        moveInterval = setInterval(() => {

            enemiesArr.forEach((enemyInstance, enemyInstanceIndex) => {
                enemyInstance.moveDown()
                // Elimina el enemigo si llega al fondo del tablero
                if (enemyInstance.positionY < 0) {  
                    enemyInstance.enemyElement.remove()
                    enemiesArr.splice(enemyInstanceIndex, 1)
                    lives--
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
                if (bullet.positionY > parentElm.clientHeight ) {
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
    } else {
        startGame()
    }
})

window.addEventListener("blur", () => pauseGame()) // minimizas el navegador
window.addEventListener("focus", () => startGame()) // vuelves al navegador

// Inicia el juego al cargar la página siempre que el focus sea el navegador
if (document.hasFocus()) {
    startGame()
}



// Detecta movimentos del jugador usando las teclas
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        player.moveLeft()
    } else if (e.code === "ArrowRight") {
        player.moveRight()
    } else if (e.code === "ArrowUp") {
        player.moveUp()
    } else if (e.code === "ArrowDown") {
        player.moveDown()
    } else if (e.code === "Space") {
        e.preventDefault()
        shootBullet()
    }
})


