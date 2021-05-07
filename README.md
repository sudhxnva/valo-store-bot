# ValoStoreBot

A simple Discord bot that retrieves the skins on sale in one’s Valorant store.

## Set up

1. Clone the repository from ``` https://github.com/sudhxnva/valo-store-bot.git ```

2. Run the command `npm install` to install all dependencies.

3. Create a Discord bot on the [Discord Developer Portal](https://discord.com/developers/) and generate an access token. (refer to [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token))

4. Create a `.env` file in the root folder with the following values:

   ```
   SECRET = "random_string_to_encrypt_passwords"
   BOT_TOKEN = "your_discord_bot_token"
   DB_URL = "mongoDB_connection_string"
   ```

5. Run the bot using `npm start`

   For development, you can use `npm run dev` (runs with nodemon).

**Note**: This implementation of the bot was designed for a small Discord server with my friends in it. Hence, it encrypts the password and stores it in a DB so that a user doesn’t have to type in their credentials every single time. The app is only encrypting the password, **NOT** hashing it(read the difference [here](https://security.stackexchange.com/a/122606)). So this won’t suit big servers where you  people who are not comfortable with their passwords being stored in a random user’s database (A solution to this is that you can modify it to only store the username and ask them to enter their password every time).

## Usage

`!store` command on a server to retrieve the store. 

![image-20210505160543424](https://user-images.githubusercontent.com/57023357/117479227-b0634280-af7d-11eb-9d7a-bdb7f69e711e.png)

If a user is calling the command for the first time, they will be asked to enter their details on a Discord DM chat with the bot.

![image-20210505160637182](https://user-images.githubusercontent.com/57023357/117132364-641ed380-adc0-11eb-8612-f3a34097924f.png)

 ![image-20210505160734269](https://user-images.githubusercontent.com/57023357/117132413-726cef80-adc0-11eb-8360-94bacfa2a044.png)

Once registered, the user will not have to enter their details again. The `!store` command should work smoothly. 
(PS: CyanidE is my in-game name if anyone is wondering)

## Credits

- [Valorant.js](https://github.com/Sprayxe/valorant.js/) (A brilliant easy-to-use library for Valorant) by [Sprayxe](https://github.com/Sprayxe)
- Inspiration for this bot from [this project](https://github.com/OwOHamper/Valorant-item-shop-discord-bot) (thanks [OwOHamper](https://github.com/OwOHamper)!)

