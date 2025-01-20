// Full Hackmud-to-Discord color mapping //  = U+001B
const hackmudToDiscordColors = {
    'reset': '[0;0m', // Reset text formatting
    '0': '[0;30m', // Hackmud: #9B9B9B | Discord: Gray
    '1': '[0;37m', // Hackmud: #FFFFFF | Discord: White
    '2': '[0;32m', // Hackmud: #1EFF00 | Discord: Green
    '3': '[0;34m', // Hackmud: #0070DD | Discord: Blue
    '4': '[0;35m', // Hackmud: #B035EE | Discord: Pink
    '5': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    '6': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    '7': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    '8': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    '9': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    'a': '[0;30m', // Hackmud: #000000 | Discord: Gray
    'b': '[0;30m', // Hackmud: #3F3F3F | Discord: Gray
    'c': '[0;30m', // Hackmud: #676767 | Discord: Gray
    'd': '[0;31m', // Hackmud: #7D0000 | Discord: Red
    'e': '[0;31m', // Hackmud: #8E3434 | Discord: Red
    'f': '[0;33m', // Hackmud: #A34F00 | Discord: Yellow
    'g': '[0;33m', // Hackmud: #725437 | Discord: Yellow
    'h': '[0;33m', // Hackmud: #A88600 | Discord: Yellow
    'i': '[0;33m', // Hackmud: #B2934A | Discord: Yellow
    'j': '[0;32m', // Hackmud: #939500 | Discord: Green
    'k': '[0;32m', // Hackmud: #495225 | Discord: Green
    'l': '[0;32m', // Hackmud: #299400 | Discord: Green
    'm': '[0;30m', // Hackmud: #23381B | Discord: Gray
    'n': '[0;36m', // Hackmud: #00535B | Discord: Cyan
    'o': '[0;36m', // Hackmud: #324A4C | Discord: Cyan
    'p': '[0;34m', // Hackmud: #0073A6 | Discord: Blue
    'q': '[0;34m', // Hackmud: #385A6C | Discord: Blue
    'r': '[0;34m', // Hackmud: #010067 | Discord: Blue
    's': '[0;34m', // Hackmud: #507AA1 | Discord: Blue
    't': '[0;35m', // Hackmud: #601C81 | Discord: Pink
    'u': '[0;30m', // Hackmud: #43314C | Discord: Gray
    'v': '[0;35m', // Hackmud: #8C0069 | Discord: Pink
    'w': '[0;35m', // Hackmud: #973984 | Discord: Pink
    'x': '[0;31m', // Hackmud: #880024 | Discord: Red
    'y': '[0;31m', // Hackmud: #762E4A | Discord: Red
    'z': '[0;30m', // Hackmud: #101215 | Discord: Gray
    'A': '[0;37m', // Hackmud: #FFFFFF | Discord: White
    'B': '[0;37m', // Hackmud: #CACACA | Discord: White
    'C': '[0;30m', // Hackmud: #9B9B9B | Discord: Gray
    'D': '[0;31m', // Hackmud: #FF0000 | Discord: Red
    'E': '[0;31m', // Hackmud: #FF8383 | Discord: Red
    'F': '[0;33m', // Hackmud: #FF8000 | Discord: Yellow
    'G': '[0;33m', // Hackmud: #F3AA6F | Discord: Yellow
    'H': '[0;33m', // Hackmud: #FBC803 | Discord: Yellow
    'I': '[0;33m', // Hackmud: #FFD863 | Discord: Yellow
    'J': '[0;33m', // Hackmud: #FFF404 | Discord: Yellow
    'K': '[0;32m', // Hackmud: #F3F998 | Discord: Green
    'L': '[0;32m', // Hackmud: #1EFF00 | Discord: Green
    'M': '[0;32m', // Hackmud: #B3FF9B | Discord: Green
    'N': '[0;36m', // Hackmud: #00FFFF | Discord: Cyan
    'O': '[0;36m', // Hackmud: #8FE6FF | Discord: Cyan
    'P': '[0;34m', // Hackmud: #0070DD | Discord: Blue
    'Q': '[0;34m', // Hackmud: #A4E3FF | Discord: Blue
    'R': '[0;34m', // Hackmud: #0000FF | Discord: Blue
    'S': '[0;34m', // Hackmud: #7AB2F4 | Discord: Blue
    'T': '[0;35m', // Hackmud: #B035EE | Discord: Pink
    'U': '[0;35m', // Hackmud: #E6C4FF | Discord: Pink
    'V': '[0;35m', // Hackmud: #FF00EC | Discord: Pink
    'W': '[0;35m', // Hackmud: #FF96E0 | Discord: Pink
    'X': '[0;31m', // Hackmud: #FF0070 | Discord: Red
    'Y': '[0;31m', // Hackmud: #FF6A98 | Discord: Red
    'Z': '[0;30m', // Hackmud: #0C112B | Discord: Gray
};

function Formatter(message) {
    function convertHackmudColors(text) {
        // Regex to detect backtick-wrapped strings with a leading color code
        const regex = /`([a-zA-Z0-9])([^`]*)`/g;
        return text.replace(regex, (match, code, content) => {
            // Map the color code to the corresponding Discord color if it exists
            const discordColor = hackmudToDiscordColors[code];
            if (discordColor) {
                return `${discordColor}${content}${hackmudToDiscordColors.reset}`;
            }
            // If no color is found, return the original match
            return match;
        });
    }

    // Extract timestamp and format it
    const timestamp = new Date(message.t * 1000);
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const formattedTime = `[0;30m${hours}${minutes}[0;0m`;

    // Format user, channel, and other elements
    const formattedUser = `[0;33m${message.from_user}[0;0m`;
    const formattedChnlBlue = `[0;34m${message.channel}[0;0m`;
    const formattedChnlPink = `[0;35m${message.channel}[0;0m`;
    const formattedTell = `[0;34mtell[0;0m`;
    const messageBord = `[1;30m:::[0;0m`;

    let formattedMessage = "";

    // Apply color conversion to the message text
    const convertedMessage = convertHackmudColors(message.msg);

    if (message.is_join) {
        formattedMessage = `\`\`\`ansi\n${formattedTime} ${formattedChnlBlue} ${formattedUser} ${messageBord} ${convertedMessage} ${messageBord}\n\`\`\``;
    } else {
        if (!message.channel) {
            formattedMessage = `\`\`\`ansi\n${formattedTime} ${formattedTell} ${formattedUser} ${messageBord} ${convertedMessage} ${messageBord}\n\`\`\``;
        } else {
            formattedMessage = `\`\`\`ansi\n${formattedTime} ${formattedChnlPink} ${formattedUser} ${messageBord} ${convertedMessage} ${messageBord}\n\`\`\``;
        }
    }

    return formattedMessage;
}

// Example messages
const message1 = {
    "id": "3598b8a024e394b691559a8c",
    "t": 1515984655.629,
    "from_user": "sans_comedy",
    "msg": "`pThis is a ``Xlovely``p test message`",
    "channel": "0000"
};
const message2 = {
    "id": "3598b8a024e394b691559a8c",
    "t": 1515984653.345,
    "from_user": "sans_comedy",
    "msg": "user joined channel",
    "is_join": true,
    "channel": "0000"
};
const message3 = {
    "id": "8393b5e73a021ac084090aad",
    "t": 1515984660.132,
    "from_user": "com",
    "msg": "psst, this is a tell"
};

// Test the Formatter
console.log('Formatted Message:\n' + Formatter(message1) + '\n' + Formatter(message2) + '\n' + Formatter(message3));