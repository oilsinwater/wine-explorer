# Tech Stack

## Technology Stack Table

| Category             | Technology                   | Version | Purpose                          | Rationale                                                       |
| -------------------- | ---------------------------- | ------- | -------------------------------- | --------------------------------------------------------------- |
| Frontend Language    | JavaScript (ES6+)            | ES2020+ | Core application logic           | Universally supported in modern browsers, no compilation needed |
| Frontend Framework   | Vanilla JS + Strudel Kit     | Latest  | UI components and utilities      | Demonstrates Strudel kit capabilities as required by PRD        |
| UI Component Library | Strudel Kit Components       | Latest  | Pre-built UI components          | Directly showcases Strudel kit as per project goals             |
| State Management     | Vanilla JS with Custom Store | ES2020+ | Application state handling       | Lightweight solution appropriate for prototype scope            |
| Backend Language     | N/A                          | N/A     | N/A                              | Client-side only implementation per PRD                         |
| Backend Framework    | N/A                          | N/A     | N/A                              | Client-side only implementation per PRD                         |
| API Style            | Client-side Data Fetching    | ES2020+ | Data retrieval                   | Direct CSV file loading as per requirements                     |
| Database             | CSV Files                    | N/A     | Data storage                     | Uses provided UCI dataset files directly                        |
| Cache                | Browser Cache                | Native  | Asset caching                    | Built-in browser capabilities sufficient for prototype          |
| File Storage         | Static File Hosting          | N/A     | CSV file hosting                 | Simplest approach for prototype with no user uploads            |
| Authentication       | N/A                          | N/A     | N/A                              | No authentication required per PRD                              |
| Frontend Testing     | Jest + Testing Library       | Latest  | Unit and integration tests       | Industry standard tools with good documentation                 |
| Backend Testing      | N/A                          | N/A     | N/A                              | No backend components to test                                   |
| E2E Testing          | Cypress                      | Latest  | End-to-end testing               | Comprehensive testing tool that works well with SPAs            |
| Build Tool           | Vite                         | Latest  | Development server and build     | Fast, modern build tool with excellent developer experience     |
| Bundler              | Vite (ESBuild/Rollup)        | Latest  | Code bundling                    | Built into Vite, optimized for modern web development           |
| IaC Tool             | N/A                          | N/A     | N/A                              | No infrastructure to provision for static site                  |
| CI/CD                | GitHub Actions               | Latest  | Automated testing and deployment | Integrated with GitHub, free for open source projects           |
| Monitoring           | Google Analytics             | Latest  | Basic usage tracking             | Simple implementation for prototype metrics                     |
| Logging              | Console Logging              | Native  | Debug logging                    | Built-in browser capabilities sufficient for prototype          |
| CSS Framework        | Strudel Kit CSS + Custom CSS | Latest  | Styling                          | Leverages Strudel kit styling while allowing customization      |
