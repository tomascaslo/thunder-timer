var ThunderTimer = require('./dist/all');

var timer = new ThunderTimer();
timer.start();

var interval = setInterval(function() {
  console.log(timer.getTime());
}, 500);

setTimeout(function() {
  clearInterval(interval);
}, 120000);