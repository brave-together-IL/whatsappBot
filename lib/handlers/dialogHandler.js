// <chatId>: <trivia instance>
const dialogMap = new Map();



/**
 * Redirects message calls to the right dialog.
 *
 * @param {Message} message
 * @return {Promise<void>}
 */
const forwardToDialog = async (message) => {
    const dialog = dialogMap.get(message.getChatId());
    if (dialog) {
        await dialog.procMessage(message);
    }
};

module.exports.forwardToDialog = forwardToDialog;
module.exports.dialogMap = dialogMap;
