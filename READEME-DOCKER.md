# hackmud-chat-client

If you don't want to run this in a docker follow the steps [here](https://github.com/Slingexe/hackmud-chat-client)  

## First time setup (For Docker)
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
    - Send Embed Messages
    - Add Reactions
    - Manage Messages
```

Pull the latest release from [DockerHub](https://hub.docker.com/r/slingexe/hackmud-chat-client)  
`docker pull slingexe/hackmud-chat-client:latest`  

Run the docker with the following command  (Make sure to replace LOCALFOLDER to a location on your computer ex: /mnt/user/appdata/hackmud-chat-client)
`docker run -v LOCALFOLDER:/config -e TOKEN=token123 -e CLIENTID=12345 -e GUILDID=12345 slingexe/hackmud-chat-client`  
`docker run -v LOCALFOLDER:/config -e TOKEN=token123 -e CLIENTID=12345 -e GUILDID=12345 -d slingexe/hackmud-chat-client` - For detatched mode  
Note: Once you run the docker once with the Token, ClientId and GuildId arguments you don't have to pass them again unless you want to change them  
If you already have a hackmud token you can pass `-e MUDTOKEN=token` if you don't keep following the steps

To get the three arguments follow these steps  
Copy the bot's discord token (Application > Bot > Token)  
Copy the application's clientID (Application > OAuth > ClientID)  
Copy the guildID (Turn on dev mode > Right Click guild > CopyID)   

In hackmud run the command `chat_pass` and copy the result  
In discord send `/settings auth password:"pass"`  
Once it says its successfully set the Token run `/settings setup`, this should create text channels with the users you have on your hackmud account  
Run `/settings manage-users user:username pull:True` to enable pulling messages from your users (This doesn't affect the ability of sending messages as said users only recieving them)  
Once you have done all that you are now able to run `/client start` (Once you have done all the steps above the bot should pull messages on startup)
The guild the bot is in should now have all of your users set as channels and it should start pulling messages.  

## Usage  
Type in the channels the bot created to send a message to hackmud  
Change the channel the bot sends to by doing the same thing you would normally do with the chat box (%n00bz / %0000)  

## Contributions
All contributions are greatly appriciated! I am not great at coding so expect lots of spaghetti code.  

# Useful Links
[Hackmud Chat API Documentation](https://hackmud.com/forums/general_discussion/chat_api_documentation)  
[Discord ACSI Color Codes](https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06)  
[Discord.JS Guide](https://discordjs.guide/)  