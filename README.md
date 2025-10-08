# Enterprise Application Boilerplate

This is a production-ready enterprise application boilerplate built with a modern, robust, and scalable tech stack. It provides a solid foundation for building high-quality, feature-rich web applications, with a focus on security, performance, and developer experience.

## Features

-   **Modern Tech Stack:** Built with React, Vite, TypeScript, and Tailwind CSS.
-   **Full Authentication:** Complete authentication flow using Supabase, including sign-up, sign-in, and protected routes.
-   **Robust Component Library:** A comprehensive set of UI components built with Radix UI for accessibility and styled with Tailwind CSS.
-   **Advanced State Management:** Centralized state management with Zustand for a predictable and scalable state solution.
-   **Resilient API Layer:** A centralized API service for interacting with Supabase, with built-in error handling and logging.
-   **Comprehensive Testing:** Unit testing with Vitest and React Testing Library, and end-to-end testing with Playwright.
-   **Automated Code Quality:** Pre-commit hooks with Husky and `lint-staged` to ensure code quality and consistency.

## Getting Started

To get started with the project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    This project requires a `.env` file with your Supabase credentials. Create a `.env` file in the root of the project and add the following variables:
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

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
-   `src/e2e`: Contains the end-to-end tests written with Playwright.
-   `src/test`: Contains the setup files for unit testing.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run test`: Runs the unit tests using Vitest.
-   `npm run test-e2e`: Runs the end-to-end tests using Playwright.
-   `npm run preview`: Previews the production build locally.
-   `npm run prepare`: Sets up Husky pre-commit hooks.

## Technologies Used

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Supabase](https://supabase.io/)
-   [Zustand](https://zustand-demo.pmnd.rs/)
-   [Radix UI](https://www.radix-ui.com/)
-   [Vitest](https://vitest.dev/)
-   [Playwright](https://playwright.dev/)
-   [ESLint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [Husky](https://typicode.github.io/husky/)
-   [lint-staged](https://github.com/okonet/lint-staged)