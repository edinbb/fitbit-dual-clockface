import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

let watchID;
let hrm, heartRate, hrmCallback;
let lastReading = null;

export function initialize(callback) {
  hrmCallback = callback;
  hrm = new HeartRateSensor();
  start();
  display.addEventListener("change", () => {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function getReading() {
  if (hrm.timestamp === lastReading) {
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
  }
  lastReading = hrm.timestamp;
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
    restingHeartRate: user.restingHeartRate
  });
}

function start() {
  if (!watchID) {
    if (hrm) hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  if (hrm) hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
