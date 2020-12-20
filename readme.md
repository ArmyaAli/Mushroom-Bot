# ILL BE MOVING AWAY FROM USING JAVASCRIPT AND MOVING MY BOT TO TYPESCRIPT - See the typescript mushroom bot repo for the recent version!
This is a discord bot that I made as small project for myself! It's called Mushroom-Bot.


Currently working features:

    - Help command
        - Gets a list of all the commands the user can use -> !help
    - Admin Commands
        - kick a user by mentioning them with the kick command -> !kick @baduser
        - can clear text channels up to a 100 messages using -> !clear 0 < N < 100
            - can NUKE an entire text channel using -> !clear nuke
    - Urban dictionary search
        - Gets the 5 top results of a query from urbandiction.com -> !ud query
    - Music Player
        - Play a song -> !play args
        - Get all the songs in the queue -> !queue
        - Queue up songs -> !play args (while you have music playing)
        - Pause/Resume currently playing music -> !pause, !resume
        - Stop -> !stop
    - Server Greeting
        - Greets newcomers to the discord server with the message: Welcome to the Mushroom Cave *name*! 
