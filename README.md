# 🚀 IRON RAIDEN

Vertical scrolling shooter inspired by classic arcade games like **Raiden**.

IRON RAIDEN is a browser game built with **HTML, CSS and JavaScript**, where the player controls a fighter ship and must survive waves of enemies while shooting and avoiding collisions.

---

# 🎮 Game Overview

IRON RAIDEN is a fast-paced **arcade shooter** where the player pilots a spaceship and fights enemy units that appear from the top of the screen.

The objective is simple:

- Survive as long as possible
- Destroy enemies
- Avoid collisions
- Achieve the highest score

---

# 🧩 MVP (Minimum Viable Product)

The Minimum Viable Product of **IRON RAIDEN** includes the core mechanics required for a playable vertical shooter.

The MVP features are:

- The **player can move** inside the game board
- **Enemies appear** and move toward the player
- The player **loses the game if a collision with an enemy occurs**
- The player can **shoot enemies/obstacles and destroy them**

These mechanics create the **core gameplay loop** of the game.

---

# 🚀 Features

Current implemented mechanics:

- Player movement (X and Y axis)
- Shooting system
- Enemy spawning
- Collision detection
- Score system
- Menu screen
- Controls screen
- Game Over screen
- Game pause when the browser tab loses focus

---

# 🕹 Controls

| Key | Action |
|----|------|
| ⬅️ ➡️ | Move left / right |
| ⬆️ ⬇️ | Move up / down |
| Space | Shoot |

---

# 🖥 Tech Stack

The game is built using vanilla web technologies:

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

No external frameworks or libraries are used.

---

## 📂 Project Structure

```
IRON-RAIDEN
│
├── assets
│ └── images
│
├── css
│ └── main.css
│
├── js
│ └── main.js
│
├── index.html
├── game.html
├── controls.html
├── game-over.html
└── README.md
```


# 🧠 Game Logic

### Player Movement
The player can move freely inside the board limits.

### Shooting System
Pressing **Space** fires projectiles upward that destroy enemies.

### Enemy System
Enemies spawn from the top of the screen and move toward the player.

### Collision Detection
Collision is handled using **AABB (Axis-Aligned Bounding Box)** detection.

---


