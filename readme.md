# CompilerPro: Full Pipeline Edition 

**CompilerPro** is an interactive, full-stack compiler visualization tool designed to bridge the gap between high-level source code and low-level machine assembly. Built with a modern dark-themed UI, it provides a step-by-step breakdown of the six classic stages of compilation.

---

##  The Pipeline

This project implements a robust, front-to-back compiler architecture:

### 1. Lexical Analysis (DFA-based)
* **Engine:** Deterministic Finite Automata (DFA).
* **Function:** Tokenizes source code into Identifiers, Keywords, Operators, and Literals.
* **Feature:** Real-time error detection for invalid symbols.

### 2. Syntax Analysis (Recursive Descent)
* **Parser:** Top-down Recursive Descent Parser.
* **Function:** Validates the token stream against defined grammar rules to ensure structural integrity.

### 3. Semantic Analysis (Scope Stack)
* **Mechanism:** Stack-based Symbol Table.
* **Checks:** Type compatibility (e.g., `int` to `float` assignment), variable redeclaration, and scope-level access.

### 4. Intermediate Code (Quadruples & TAC)
* **Format:** Three-Address Code (TAC).
* **Structure:** Processes logic into `(op, arg1, arg2, result)` quadruples for machine-independent representation.

### 5. Code Optimization (Constant Folding)
* **Logic:** Implements **Constant Folding** and **Algebraic Simplification**.
* **Goal:** Reduces the number of instructions by evaluating constant expressions at compile-time.

### 6. Code Generation (Intel 8085)
* **Target:** Intel 8085 Microprocessor.
* **Output:** Generates functional assembly code, handling register allocation (A, B, C, D, H, L) and memory mapping.

---

## Tech Stack

* **Frontend:** React.js / Next.js
* **Styling:** Tailwind CSS (Custom Dark Mode UI)
* **State Management:** React Context API / Hooks
* **Icons:** Lucide React

---

## Getting Started

### Prerequisites
* Node.js (v16.x or higher)
* npm or yarn

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/compiler-pro.git](https://github.com/your-username/compiler-pro.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Launch the development server:**
    ```bash
    npm run dev
    ```
4.  **View the project:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Interface Guide

* **Source Code Editor:** Input your C-like code (e.g., `int a = 10;`).
* **Compile & Analyze:** Triggers the entire backend pipeline.
* **Pipeline Stages (Sidebar):** Navigate through each phase to see the transformed data (Tokens ➡️ TAC ➡️ 8085 Assembly).

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

*Created as a Full-Stack Computer Science Project - 6th Semester.*