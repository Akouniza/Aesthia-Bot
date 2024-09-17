// events/interactionCreate.js

// Export a module that handles interactions (slash commands, buttons, etc.)
module.exports = {
    // Define the name of this event handler
    name: 'interactionCreate',

    // Execute function to run when an interaction occurs
    execute(interaction, client) {
        // Check if the interaction is a slash command
        if (!interaction.isCommand()) return;

        // Get the command associated with the interaction by its name
        const command = client.commands.get(interaction.commandName);

        // If the command is not found, return and do nothing
        if (!command) return;

        try {
            // Execute the command by passing the interaction and client objects
            command.execute(interaction, client);
        } catch (error) {
            // If an error occurs during command execution, log the error
            console.error(error);

            // Reply to the user with an error message (ephemeral means it's only visible to the user)
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
