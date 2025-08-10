# Developer Setup Instructions

These instructions will guide you through setting up the Mushroom-Bot project for development.

## Prerequisites

*   **Node.js:** You will need Node.js version **22.17.1**. It is recommended to use a version manager like `nvm` or `nvs` to ensure you are using the correct version.
*   **npm:** This project uses `npm` for package management, which is included with Node.js.

## Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Mushroom-Bot
    ```

2.  **Install Dependencies:**
    Install the necessary node packages using `npm`.
    ```bash
    npm install
    ```

3.  **Configure your Environment:**
    You will need to provide your own Discord bot credentials.
    a. Create a copy of the example configuration file:
    ```bash
    cp config.ts.example src/config.ts
    ```
    b. Edit `src/config.ts` and provide your credentials. You can get these from the [Discord Developer Portal](https://discord.com/developers/applications).
    - `discordAppId`
    - `discordAppSecret`
    - `discordToken`
    - `discordGuildId`

4.  **Deploy Commands:**
    Before running the bot, you need to deploy the slash commands to your Discord server.
    ```bash
    npm run deploy
    ```

5.  **Run the Application:**
    To run the bot in development mode with automatic reloading on file changes, use the `dev` script.
    ```bash
    npm run dev
    ```
    Your bot should now be running and connected to your Discord server.
