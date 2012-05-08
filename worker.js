var pictureTube = require('picture-tube');
var argv = require('optimist').argv;

var tube = pictureTube(argv);
process.stdin.pipe(tube);
tube.pipe(process.stdout);

process.stdin.resume();
