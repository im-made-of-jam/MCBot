module.exports = {logString}

/*
unifies the bot sending chat messages and console messages into one function
also allows for chat logging to be disabled from the top of the file
*/
function logString(bot, gameChatLogging, message, consolePreamble){
    if(gameChatLogging){
        bot.chat(message);
    }

    if(consolePreamble === undefined){
        consolePreamble = "";
    }

    console.log(consolePreamble + message);
}