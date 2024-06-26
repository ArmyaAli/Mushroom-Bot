# Mushroom-Bot

## Project setup 

#### Prerequisites

- Nodejs 20.11.0
- corresponding node npm version...
- Docker (optional)
    
    You can build js files for Node runtime using TypeScript compiler or build a Docker image via the included Dockerfile

#### Environment Variables
NOTE: The following environment variables are required for this application to function. You may set them on yourOS or use an environment file 

- DISCORD_CLIENT_ID=
- DISCORD_CLIENT_SECRET=
- DISCORD_BOT_TOKEN=
#### Setup Instructions

1. Clone Mushroom-Bot code repository

        git clone https://github.com/ArmyaAli/Mushroom-Bot.git

2. Install dependencies

        cd Mushroom-Bot
        npm install

3. Run the application

        npm run dev

## Builds & Deployment

#### Build application locally

        npm run build

#### Build Docker image
        docker build . -t mushroom-bot

#### Deployment

<b>Option 1</b>
1. Install Docker on your target machine https://docs.docker.com/engine/install/
2. Run the docker image

        docker run -d --restart=always mushroom-bot:latest

<b>Option 2</b>
1. You may run it like the following:

        # move deps into build folder
        cp node_modules dist/node_modules 

        # cd into build dir run the app using node
        cd dist
        node main.js

#### Versioning scheme

    x     x     x
    major minor patch

- Major: Large overhauls, LL Design changes, multiple fixes, multiple features
- Minor: small features / 1-2 features max, optimizations, multiple fixes
- Patch: few fixes / QoL improvements
