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

## Quickstart

Get up and running with the framework in a few simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) (v9 or higher)

### 1. Clone and Install

Clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/Loofy147/Research-framwork.git
cd Research-framwork
npm install
```

### 2. Configure Your Experiment

Define the experiment you want to run in `config.yaml`. Here is an example that tests a baseline agent against an adversary.

```yaml
# config.yaml
experiments:
  - name: "Example Adversarial Test"
    agents:
      - variant: "BasicParserAgent"
        params:
          temperature: 0.7
      - variant: "my-agent-v1"
    rounds: 5
    metrics:
      - "success_rate"
      - "avg_latency"
```

### 3. Run the Experiment

Execute the experiment using the CLI. The framework will compile the code and run the experiment specified in your configuration.

```bash
npm run experiment -- run "Example Adversarial Test"
```

### 4. View the Results

After the experiment completes, a `summary.md` file will be generated in the root directory with the results and metrics.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.