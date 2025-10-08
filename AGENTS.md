# Agent Instructions for Enterprise App

This document provides instructions for AI agents and developers on how to work with this enterprise application boilerplate.

## Project Overview

This is a production-ready enterprise application built with React, Vite, TypeScript, and Supabase. It includes a comprehensive set of features, including a robust component library, a full authentication flow, and a resilient API service layer.

## Getting Started

To get started with the project, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    This project requires a `.env` file with your Supabase credentials. Create a `.env` file in the root of the project and add the following variables:
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Project Structure

The project is organized into the following directories:

-   `src/components`: Contains the UI components, divided into `ui` (reusable, generic components) and `auth` (authentication-related components).
-   `src/layouts`: Contains the main layout components for the application.
-   `src/pages`: Contains the page-level components for each route.
-   `src/stores`: Contains the Zustand stores for global state management.
-   `src/services`: Contains the Supabase client and the centralized API service.
-   `src/hooks`: Contains custom React hooks.
-   `src/types`: Contains TypeScript type definitions.
-   `src/lib`: Contains utility functions, such as the `cn` function for merging class names.

## Conventions

-   **State Management:** Use Zustand for global state management. Create new stores in the `src/stores` directory as needed.
-   **Components:** Build new components in the `src/components` directory. Use Radix UI as the foundation for new components to ensure accessibility.
-   **Styling:** Use Tailwind CSS for all styling.
-   **API Requests:** Use the `apiService` in `src/services/apiService.ts` for all interactions with the Supabase API. This ensures consistent error handling and logging.
-   **Testing:**
    -   Write unit tests for all new components and hooks using Vitest and React Testing Library. Place test files in a `__tests__` directory alongside the file being tested.
    -   Write E2E tests for all critical user flows using Playwright. Place E2E test files in the `src/e2e` directory.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run test`: Runs the unit tests using Vitest.
-   `npm run test-e2e`: Runs the end-to-end tests using Playwright.
-   `npm run preview`: Previews the production build locally.
-   `npm run prepare`: Sets up Husky pre-commit hooks.