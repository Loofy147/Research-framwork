# AI Agent Meta-Orchestrator Framework

[![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

This repository contains a sophisticated framework for orchestrating and benchmarking AI agent variants. It provides the tools to systematically test, evaluate, and innovate on agent architectures through structured methodologies like adversarial design and compositional brainstorming.

## Core Framework Features

-   **Meta-Orchestrator Engine**: A central engine for defining and running complex experiments that test multiple AI agents under controlled conditions.
-   **Adversarial Benchmarking**: Move beyond standard testing by creating "adversarial" agents designed to find weaknesses and failure points in other agents, systematically improving robustness.
-   **Structured Innovation**: A formal process for brainstorming and developing novel agent architectures, guided by the methodologies outlined in our [Architecture Document](./docs/architecture.md).
-   **Extensible Agent Variants**: A clear, abstract base class for `AgentVariant` allows for the rapid development and integration of new agents into the ecosystem.
-   **TypeScript-First**: The entire framework is built with TypeScript, providing strong type safety for all core components, from the orchestrator to individual agents.

## Architecture

This project is built around a `MetaOrchestrator` that manages experiments with different `AgentVariant` implementations. The design is guided by a set of formal innovation methodologies designed to push the boundaries of AI agent capabilities.

For a comprehensive overview of the architectural patterns, brainstorming methodologies, and long-term vision, please see the **[Detailed Architecture Document](./docs/architecture.md)**.

## Technology Stack

-   **Core Framework**: [TypeScript](https://www.typescriptlang.org/)
-   **Frontend (for potential UI)**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Backend & Database**: [Supabase](https://supabase.com/)
-   **Linting**: [ESLint](https://eslint.org/)
-   **Testing**: [Vitest](https://vitest.dev/)

## Project Structure

The repository is organized into a core AI framework and a supporting application layer.

```
.
├── docs/
│   └── architecture.md # In-depth architectural and methodological guide
├── src/
│   ├── orchestrator/   # Core AI agent and orchestrator framework
│   │   ├── variants/   # Implementations of agent variants
│   │   ├── Orchestrator.ts
│   │   └── types.ts
│   ├── components/     # UI components for the web application
│   ├── services/       # External API services (e.g., Supabase)
│   └── ...             # Other standard React application directories
└── package.json
```

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) (v9 or higher)
-   A [Supabase](https://supabase.com/) account and an active project.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/enterprise-app.git
    cd enterprise-app
    ```

2.  **Create an environment file:**
    Create a file named `.env` in the root of the project with your Supabase credentials.

    ```env
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Bundles the application for production.
-   `npm run lint`: Lints the codebase.
-   `npm run preview`: Previews the production build.