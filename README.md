# Enterprise Application Boilerplate

[![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

This repository provides a production-ready, enterprise-grade boilerplate for modern web applications. It's built with a focus on security, performance, scalability, and developer experience, incorporating best practices and robust architectural patterns out of the box.

## Core Features

-   **Secure by Default**: Includes Content Security Policy (CSP) headers, error boundaries, robust authentication, and comprehensive error handling to protect your application and users.
-   **Optimized for Performance**: Implements code-splitting, asset compression, and build optimizations to ensure fast load times and a smooth user experience. Core Web Vitals are monitored automatically.
-   **Enterprise-Grade Data Layer**: Features a resilient API service for interacting with backends like Supabase, complete with automated retry logic and a circuit breaker pattern to handle network failures gracefully.
-   **Advanced State Management**: Utilizes modern React hooks for state management, including a custom hook for optimistic UI updates, enhancing perceived performance.
-   **Production-Ready**: Comes with a full suite of tools for a professional development lifecycle, including a structured logger, a testing framework, and PWA/Service Worker support for offline capabilities.
-   **Superior Developer Experience**: Built with TypeScript for type safety, Vite for a blazing-fast development server with HMR, and ESLint for maintaining code quality.

## Technology Stack

-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Supabase](https://supabase.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: Headless approach with custom components.
-   **Linting**: [ESLint](https://eslint.org/)
-   **Testing**: [Vitest](https://vitest.dev/) (for unit/integration tests)

## Prerequisites

Before you begin, ensure you have the following installed:
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
    Create a file named `.env` in the root of the project and add your Supabase project credentials. You can find these in your Supabase project's "API" settings.

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
    The application will be available at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run lint`: Lints the codebase using ESLint to identify and fix problems.
-   `npm run preview`: Starts a local server to preview the production build.

## Project Structure

The `src` directory is organized to promote scalability and maintainability:

```
src/
├── assets/         # Static assets like images and fonts
├── components/     # Reusable React components (common, UI)
├── config/         # Application configuration (environment variables)
├── contexts/       # React context providers (e.g., AuthContext)
├── hooks/          # Custom React hooks (e.g., useTasks, useOptimistic)
├── services/       # Services for external APIs (e.g., ApiService)
├── types/          # TypeScript type definitions and interfaces
└── utils/          # Utility functions (logger, retry logic, etc.)
```

## Architectural Decisions

-   **Singleton Services**: Core services like `ApiService`, `Logger`, and `PerformanceMonitor` are implemented as singletons to ensure a single, consistent instance throughout the application.
-   **Resilient API Layer**: The `ApiService` uses a `withRetry` utility and a `CircuitBreaker` class to make API requests more robust against transient network issues.
-   **Optimistic UI**: The `useOptimistic` hook allows for updating the UI immediately after a user action, providing a faster perceived experience while the server request completes.
-   **Component-Based Architecture**: The UI is composed of modular and reusable components, categorized into `common` (business logic-aware) and `ui` (presentational).
-   **Centralized Authentication**: The `AuthContext` provides a centralized way to manage user authentication state and actions across the entire application.