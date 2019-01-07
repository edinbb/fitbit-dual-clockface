import { display } from "display";
import { today } from "user-activity";
import { units } from "user-settings";

let watchID, timeout;
let activityCallback;

export function initialize(callback) {
  activityCallback = callback;
  timeout = 2000;
  
  display.addEventListener("change", () => {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
  
  start();
}

function getReading() {  
  let activityData = {
    steps: getSteps(),
    calories: getCalories(),
    distance: getDistance(),
    elevationGain: getElevationGain(),
    activeMinutes: getActiveMinutes()
  };
  
  activityCallback(activityData);
}

function getActiveMinutes() {
  let val = (today.adjusted.activeMinutes || 0);
  
  return {
    raw: val,
    pretty: val
  };
}

function getCalories() {
  let val = (today.adjusted.calories || 0);
  
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + "," + ("00"+(val%1000)).slice(-3) : val
  };
}

function getDistance() {
  let val = (today.adjusted.distance || 0) / 1000;
  
  if (units.distance === "us") {
    val *= 0.621371;
  }
  
  return {
    raw: val,
    pretty: `${val.toFixed(2)}`
  };
}

function getElevationGain() {
  let val = today.adjusted.elevationGain || 0;
  
  return {
    raw: val,
    pretty: val
  };
}

function getSteps() {
  let val = (today.adjusted.steps || 0);
  
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + "," + ("00"+(val%1000)).slice(-3) : val
  };
}

function start() {
  if (!watchID) {
    getReading();
    watchID = setInterval(getReading, timeout);
  }
}

function stop() {
  clearInterval(watchID);
  watchID = null;
}
