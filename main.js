const botLogString = require("./botTools/logString.js").logString;
const isOp = require("./botTools/isOp").isOp;
const followTick = require("./botTools/followTick.js").followTick;
const mineflayer = require("mineflayer"); // 4.20.1
const { botQuit } = require("./botTools/botQuit.js");

botOptions = {
    // localhost by default, use -host=xxxx to specify
    host: "localhost",
    //25565 by default, localhost says otherwise, use -port=xxxxx to specify
    port: 25565,
    username: "botBOTbot",

    // neccessary for actual servers. LAN or cracked servers dont care about proper auth and will work without,
    // but real servers require a microsoft account as of not too long ago

    //auth: "microsoft",
    //password: "accountPassword"
};

let gameChatLogsEnabled = false; // whether or ot bot output is sent to game chat

let chatLoggingEnabled = true;   // whether or not game chat is logged to the console
let versionString = "0.0";       // string the bot outputs when its version is queried
let operators = [                // list of usernames that have operator permissions
    "JamNChips"
];
let tickCounter = 0;             // counts up by one for every physics tick the bot gets
let botIsFollowing = false;      // the bot is folowing someone
let botFollowTarget = "";        // the username of the player that the bot is attempting to follow
let botRespawnTimer = 3000;      // time in milliseconds between the bot dying and it attempting to respawn



function processLaunchOptions(argv){
    for(let i = 0; i < argv.length; ++i){
        let currentArg = argv[i];
        console.log("Launch options >> \"" + currentArg + "\"");

        if(currentArg === "-noChatLogs"){
            chatLoggingEnabled = false;
            console.log("Chat logging disabled");
            continue;
        }

        if(currentArg.slice(0, 6) === "-port="){
            let specifiedPortString = currentArg.slice(6, currentArg.length);

            botOptions.port = parseInt(specifiedPortString);

            if(botOptions.port === NaN || botOptions > 65535){
                console.log("Invalid Port specified: " + specifiedPortString);
                console.log("Defaulting to 25565");
                botOptions.port = 25565; // default minecraft port
            }
            else{
                console.log("Port Specified as " + botOptions.port);
            }
            continue;
        }

        if(currentArg.slice(0, 6) === "-host="){
            let specifiedHostString = currentArg.slice(6, currentArg.length);
            if(specifiedHostString === "" || specifiedHostString === undefined){
                console.log("Host cannot be set to nothing");
                console.log("defaulting to localhost");
            }
            else{
                console.log("setting host to " + specifiedHostString);
            }
            botOptions.host = specifiedHostString;
            continue;
        }

        if(currentArg === "-useMSAuth"){
            botOptions.auth = "microsoft";
            console.log("Bot will use Microsoft Authentication");
            console.log("Username and password will need to be provided");
            continue;
        }

        if(currentArg === "-logToGameChat"){
            gameChatLogsEnabled = true;
            // this is considered quite dangerous as it immediately lets everyone know of the bot's existence
            console.log("----------------------------------");
            console.log("WARNING: BOT WILL OUTPUT TO GAME CHAT");
            console.log("----------------------------------");
            continue;
        }
    }
}


function onTick(){
    tickCounter++;

    if(botIsFollowing){
        if(botFollowTarget === ""){
            botIsFollowing = false;
            console.log("Follow Tick >> Bot was supposed to be following someone, but there was no follow target!");
            console.log("botIsFollowing is now false, this should now have stopped");
        }
        else if((tickCounter % 5) == 0){
            followTick(bot, botFollowTarget);
        }
    }
}


function onChat(username, message, translate, jsonMsg, matches){
    let str = "";

    if(username === bot.username){
        return;
    }

    if(chatLoggingEnabled){
        console.log("Chat >> <" + username + "> " + message);
    }

    if(message === "-/bb_quit"){
        botQuit(bot, username, operators);
        return;
    }

    if(message === "-/bb_version"){
        str = "version: " + versionString;
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        return;
    }

    if(message === "-/bb_follow_me"){
        str = "Player " + username + " requested follow";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "Following " + username;
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
            botFollowTarget = username;
            botIsFollowing = true;
        }
        else{
            str = "user is not op. request ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }

        return;
    }

    if(message === "-/bb_follow_end"){
        str = "Player " + username + " requested unfollow";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "No longer following " + botFollowTarget;
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
            botFollowTarget = "";
            botIsFollowing = false;
        }
        else{
            str = "user is not op, ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }

        return;
    }

    if(message === "-/bb_follow_pause"){
        str = "Player " + username + " requested follow pause";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "Paused following of " + botFollowTarget;
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
            botIsFollowing = false;
        }
        else{
            str = "user is not op, ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }

        return;
    }

    if(message === "-/bb_follow_resume"){
        str = "Player " + username + " requested follow resume";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "Resumed following of " + botFollowTarget;
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
            botIsFollowing = true;
        }
        else{
            str = "user is not op, ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }

        return;
    }

    if(message === "-/bb_follow_target"){
        str = "Player " + username + " requested follow target";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "Current follow target is " + botFollowTarget;
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

            str = "Following is currently ";

            if(botIsFollowing){
                str += "un";
            }
            str += "paused";

            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }
        else{
            str = "user is not op, ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }
        return;
    }

    if(message === "-/bb_kill"){
        str = "player " + username + " requested that the bot kills itself";
        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");

        if(isOp(operators, username)){
            str = "bot will now attempt to kill itself";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
            bot.chat("/kill");
        }
        else{
            str = "user is not op, ignored";
            botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        }
        return;
    }

    if(message === "-/bb_coords"){
        coordStringX = "X: " + bot.entity.position.x;
        coordStringY = "Y: " + bot.entity.position.y;
        coordStringZ = "Z: " + bot.entity.position.z;

        str = coordStringX + "\n" + coordStringY + "\n" + coordStringZ;

        botLogString(bot, gameChatLogsEnabled, str, "Chat Request >> ");
        return;
    }
}


function onDeath(){
    function _respawn(){
        console.log("Respawn >> attempting respawn");
        bot.respawn();
    }

    setTimeout(_respawn, botRespawnTimer);

    if(botIsFollowing){
        console.log("Death Handler >> Resetting follow target");
        botFollowTarget = "";
        botIsFollowing = false;
    }
}


function onSpawn(){
    console.log("On Spawn >> current x, y, z = " + bot.entity.position.x + ", " + bot.entity.position.y + ", " + bot.entity.position.z);
}








// definitions are complete, now onto actual codey stuff

processLaunchOptions(process.argv);

const bot = mineflayer.createBot(botOptions);
bot.on("physicTick", onTick);
bot.on("chat", onChat);
bot.on("death", onDeath);
bot.on("spawn", onSpawn);
