/**
 * @file ThunderTimer Class implementation. ThunderTimer creates a timer that can be managed with methods like ThunderTimer.start(),
 * ThunderTimer.pause(), ThunderTimer.stop(), among others.
 * @author Tomás Castro
 * @version 0.0.1
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
  NOT_STARTED: 'not started',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped',
};

let initialTime;
let endTime;
let currentTime = 0;
let realTime = 0;
let onRestartTime = 0;
let onPauseTime = 0;
let leisureTime = 0;

/**
 * ThunderTimer Class.
 *
 * @extends EventEmitter
 * @class
 * @property {number[]} timeArray=[0, 0, 0, 0, 0] - Array of length 5 representing the current time of a timer.
 * @property {boolean}  isCountDown=false         - Sets if the timer is a countdown.
 * @property {Object}   thunder=null              - Holds the setInterval function.
 * @property {boolean}  isRunning=false           - Represents the running status of a timer.
 * @property {Object}   separator=:               - Sets the type of separator for the prettified time.
 * @property {string}   status=Not started.       - Descriptor of the current status of the timer.
 * @public
 *
 */
class ThunderTimer extends EventEmitter {

  /**
   * ThunderTimer Constructor.
   * @constructor
   * @param {Object}   [options={}]                        - Timer options.
   * @param {number[]} [options.timeArray=[0, 0, 0, 0, 0]] - Array of length 5 representing the current time of a timer.
   * @param {boolean}  [options.isCountDown=false]         - Sets if the timer is a countdown.
   * @param {Object}   [options.separator=:]               - Sets the type of separator for the prettified time.
   */
  constructor(options = {}) {
    super();

    if (options.separator && options.separator === '.') {
      throw new Error('Separator can not be a dot.');
    }

    this.timeArray = options.initialTime || [0, 0, 0, 0, 0];
    this.isCountDown = options.isCountDown || false;
    this.separator = options.separator || ':';
    this.thunder = null;
    this.isRunning = false;
    this.status = STATUS.NOT_STARTED;
  }

  /**
   * Starts a timer.
   * @param {number} [updateTimeInterval=TIME.unitsInMilliseconds.secondTenths] - Interval at which the timer is updated. (in milliseconds)
   */
  start(updateTimeInterval = TIME.unitsInMilliseconds.secondTenths) {
    if (this.status === STATUS.STOPPED) return;
    !this.thunder ? initialTime = Date.now() : noop();
    onPauseTime ? (function() {
      onRestartTime = Date.now();
      leisureTime += (onRestartTime - onPauseTime);
    })() : noop();

    this.thunder = setInterval(this._updateTime.bind(this), updateTimeInterval);
    this._updateStatus(STATUS.RUNNING);
  }

  /**
   * Pauses a timer.
   * @returns {string}
   */
  pause() {
    if (this.status !== STATUS.RUNNING) return;
    onPauseTime = Date.now();
    clearInterval(this.thunder);
    this._updateStatus(STATUS.PAUSED);
    return this.getTime();
  }

  /**
   * Stops a timer.
   */
  stop() {
    if (this.status !== STATUS.RUNNING && this.status !== STATUS.PAUSED) return;
    endTime = Date.now();
    clearInterval(this.thunder);
    this._updateStatus(STATUS.STOPPED);
  }

  /**
   * Returns a representation of the arrayTime of timer.
   * @param {boolean} [pretty=false] - If set to true timer is prettified and returned as String.
   * @returns {string}
   */
  getTime(pretty = false) {
    return pretty ? this._prettify() : this.timeArray.slice().reverse().join(this.separator);
  }

  /**
   * Returns the current status descriptor of timer.
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  static getStatuses() {
    return STATUS;
  }

  /**
   * Sets the value for isRunning of timer.
   * @param {boolean} isRunning - Represents the running state of the timer.
   * @private
   */
  _setIsRunning(isRunning) {
    this.isRunning = isRunning;
  }

  /**
   * Returns the current running status of timer.
   * @returns {boolean}
   * @private
   */
  _getIsRunning() {
    return this.isRunning;
  }

  /**
   * Sets the status of timer.
   * @param {string} status - Status descriptor of timer.
   * @private
   */
  _setStatus(status) {
    this.status = status;
  }

  /**
   * Updates arrayTime.
   * @private
   */
  _updateTime() {
    realTime = Date.now() - initialTime;
    currentTime = realTime - leisureTime;

    this.timeArray[4] = Math.floor(currentTime / TIME.unitsInMilliseconds.days);
    this.timeArray[3] = Math.floor((currentTime % TIME.unitsInMilliseconds.days) / TIME.unitsInMilliseconds.hours);
    this.timeArray[2] = Math.floor((currentTime % TIME.unitsInMilliseconds.hours) / TIME.unitsInMilliseconds.minutes);
    this.timeArray[1] = Math.floor((currentTime % TIME.unitsInMilliseconds.minutes) / TIME.unitsInMilliseconds.seconds);
    this.timeArray[0] = (currentTime % TIME.unitsInMilliseconds.seconds) / TIME.unitsInMilliseconds.secondTenths;
  }

  /**
   * Updates general status of timer.
   * @param {string} status - New status descriptor for timer.
   * @private
   */
  _updateStatus(status) {
    status === STATUS.RUNNING ? this._setIsRunning(true) : this._setIsRunning(false);
    this._setStatus(status);
    this.emit(status, this._getTimerData());
  }

  /**
   * Returns general data of the timer.
   * @returns {Object}
   * @private
   */
  _getTimerData() {
    return {
      initialTime,
      endTime,
    };
  }

  /**
   * Prettifies timer.
   * @returns {string}
   * @private
   */
  _prettify() {
    return this.timeArray[TIME.DAYS_POSITION] + ' ' + TIME.DAYS + ', ' +
            this.timeArray[TIME.HOURS_POSITION] + ' ' + TIME.HOURS + ', ' +
            this.timeArray[TIME.MINUTES_POSITION] + ' ' + TIME.MINUTES + ', ' +
            this.timeArray[TIME.SECONDS_POSITION] + ' ' + TIME.SECONDS;
  }

}

function noop() {}

module.exports = ThunderTimer;