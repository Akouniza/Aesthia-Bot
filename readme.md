# AesthiaBot

AesthiaBot is a powerful and versatile Discord bot designed to enhance your server with a variety of features, including moderation, utility commands, and debugging tools. Built using Discord.js v14, AesthiaBot is easy to set up and customize to fit your server's needs.

## Features

- **Moderation Commands**: Manage your server with ease using commands for banning, kicking, muting, and more.
- **Utility Commands**: Access useful tools and information, such as help commands, server info, and user info.
- **Debugging Tools**: Debug your bot and server with commands designed to help you troubleshoot issues.
- **Custom Events**: Extend the bot's functionality with custom event handlers.

## Getting Started

### Prerequisites

Before you can run AesthiaBot, you need to have the following installed:

- [Node.js](https://nodejs.org/) (v16.6.0 or higher)
- [npm](https://www.npmjs.com/)
- A [Discord bot token](https://discord.com/developers/applications)
- A MySQL database

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/AesthiaBot.git
    cd AesthiaBot
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```env
    DISCORD_TOKEN=your-discord-bot-token
    GUILD_ID=your-guild-id
    DB_HOST=your-database-host
    DB_PORT=your-database-port
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_DATABASE=your-database-name
    ```

4. Start the bot:

    ```bash
    node index.js
    ```

## Usage

### Commands

AesthiaBot comes with a variety of commands organized into different categories. Here are some examples:

- **Moderation Commands**:
    - `/ban [user] [reason]`: Ban a user from the server.
    - `/kick [user] [reason]`: Kick a user from the server.
    - `/mute [user] [duration]`: Mute a user for a specified duration.

- **Utility Commands**:
    - `/help`: Display a list of all commands with navigation arrows.
    - `/serverinfo`: Display information about the server.
    - `/userinfo [user]`: Display information about a user.

- **Debugging Tools**:
    - `/reload [command]`: Reload a specific command.

### Events

AesthiaBot includes custom event handlers to extend its functionality. Some of the key events are:

- `ready`: Triggered when the bot is ready and connected to Discord.
- `interactionCreate`: Handles interactions such as slash commands.
- `customstatus`: Custom event to set a custom status for the bot.

## Contributing

We welcome contributions to AesthiaBot! If you have an idea for a new feature or have found a bug, please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with a descriptive message.
4. Push your changes to your fork and open a pull request.

## License

AesthiaBot is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

- [Discord.js](https://discord.js.org/) - A powerful library for interacting with the Discord API.
- [mysql2](https://www.npmjs.com/package/mysql2) - A MySQL client for Node.js.

Thank you for using AesthiaBot! If you have any questions or need help, feel free to join our [support server](https://discord.gg/your-invite-link).
