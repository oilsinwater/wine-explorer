# Project Documentation

## Overview

This project, named "wine-explorer", is a web application built using the STRUDEL Kit. STRUDEL Kit is a starter kit for building scientific UIs using React and TypeScript, based on the STRUDEL Design System and Task Flows.

## Key Technologies

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript.
- **Vite**: A fast build tool for modern web projects.
- **Material-UI**: A popular React UI framework.
- **TanStack Router**: A fully type-safe router for React.
- **Plotly.js**: A graphing library for creating interactive charts.
- **ESLint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **Prettier**: An opinionated code formatter.
- **Cypress**: A next generation front end testing tool built for the modern web.

## Project Structure

The project follows a standard structure for a React application built with Vite.

- **`src/`**: Contains the main source code of the application.
  - **`src/components/`**: Contains reusable React components.
  - **`src/pages/`**: Contains the different pages or "task flows" of the application.
  - **`src/hooks/`**: Contains custom React hooks.
  - **`src/context/`**: Contains React context providers.
  - **`src/types/`**: Contains TypeScript type definitions.
  - **`src/utils/`**: Contains utility functions.
- **`public/`**: Contains static assets that are publicly accessible.
  - **`public/dummy-data/`**: Contains dummy data used for development and testing.
- **`cypress/`**: Contains end-to-end tests written with Cypress.
- **`docs/`**: Contains project documentation.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm start
    ```
    This will start the Vite development server and open the application in your default browser at `http://localhost:5175`.

## Available Scripts

- **`npm start` or `npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run preview`**: Serves the production build locally for preview.
- **`npm run deploy`**: Deploys the application to GitHub Pages.
- **`npm run lint`**: Lints the codebase using ESLint.
- **`npm run prettier`**: Checks the formatting of the codebase using Prettier.
- **`npm run cy:open`**: Opens the Cypress test runner.
- **`npm run cy:test`**: Runs Cypress tests in headless mode.

## Application Routes

- `/`
- `/compare-data`
- `/compare-data/compare`
- `/compare-data/new`
- `/contribute-data`
- `/contribute-data/new`
- `/contribute-data/portal`
- `/contribute-data/review`
- `/explore-data/$id`
- `/explore-data/`
- `/monitor-activities/calendar`
- `/monitor-activities/detail`
- `/monitor-activities/`
- `/playground/`
- `/run-computation`
- `/run-computation/$id/data-inputs`
- `/run-computation/$id/results`
- `/run-computation/$id/running`
- `/run-computation/$id/settings`
- `/run-computation/`
- `/search-data-repositories/$id`
- `/search-data-repositories/`

## Vite Configuration

The `vite.config.ts` file contains the following configurations:

- **`@tanstack/router-plugin/vite`**: This plugin is used for TanStack Router.
- **`@vitejs/plugin-react`**: This plugin is used for React.
- **`base`**: The base URL is loaded from the `VITE_BASE_URL` environment variable.
- **`server`**: The development server is configured to run on port `5175`.

## Linting

The project uses ESLint with the following configuration:

- **Parser**: `@typescript-eslint/parser`
- **Extends**: `airbnb-typescript` and `plugin:prettier/recommended`
- **Plugins**: `@typescript-eslint`, `import`, `react`, `prettier`
- **Custom Rules**:
    - `@typescript-eslint/no-explicit-any`: "off"
    - `@typescript-eslint/no-use-before-define`: "off"
    - `import/no-extraneous-dependencies`: "error" with `devDependencies: true`
    - `react/no-danger`: "off"
    - `react/prop-types`: "off"
    - `react/jsx-props-no-spreading`: "off"
    - `react/react-in-jsx-scope`: "off"
    - `no-console`: "error"
    - `no-plusplus`: "off"
    - `prettier/prettier`: "off"

## Testing

The project uses Cypress for end-to-end testing. The configuration is in the `cypress.config.ts` file:

- **`baseUrl`**: `http://localhost:5175/`
- **`specPattern`**: `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}` and `src/**/*.cy.{js,jsx,ts,tsx}`
