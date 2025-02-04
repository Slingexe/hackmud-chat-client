# hackmud-chat-client
## First time setup
Create a discord bot using [Discord Developer Portal](https://discord.com/developers/)  
Create a discord server (Its not recommended to have this bot in a public server)  

### Bot Permissions
**Make sure the bot has these permissons set, otherwise it will break!**  
```
    Privileged Gateway Intents
    - Message Content Intent

    Server Role Permissions
    - View Channels
    - Manage Channels
    - Send Messages
    - Add Reactions
    - Manage Messages
```

Copy (or rename) the example config "configex.json" to "config.json"  
Copy the bot's discord token to "token" (Application > Bot > Token)  
Copy the application's clientID to "clientId" (Application > OAuth > ClientID)  
Copy the guildID to "guildId" (Turn on dev mode > Right Click guild > CopyID)  
Run `node deploy-commands.js` so all the commands deploy instantly to your server  
Run the BOT using `node index.js`  
  
In hackmud run the command `chat_pass` and copy the result  
In discord send `/settings auth password:"pass"`  
Once it says its successfully set the Token run `/settings setup`, this should create text channels with the users you have on your hackmud account  
Run `/settings manage-users user:username pull:True` to enable pulling messages from your users (This doesn't affect the ability of sending messages as said users only recieving them)  
Once you have done all that you are now able to run `/client start` (Once you have done all the steps above the bot should pull messages on startup)
The guild the bot is in should now have all of your users set as channels and it should start pulling messages.  

# Docker  
Download the latest release image from [Gitbub](https://github.com/Slingexe?tab=packages&repo_name=hackmud-chat-client) or [DockerHub](https://hub.docker.com/r/slingexe/hackmud-chat-client)  
Run the docker with `docker run -e TOKEN=token -e CLIENTID=clientid -e GUILDID=guildid slingexe/hackmud-chat-client`  
Pass the `-d` argument to run the docker in detached mode  
The continue with the regular setup process  


## Usage  
Type in the channels the bot created to send a message to hackmud  
Change the channel the bot sends to by doing the same thing you would normally do with the chat box (%n00bz / %0000)  

## Contributions
All contributions are greatly appriciated! I am not great at coding so expect lots of spaghetti code.  


# Useful Links
[Hackmud Chat API Documentation](https://hackmud.com/forums/general_discussion/chat_api_documentation)  
[Discord ACSI Color Codes](https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06)  
[Discord.JS Guide](https://discordjs.guide/)  