# Blog Application

Welcome to the Blog Application! This project is a full-stack blog platform built with a modern and efficient development setup. It leverages the power of Turborepo to manage multiple applications and packages in a single repository, ensuring a streamlined and scalable workflow.

🚀 Key Features
Monorepo Architecture: Uses Turborepo for a unified build system and dependency management.

Next.js Frontend: A fast and responsive blog interface built with Next.js, featuring server-side rendering for optimal performance and SEO.

NestJS Backend: A robust and scalable RESTful API built with NestJS, a powerful framework for building efficient, reliable, and scalable server-side applications.

TypeScript: The entire codebase is written in TypeScript, providing type safety and improved developer experience.

Reusable Packages: Shared code, such as UI components, database clients, and utility functions, are encapsulated in dedicated packages to promote code reusability.

🛠️ Tech Stack
Monorepo
Turborepo - High-performance build system for JavaScript and TypeScript codebases.

Frontend
Next.js - The React framework for the web.

React - The JavaScript library for building user interfaces.

Tailwind CSS - A utility-first CSS framework for rapid UI development.

Backend
NestJS - A progressive Node.js framework for building efficient and scalable server-side applications.

TypeScript - A typed superset of JavaScript.

Prisma - A modern database toolkit.

📁 Project Structure
This monorepo is structured into two main directories: apps and packages.

apps/: This directory contains the runnable applications.

frontend: The NestJS backend application.

backend: The Next.js frontend application.

packages/: This directory contains reusable packages that can be shared across the applications.

ui: A shared package for UI components.

api-client: A shared package for API communication.

database: A shared package for the database schema and client.

tsconfig: A shared package for tsconfig.json configurations.

🏁 Getting Started
Prerequisites
You need to have Node.js (v20.x or higher) and npm installed on your machine.

Installation
Clone the repository and install dependencies. Turborepo will efficiently manage all dependencies across the monorepo.

git clone https://github.com/cb-tennakoon/blog.git
cd <your-repo-directory>
npm install


Running the Development Server
To start all applications concurrently, run the following command. Turborepo will start both the Next.js frontend and the NestJS backend.

npm run dev


The Next.js frontend will be available at http://localhost:3000 and the NestJS backend at http://localhost:8080.

📜 Available Scripts
Each app and package has its own set of scripts, but Turborepo allows you to run them from the root of the monorepo.

npm run dev: Runs the dev script in all projects, starting the web and api servers.

npm run build: Runs the build script in all projects, building the web and api apps for production.

npm run lint: Lints all code in the monorepo.

npm run test: Runs the test script in all projects.

App-specific Scripts
You can also run scripts for a specific application. Since you are using npm, you'll need to pass arguments to Turborepo using the -- flag.

# To start only the Next.js frontend
npm run dev -- --filter=frontend

# To start only the NestJS backend
npm run dev -- --filter=backend
