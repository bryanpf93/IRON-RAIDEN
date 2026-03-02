const playerElm = document.getElementById("player")

class Player {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 50 - this.width / 2;
        this.positionY = 100 - this.height;

        this.updateUI()
    }

    updateUI() {
        playerElm.style.left = this.positionX + "vw"
        playerElm.style.top = this.positionY + "vh"
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
        if (this.positionY > 0) {
            this.positionY--
            this.updateUI()
        }
    }

    moveDown() {

        if (this.positionY < 100 - this.height) {
            this.positionY++
            this.updateUI()
        }
    }
}

const player = new Player()


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



