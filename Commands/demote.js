const User = require('../models/User');

module.exports = {
    usage: ["demote"],
    desc: "Demote a user from admin. (Admin only)",
    commandType: "Moderation",
    emoji: '📉',

    async execute(sock, msg, args) {
        try {
            const groupId = msg.key.remoteJid; // Get the group ID
            const senderId = msg.key.participant || msg.key.remoteJid; // Get the sender ID

            // Check if the message contains mentions
            const mentionedJids = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentionedJids.length === 0) {
                return await sock.sendMessage(groupId, { text: "❌ Please mention a user to demote." });
            }

            // Fetch the group metadata
            let groupMetadata;
            try {
                groupMetadata = await sock.groupMetadata(groupId);
            } catch (error) {
                console.error("Error fetching group metadata:", error);
                return await sock.sendMessage(groupId, { text: "❌ Unable to fetch group metadata." });
            }

            // Ensure participants exist
            const participants = groupMetadata.participants || [];
            if (!participants || participants.length === 0) {
                return await sock.sendMessage(groupId, { text: "❌ No participants found in the group." });
            }

            // Check if the sender is an admin
            const isAdmin = participants.some(participant => 
                participant.id === senderId && (participant.admin === 'admin' || participant.admin === 'superadmin')
            );

            if (!isAdmin) {
                return await sock.sendMessage(groupId, { text: "❌ You don't have permission to use this command." });
            }

            const targetUserId = mentionedJids[0]; // Get the first mentioned user

            // Demote the user from admin
            await sock.groupParticipantsUpdate(groupId, [targetUserId], "demote");

            await sock.sendMessage(groupId, { text: `✅ User @${targetUserId.replace('@s.whatsapp.net', '')} has been demoted from admin.`, mentions: [targetUserId] });

        } catch (error) {
            console.error("Demote command error:", error);
            await sock.sendMessage(msg.key.remoteJid, { text: "❌ An error occurred while trying to demote the user: " + error.message });
        }
    }
};
