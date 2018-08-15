const {createReadStream} = require("fs");
const crypto = require('crypto');
const sumchecker = require('sumchecker');

const fullPath = "/var/folders/40/3fbxy4911tl099l430t844pr0000gn/T/tmp-20002j6VeNqHPoIbW/OpenJDK10_x64_Mac_201807101745.tar.gz";


new sumchecker.ChecksumValidator("sha256", "tot", {defaultTextEncoding: null});

// expected : a4d9ce9d19961d95f4def0a9d1c7fd5cbd3c83a9d6f7f3c1b37f618bf1cf58c0
// let stream = createReadStream(fullPath, {encoding: 'binary'});
// let hasher = crypto.createHash("sha256", {defaultEncoding: 'binary'});

let stream = createReadStream(fullPath, {encoding: null});
let hasher = crypto.createHash("sha256", {defaultEncoding: 'binary'});


hasher.on('readable', () => {
    let data = hasher.read();
    if (data) {
        // let calculated = data.toString('hex');
        let calculated = data.toString('hex');

        console.log(`Actual: ${calculated}`)

    }
});
stream.pipe(hasher);