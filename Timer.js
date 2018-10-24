class Timer {
  constructor() {
    this.timeLeft;
    this.intervalId = 0;
    this.timeDisplay = "00";
  }

  start(time) {
    this.timeLeft = time;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this.setTime();
    }, 1000);
  }

  twoDigitsNumber(num) {
    var numString = num.toString();
    if (numString.length == 1) return ("0" + numString);
    else return numString;
  }

  setTime() {
    this.timeDisplay = this.twoDigitsNumber(this.timeLeft);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}