const Vec3 = require ("vec3");

module.exports={followTick}

/*
one tick of the player follpowing function
*/
function followTick(bot, target){
    // this retarded language has "for(i in array){}"" give i the index rather than the object at the index because fuck logic. at least it isnt much typing i guess
    for(i in bot.entities){
        entity = bot.entities[i];

        if(entity.type === undefined){
            console.log("Follow Tick >> Entity with undefined type!");
            continue;
        }

        if(entity.type !== "player"){
            continue;
        }

        if(entity.username !== target){
            continue;
        }

        // we now know that the current entity is both a player, and has the correct username
        // as such we may now assume quite a lot to exist and not be undefined

        let lookHere = Vec3(entity.position)
        lookHere.add(Vec3(0, 1.6, 0)); // minecraft character has an eye level 1.6 blocks above the feet
        bot.lookAt(lookHere);

        deltaX = entity.position.x - bot.entity.position.x;
        deltaY = entity.position.y - bot.entity.position.y;
        deltaZ = entity.position.z - bot.entity.position.z;

        deltaPos = Vec3(deltaX, deltaY, deltaZ);

        magDeltaPos = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ));

        // no point in following once were already up in the face of the follow target
        if(magDeltaPos > 2){
            bot.setControlState("forward", true);
        }
        else{
            bot.setControlState("forward", false);
        }

        // but if we are too far away then wed better hurry up and get close again
        if(magDeltaPos > 10){
            bot.setControlState("sprint", true);
            bot.setControlState("jump", true);
        }
        else{
            bot.setControlState("sprint", false);
            bot.setControlState("jump", false);

            if(bot.getControlState("sprint")){
                bot.setControlState("forward", false);
                bot.setControlState("forward", true);
            }
        }
    }
}