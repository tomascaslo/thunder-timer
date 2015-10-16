var colors = require('colors');

var ThunderTimer = require('./dist/thundertimer');

var NUMBER_OF_TIMERS = 8000;
var TIME_FOR_RESULT = 6000; // In milliseconds
var LOGGER_INTERVAL = 100; // In milliseconds

var timer;

var timers = [];

var sumMemoryUsage = 0;
var totalCount = 0;
var memoryUsed;
var memoryTotal;

var logger = setInterval(function() {

  memoryUsed = process.memoryUsage().heapUsed/Math.pow(1024, 2);
  memoryTotal = process.memoryUsage().heapTotal/Math.pow(1024, 2);

  sumMemoryUsage += memoryUsed;
  totalCount += 1;

  console.log('Memory used: ' + colors.red(memoryUsed) + ' of ' +  colors.green(memoryTotal));
  console.log('Total timers running: ' + colors.blue(timers.length));

}, LOGGER_INTERVAL);

for (var i = 0; i < NUMBER_OF_TIMERS; i++) {
  timer = new ThunderTimer();
  timer.start();
  timers.push(timer);
}

setTimeout(function() {

  console.log('\n\n\n********************************************************************************\n');
  console.log('Average memory used for ' + colors.blue(NUMBER_OF_TIMERS) +
              ' timers was ' + colors.green(sumMemoryUsage/totalCount));
  console.log('\n********************************************************************************\n\n\n');

  clearInterval(logger);

  for (var i = 0; i < NUMBER_OF_TIMERS; i++) {
    timers[i].stop();
  }

  process.exit();

}, TIME_FOR_RESULT);