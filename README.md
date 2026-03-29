# OrderHunt

**OrderHunt** is a modern, minimalist, and highly addictive memory game built with React and Vite. The goal is simple: find the cards numbered 1 to 10 in the correct order before the AI does.

![OrderHunt Logo](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg)

## 🎮 How to Play

1.  **The Goal**: You and the AI are both "hunting" for cards numbered 1 through 10.
2.  **The Order**: You must find them in sequence. Start with **1**, then **2**, and so on.
3.  **The Catch**:
    *   If you pick the correct number, you claim that card and continue your turn.
    *   If you pick the **wrong** number, your progress resets! You'll need to find **1** again.
    *   When you miss, all cards you claimed (except for the AI's cards) are flipped back over, and it's the AI's turn.
4.  **Winning**: The first player to successfully claim card **10** wins the game!

## ✨ Features

*   **📱 Mobile-First Design**: Optimized for all screen sizes with a compact 5x2 grid.
*   **🎨 Sleek Aesthetics**: Premium Look-and-feel with Glassmorphism, smooth animations, and a tailored color palette (Indigo for Player, Orange for AI).
*   **🌓 Dark/Light Mode**: Seamlessly switch between themes.
*   **🤖 Smart AI**: Choose from three difficulty levels:
    *   🟢 **Easy**: The AI picks cards randomly.
    *   🟡 **Medium**: The AI has a short-term memory (remembers the last 4 cards seen).
    *   🔴 **Hard**: The AI has a perfect memory and never forgets a card once flipped.
*   **🔊 Immersive Audio**: Synthesized sound effects using the Web Audio API (no external assets required).
*   **🎉 Epic Wins**: Interactive win/loss screens with confetti celebrations.

## 🚀 Tech Stack

*   **Core**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: Custom CSS Transitions + [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
*   **Logic**: Custom React Hooks (`useGameState`)
*   **Audio**: Web Audio API

## 🛠️ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/brijeshkumarmorya/orderhunt.git
    cd orderhunt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to `http://localhost:5173` to start hunting!

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by Brijesh Kumar Morya @brijeshkumarmorya
