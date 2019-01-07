import { battery } from "power";
import { display } from "display";

let watchID, battCallback;

export function initialize(callback) {
  battCallback = callback;
  getReading();

  display.addEventListener("change", () => {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function getReading() {
 let level = `${Math.floor(battery.chargeLevel)}%`;
 if (battCallback) battCallback(level);
}

function start() {
  if (!watchID) {
    getReading();
    watchID = setInterval(getReading, 5000);
  }
}

function stop() {
  clearInterval(watchID);
  watchID = null;
}
