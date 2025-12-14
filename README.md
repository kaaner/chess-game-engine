# ♟️ Modern Chess Engine

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?style=for-the-badge&logo=github)
![Tech](https://img.shields.io/badge/built%20with-JavaScript-yellow.svg?style=for-the-badge&logo=javascript)
![Build](https://img.shields.io/badge/build-vite-646CFF.svg?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)

A modern, responsive, and fully functional Chess application built with Vanilla JavaScript and refined with advanced architectural patterns. This project emphasizes clean code, separation of concerns, and a "wow" user experience.

---

## 🌟 Key Features

### 🎮 Core Gameplay
-   **Complete Chess Rules**: Implementation of standard rules including Castling, En Passant, and Pawn Promotion.
-   **Move Validation**: Robust `Rules.js` engine that prevents illegal moves and validates check/checkmate states.
-   **Game State Management**: Centralized `GameState` handling turns, move history, and captured pieces.
-   **Game Clock**: Integrated timer with customizable settings.

### 🎨 User Interface
-   **Responsive Design**: A split-screen layout that works beautifully across devices.
-   **Visual Feedback**:
    -   Highlighting of valid moves.
    -   Captured pieces display (Material count).
    -   Dynamic check/checkmate notifications.

---

## 🛠️ Tech Stack

This project uses a modern, lightweight stack to ensure performance and simplicity.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ES6+ Modern JavaScript |
| **Bundler** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Blazing fast build tool & dev server |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Modular Vanilla CSS |
| **Architecture** | **MVC-ish** | Separation of Logic (`GameState`) & View (`PieceRenderer`) |

---

## 🚀 Getting Started

Follow these steps to get the game running on your local machine.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v16+ recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kaaner/chess-game-engine.git
    cd chess-game-engine
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the URL provided in the terminal).

---

## 🗺️ Roadmap

-   [x] Core Game Logic & Rules
-   [x] UI/UX Basic Implementation
-   [x] Castling & En Passant
-   [ ] **AI Opponent** (Single Player Mode)
-   [ ] **Online Multiplayer** (WebSockets)
-   [ ] **Move History Sidebar** (PGN Notation)
-   [ ] **Sound Effects**

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
