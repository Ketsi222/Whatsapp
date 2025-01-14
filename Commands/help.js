const axios = require('axios');
const fs = require('fs');
const path = require('path');

const commandDir = path.join(__dirname, '../Commands'); // Adjust path accordingly

module.exports = {
    usage: ['help'],
    desc: 'List all available commands.',
    commandType: 'General',
    isGroupOnly: false,

    async execute(sock, message) {
        const groupId = message.key.remoteJid; // Get the group ID

        // Load command files from the commands directory
        const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
        const commands = {};

        // Organize commands by type
        for (const file of commandFiles) {
            const command = require(path.join(commandDir, file));
            if (!commands[command.commandType]) {
                commands[command.commandType] = [];
            }
            commands[command.commandType].push(command);
        }

        // Construct the help message
        let helpMessage = '📜 **Available Commands** 📜\n\n';

        // Define emojis for each command type
        const emojis = {
            'General': '🌐',
            'Moderation': '🔧',
            'Fun': '🎉',
            'Utility': '🛠️',
            'Music': '🎵',
            'AI': '🤖',
            'Game': '🎮',
            'Image Editing': '🖼️',
            'Logo Generation': '🎨',
            'Reaction': '💖',
            'Search': '🔍',
            'Download': '📥',
            'Research': '🔎',
            'Heroku': '☁️',
            'Conversion': '🔄',
            'User Interaction': '💬',
            'Group Management': '👥',
        };

        // Build the help message with a line separator for each command type
        for (const [type, cmds] of Object.entries(commands)) {
            const emoji = emojis[type] || '📋'; // Fallback emoji
            helpMessage += `═══════════════════════════════════\n`;
            helpMessage += `**${emoji} ${type} Commands**\n`;
            helpMessage += `═══════════════════════════════════\n`;
            cmds.forEach(cmd => {
                const usage = cmd.usage && Array.isArray(cmd.usage) ? cmd.usage.join(', ') : 'No usage available';
                helpMessage += `• *${usage}*\n`; // Removed cmd.desc
            });
            helpMessage += `\n`;
        }

        helpMessage += `═══════════════════════════════════\n`;
        helpMessage += `©️ Nexus Inc.\n`;

        try {
            // URL to the image you want to send
            const imageUrl = 'https://i.ibb.co/qmdqMZN/file-397.jpg';

            // Send the help message with an image and context info
            await sock.sendMessage(groupId, {
                image: { url: imageUrl },
                caption: helpMessage,
                contextInfo: {
                    externalAdReply: {
                        title: "Nexus Bank",
                        body: "Join our WhatsApp Channel for updates and more!",
                        mediaType: 1,
                        mediaUrl: "https://whatsapp.com/channel/0029VacWsSl3LdQOmWZrBj0l",
                        sourceUrl: "https://whatsapp.com/channel/0029VacWsSl3LdQOmWZrBj0l",
                    },
                },
            });
        } catch (error) {
            console.error('Error sending help image:', error);
            await sock.sendMessage(groupId, { text: helpMessage });
        }
    }
};
