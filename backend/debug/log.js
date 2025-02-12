const dbgenv = process.env.DEBUG;

async function log() {
    if (dbgenv === 'true') {
        for (let i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log("---- END ----")
        return true
    }
    return false
}

module.exports = {
    log
};