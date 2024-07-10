# F1 Tickets Scraper

*Telegram bot that scrapes daily for new available tickets for the Singapore F1 Grand Prix*

## Usage

Find and add the `f1_tickets_bot` user to your Telegram group chat (like adding a regular user)
Run the initialization command by sending a message: 
> /init

## Deployment

**Prerequisites**

- Docker
- Telegram bot token (Telegram bot should have been created in advance through BotFather)

**Build and run using Docker**

1. Retrieve the bot's Telegram token through the BotFather
2. Build and run a docker container

```shell
# Build the docker image
$ docker build -t f1tickets .

# Run a container
$ docker run -d \
    --name f1tickets \
    --restart unless-stopped \
    -e TELEGRAM_TOKEN=<YOUR TOKEN> \
    f1tickets
```