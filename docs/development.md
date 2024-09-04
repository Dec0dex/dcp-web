# Setup & Development

This guide explains how to set up the project and start the development server.

[[toc]]

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en) version >= `20.10.0`
- [Pnpm](https://pnpm.io/installation) version >= `9.5.0`

## Installation

```bash
# Install dependencies from the package.json file.
pnpm install
```

> Note: Don't delete the `pnpm-lock.yaml` file. It's used to lock the dependencies version.

### Running the project

```bash
# Start the development server
pnpm start
```

## Docker

Set up your application and database effortlessly using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose).

### Installing Docker

Get Docker from the official site for your operating system:

- Mac: [Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- Windows: [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
- Ubuntu: [Install Docker on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

### Installing Docker Compose

Download Docker Compose from [official website](https://docs.docker.com/compose/install).

### Quick run

#### Running the app in Watch Mode (Local Development)

To start the application in watch mode for local development:

1. Open your terminal and navigate to the project directory.
2. Run the command:

```bash
docker compose -f docker-compose.local.yml up --build -d
```

> Note: The application will run on port 4200 (<http://localhost:4200>)

## Upgrade

To upgrade the dependencies to the latest version, run:

```bash
# Upgrade dependencies to the latest version
pnpm upgrade --interactive --latest
```