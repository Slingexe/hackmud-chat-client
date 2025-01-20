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
Once it says its successfully set the Token run `/settings setup` then `/client start`  
The guild the bot is in should now have all of your users set as channels and it should start pulling messages.  
  
## Contributions
All contributions are greatly appriciated! I am not great at coding so expect lots of spaghetti code.  


# Useful Links
[Hackmud Chat API Documentation](https://hackmud.com/forums/general_discussion/chat_api_documentation)  
[Discord ACSI Color Codes](https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06)  
[Discord.JS Guide](https://discordjs.guide/)  

# TODO  
- Clean a lot of the code