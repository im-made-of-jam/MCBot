module.exports = {isOp}

/*
more of an "is uname in oplist" but same difference
*/
function isOp(opList, uname){
    for(let i = 0; i < opList.length; ++i){
        if(opList[i] === uname){
            return true;
        }
    }

    return false;
}