const parentElm = document.getElementById("board")
const playerElm = document.getElementById("player")

class Player {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 50 - this.width / 2;
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
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1))
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
        this.positionY = this.positionY - 0.1
        this.updateUI()
    }
}



const player = new Player()

let enemiesArr = []

// Se inicializan en null para saber que aun no existen
let spawnInterval = null;
let moveInterval = null;

// Funcion que inicia el juego
const startGame = () => {
    if (!spawnInterval && !moveInterval) { // Solo crea intervalos si NO existen (evita duplicarlos accidentalmente)
        spawnInterval = setInterval(() => {
            const newEnemy = new Enemy() // Crea un enemigo
            enemiesArr.push(newEnemy) // Lo guarda en el array
        }, 4000);

        moveInterval = setInterval(() => {
            enemiesArr.forEach(enemyInstance => {
                enemyInstance.moveDown()  // Mueve cada enemigo

                if (
                    player.positionX < enemyInstance.positionX + enemyInstance.width &&
                    player.positionX + player.width > enemyInstance.positionX &&
                    player.positionY < enemyInstance.positionY + enemyInstance.height &&
                    player.positionY + player.height > enemyInstance.positionY
                ) {
                    console.log("gamer over")
                    location.href = "game-over.html" 
                }
            })
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
    if (document.hidden) { // // Si la pestaña NO está visible pausara el juego
        pauseGame()
    } else { // Si vuelves a la pestaña el juego continuara
        startGame()
    }
})

// Inicia el juego al cargar la página
startGame()



// Detecta movimentos del jugador usando las flechas
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        player.moveLeft()
    } else if (e.code === "ArrowRight") {
        player.moveRight()
    } else if (e.code === "ArrowUp") {
        player.moveUp()
    } else if (e.code === "ArrowDown") {
        player.moveDown()
    }
})



