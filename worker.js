var pictureTube = require('picture-tube');
var argv = require('optimist').argv;

var tube = pictureTube(argv);
tube.pipe(process.stdout);
process.stdin.pipe(tube);

process.stdin.resume();
