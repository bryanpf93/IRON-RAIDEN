const parentElm = document.getElementById("board")
const playerElm = document.getElementById("player")

class Player {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 50 - this.width / 2; // Su punto de partida es el medio de la posicion horizontal
        this.positionY = 0

        this.updateUI()
    }

    updateUI() {
        playerElm.style.left = this.positionX + "vw"
        playerElm.style.bottom = this.positionY + "vh"
        playerElm.style.width = this.width + "vw"
        playerElm.style.height = this.height + "vh"
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX--
            this.updateUI()
        }
    }

    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX++
            this.updateUI()
        }
    }

    moveUp() {
        if (this.positionY < 100 - this.height) {
            this.positionY++
            this.updateUI()
        }
    }

    moveDown() {
        if (this.positionY > 0) {
            this.positionY--
            this.updateUI()
        }
    }
}

class Enemy {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1)) // Spawn enemigo en una posición horizontal aleatoria
        this.positionY = 100

        this.createEnemyElement()
        this.updateUI()

    }

    createEnemyElement() {
        this.enemyElement = document.createElement("div")
        this.enemyElement.className = "enemy"
        parentElm.appendChild(this.enemyElement)

    }

    updateUI() {
        this.enemyElement.style.left = this.positionX + "vw"
        this.enemyElement.style.bottom = this.positionY + "vh"
        this.enemyElement.style.width = this.width + "vw"
        this.enemyElement.style.height = this.height + "vh"
    }

    moveDown() {
        this.positionY = this.positionY - 0.3 // Mueve el enemigo hacia abajo lentamente
        this.updateUI()
    }
}

class Bullet {
    constructor(x, y) {
        this.width = 1;
        this.height = 3;
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
        this.bulletElement.style.left = this.positionX + "vw"
        this.bulletElement.style.bottom = this.positionY + "vh"
        this.bulletElement.style.width = this.width + "vw"
        this.bulletElement.style.height = this.height + "vh"
    }

    moveUp() {
        this.positionY = this.positionY + 1.5; // Velocidad de la bala
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

// Se inicializan en null para saber que aun no existen
let spawnInterval = null;
let moveInterval = null;

// Funcion que crea las balas
const shootBullet = () => {
    const bullet = new Bullet(
        player.positionX + player.width / 2 - 0.5,  // En el centro horizontal del jugador
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
        }, 4000);

        moveInterval = setInterval(() => {

            enemiesArr.forEach((enemyInstance, enemyInstanceIndex) => {
                enemyInstance.moveDown()
                // Elimina el enemigo si llega al fondo del tablero
                if (enemyInstance.positionY < 0) {  
                    enemyInstance.enemyElement.remove()
                    enemiesArr.splice(enemyInstanceIndex, 1)
                    lives--
                    
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
                if (bullet.positionY > 100) {
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

// Inicia el juego al cargar la página
startGame()



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


