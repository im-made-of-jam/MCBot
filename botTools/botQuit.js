const isOp = require("./isOp").isOp;

module.exports={botQuit}

/*
makes the bot exit
*/
function botQuit(bot, username, opList){
    console.log("Chat Request >> User " + username + " requested disconnect");

    if(isOp(opList, username)){
        console.log("Chat Request >> disconnecting");
        bot.quit();
    }
    else{
        console.log("Chat Request >> user is not op, ignored");
    }

}
