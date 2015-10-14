/**
 * Created by tomascaslo on 10/13/15.
 */
import EventEmitter from 'events';

const TIME = {
  SECOND_TENTHS_PER_SECOND: 10,
  SECONDS_PER_MINUTE: 60,
  SECOND_TENTHS_PER_MINUTE: 600,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_HOUR: 3600,
  SECOND_TENTHS_PER_HOUR: 36000,
  HOURS_PER_DAY: 24,

  SECOND_TENTHS_POSITION: 0,
  SECONDS_POSITION: 1,
  MINUTES_POSITION: 2,
  HOURS_POSITION: 3,
  DAYS_POSITION: 4,

  SECOND_TENTHS: 'secondTenths',
  SECONDS: 'seconds',
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',

  unitsInMilliseconds: {
    secondTenths: 100,
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000,
  },

};

const STATUS = {
  NOT_STARTED: 'Not started',
  RUNNING: 'Running',
  PAUSED: 'Paused',
  STOPPED: 'Stopped',
};

let initialTime, endTime, currentTime;


class ThunderTimer extends EventEmitter {

  constructor(options = new Object()) {
    super();

    if (options.separator && options.separator === '.') {
      throw new Error('Separator can not be a dot.');
    }

    this.timeArray = options.initialTime || [0, 0, 0, 0, 0];
    this.isCountDown = options.isCountDown || false;
    this.thunder = null;
    this.isRunning = false;
    this.separator = options.separator || ':';
    this.status = 'Not started.';
  }

  start(updateTimeInterval = TIME.unitsInMilliseconds.secondTenths) {
    if (!this.thunder) {
      this._setIsRunning(true);
      this._setStatus(STATUS.RUNNING);
      initialTime = Date.now();

      this.thunder = setInterval(this._updateTime.bind(this), updateTimeInterval);
    }
  }

  pause() {
    this._setIsRunning(false);
    this._setStatus(STATUS.PAUSED);

    return this.timeArray;
  }

  stop() {
    this._setIsRunning(false);
    this._setStatus(STATUS.STOPPED);
    clearInterval(this.thunder);

    return this.timeArray;
  }

  getTime(pretty = false) {
    return pretty ? this._prettify() : this.timeArray.reverse().join(this.separator);
  }

  getStatus(status) {
    return this.status;
  }

  _setIsRunning(isRunning) {
    this.isRunning = isRunning;
  }

  _setStatus(status) {
    this.status = status;
  }

  _updateTime() {
    currentTime = Date.now() - initialTime;

    this.timeArray[4] = Math.floor(currentTime / TIME.unitsInMilliseconds.days);
    this.timeArray[3] = Math.floor((currentTime % TIME.unitsInMilliseconds.days) / TIME.unitsInMilliseconds.hours);
    this.timeArray[2] = Math.floor((currentTime % TIME.unitsInMilliseconds.hours) / TIME.unitsInMilliseconds.minutes);
    this.timeArray[1] = Math.floor((currentTime % TIME.unitsInMilliseconds.minutes) / TIME.unitsInMilliseconds.seconds);
    this.timeArray[0] = (currentTime % TIME.unitsInMilliseconds.seconds) / TIME.unitsInMilliseconds.secondTenths;
  }

  _prettify() {
    return this.timeArray[TIME.SECONDS_POSITION] + ' ' + TIME.SECONDS + ', ' +
            this.timeArray[TIME.MINUTES_POSITION] + ' ' + TIME.MINUTES + ', ' +
            this.timeArray[TIME.HOURS_POSITION] + ' ' + TIME.HOURS + ', ' +
            this.timeArray[TIME.DAYS_POSITION] + ' ' + TIME.DAYS;
  }

}

module.exports = ThunderTimer;