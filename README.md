# AI Agent Meta-Orchestrator Framework

[![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

This repository contains a sophisticated framework for orchestrating and benchmarking AI agent variants. It provides the tools to systematically test, evaluate, and innovate on agent architectures through a data-driven, command-line interface.

## Core Framework Features

-   **Meta-Orchestrator Engine**: A central engine for defining and running complex experiments that test multiple AI agents under controlled conditions.
-   **Command-Line Interface (CLI)**: Run experiments, load configurations, and generate reports directly from the command line.
-   **Configuration-Driven Experiments**: Define complex adversarial or standard benchmarks in a simple `config.yaml` file.
-   **Extensible Agent Architecture**: A clear, abstract base class for `AgentVariant` allows for the rapid development and integration of new agents into the ecosystem.
-   **Automated Reporting**: Automatically generate a `summary.md` file with detailed metrics after every experiment run.

## Architecture

This project is built around a `MetaOrchestrator` that manages experiments with different `AgentVariant` implementations. The design is guided by a set of formal innovation methodologies designed to push the boundaries of AI agent capabilities.

For a comprehensive overview of the architectural patterns, brainstorming methodologies, and long-term vision, please see the **[Detailed Architecture Document](./docs/architecture.md)**.

## Technology Stack

-   **Core Framework**: TypeScript, Node.js
-   **CLI**: Yargs
-   **Configuration**: YAML
-   **Testing**: Vitest

## Project Structure

The repository is organized into a core AI framework and a command-line interface.

```
.
├── dist/             # Compiled JavaScript output
├── docs/
│   └── architecture.md # In-depth architectural and methodological guide
├── src/
│   ├── cli/            # The command-line interface for running experiments
│   │   └── index.mts
│   └── orchestrator/   # Core AI agent and orchestrator framework
│       ├── variants/   # Implementations of agent variants
│       ├── agentRegistry.ts
│       ├── configLoader.ts
│       ├── Orchestrator.ts
│       ├── reporting.ts
│       └── types.ts
├── config.yaml       # Defines experiments for the orchestrator
└── package.json
```

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) (v9 or higher)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/enterprise-app.git
    cd enterprise-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running Experiments

Experiments are defined in `config.yaml` and can be executed via the CLI.

1.  **Define an experiment** in the `config.yaml` file.
2.  **Run the experiment** by its name using the `experiment` script:
    ```bash
    npm run experiment -- run "Your Experiment Name"
    ```
3.  **View the results** in the generated `summary.md` file.