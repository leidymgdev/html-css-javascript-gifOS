class Chronometer {
  /**
   *Creates an instance of Chronometer.
   * @param {HTMLElement} idInputChronometer
   * @memberof Chronometer
   */
  constructor(idInputChronometer) {
    this.idInputChronometer = idInputChronometer;
    this.timeBegan = null;
    this.timeStopped = null;
    this.stoppedDuration = 0;
    this.started = null;
    this.timeElapsed = null;
  }

  start = () => {
    if (this.timeBegan === null) this.timeBegan = new Date();

    if (this.timeStopped !== null) this.stoppedDuration += new Date() - this.timeStopped;

    this.started = setInterval(this.run, 10);
  };

  stop = () => {
    this.timeElapsed = Number(this.timeElapsed);
    this.timeStopped = new Date();
    clearInterval(this.started);
  };

  reset = () => {
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBegan = null;
    this.timeStopped = null;
    this.idInputChronometer.value = '00:00:00.000';
  };

  run = () => {
    let currentTime = new Date();
    this.timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration);

    let hour = this.timeElapsed.getUTCHours();
    hour = hour > 9 ? hour : '0' + hour;

    let min = this.timeElapsed.getUTCMinutes();
    min = min > 9 ? min : '0' + min;

    let sec = this.timeElapsed.getUTCSeconds();
    sec = sec > 9 ? sec : '0' + sec;

    let ms = this.timeElapsed.getUTCMilliseconds();
    ms = ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms;

    this.idInputChronometer.value = hour + ':' + min + ':' + sec + '.' + ms;
  };
}
