// a function with similar behaviour to python's input()

const fs = require('fs');
function input(msg){
  fs.writeSync(1, String(msg));
  let s = '', buf = Buffer.alloc(1);
  while(buf[0] - 10 && buf[0] - 13)
    s += buf, fs.readSync(0, buf, 0, 1, 0);
  return s.slice(1);
};

/*
git remote add origin https://github.com/im-made-of-jam/MCBot.git

git add -A
git commit -m "*message*"
git push --set-upstream origin main -f
*/