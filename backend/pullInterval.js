let chatPullInterval = null;

module.exports = {
    getChatPullInterval: () => chatPullInterval,
    setChatPullInterval: (interval) => {
        chatPullInterval = interval;
    },
    clearChatPullInterval: () => {
        if (chatPullInterval) {
            clearInterval(chatPullInterval);
            chatPullInterval = null;
        }
    },
};