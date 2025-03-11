const fs = require('fs');

fs.readFile('fich1.txt','utf8', (err, data) =>{
    console.log("A");
});
console.log("B");
const data1 = fs.readFileSync('fich2.txt','utf8',);
console.log("C");
