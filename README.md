<h1 align="center">
  <br>
  <a href="http://localhost:5173"><img src="https://raw.githubusercontent.com/kaaner/chess-game-engine/master/public/chess-icon.png" alt="Chess Game Engine" width="200"></a>
  <br>
  Chess Game Engine
  <br>
</h1>

<h4 align="center">A modern, fully functional Chess application built with vanilla JavaScript.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <a href="https://github.com/kaaner/chess-game-engine/releases">
    <img src="https://img.shields.io/github/v/release/kaaner/chess-game-engine?style=flat-square&color=blue" alt="Latest Release">
  </a>
  <a href="https://github.com/kaaner/chess-game-engine/contributors">
    <img src="https://img.shields.io/github/contributors/kaaner/chess-game-engine?style=flat-square&color=green" alt="Contributors">
  </a>
  <a href="https://github.com/kaaner/chess-game-engine/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/kaaner/chess-game-engine?style=flat-square&color=orange" alt="License">
  </a>
</p>

![screenshot](https://raw.githubusercontent.com/kaaner/chess-game-engine/master/public/screenshot.png)

## 🌟 Key Features

*   **Complete Ruleset**: Implements all standard chess rules including **Castling**, **En Passant**, and **Pawn Promotion**.
*   **Move Validation**: Robust engine (`Rules.js`) ensures only legal moves are allowed.
*   **Game State**: Tracks turns, history, captured pieces, and check/checkmate status.
*   **Responsive UI**: A beautiful, responsive interface that works on desktop and mobile.
*   **Zero Dependencies**: Built with pure Vanilla JS and CSS for maximum performance.
*   **Vite Powered**: Instant dev server and optimized production builds.

## 🚀 How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kaaner/chess-game-engine.git

# Go into the repository
$ cd chess-game-engine

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

> **Note**
> If you're using Linux Bash for Windows, [csee this guide](https://www.howtogeek.com/261591/how-to-create-and-run-bash-shell-scripts-on-windows-10/) or use `node` from the command prompt.

## 🎨 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Game logic & DOM manipulation |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Hot Module Replacement (HMR) & Bundling |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Flexbox/Grid based responsive layout |

## 🗺️ Roadmap

- [x] Board Logic & Rendering
- [x] Move Validation (Check/Checkmate)
- [x] Special Moves (Castling, En Passant)
- [ ] **AI Opponent** (Minimax Algorithm)
- [ ] **Multiplayer** (WebSockets)
- [ ] **Themes** (Customizable boards/pieces)

## 🤝 Contributing

Contributions are always welcome!

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## � License

Distributed under the MIT License. See `LICENSE` for more information.

---

> GitHub [@kaaner](https://github.com/kaaner) &nbsp;&middot;&nbsp;
> Twitter [@kaaner](https://twitter.com/kaaner)
