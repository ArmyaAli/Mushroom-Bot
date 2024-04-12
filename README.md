# Mushroom-Bot

## Project Setup for Development

#### Prerequisites

- Nodejs 20.11.0
- corresponding node npm version...
- Docker (optional)
    
    You can build js files for Node runtime using TypeScript compiler or build a Docker image via the included Dockerfile

#### Setup Instructions

1. Clone Mushroom-Bot code repository

        git clone https://github.com/ArmyaAli/Mushroom-Bot.git

2. Install dependencies

        cd Mushroom-Bot
        npm install

#### Build Docker Image
        docker build . -t mushroom-bot

#### Deployment
1. Install Docker on your target machine https://docs.docker.com/engine/install/
2. Run the docker image

        docker run -d --restart=always mushroom-bot:latest

#### Versioning scheme

    x     x     x
    major minor patch

- Major: Large overhauls, LL Design changes, multiple fixes, multiple features
- Minor: small features / 1-2 features max, optimizations, multiple fixes
- Patch: few fixes / QoL improvements