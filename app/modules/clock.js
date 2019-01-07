import clock from "clock";
import { preferences } from "user-settings";
import { days } from "./locales/en.js";
import * as util from "./utils";

let clockCallback, lastTick, extraClocks;

export function initialize(callback) {
  clockCallback = callback;
  extraClocks = [];
  clock.granularity = "minutes";
  clock.addEventListener("tick", tickHandler);
}

export function addClocks(clocks) {
  extraClocks = clocks;
  if (lastTick) tickHandler({ date: lastTick });
}

function tickHandler(evt) {
  lastTick = evt.date;
  let data = [getCallbackData(evt.date)];
  extraClocks.forEach(timezone => {
    let localtime = getLocalTime(timezone, evt.date);
    data.push(getCallbackData(localtime));
  });
  clockCallback(data);
}

function getCallbackData(date) {
  if (!date) return;
  let hours = date.getHours();
  let mins = date.getMinutes();
  let day = days[date.getDay()];
  let date = util.zeroPad(date.getDate());
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = preferences.clockDisplay === "12h" ? util.zeroPad(hours % 12 || 12) : util.zeroPad(hours);
  ampm = preferences.clockDisplay === "12h" ? ampm : undefined;
  let o = {
    hours: hours,
    mins: util.zeroPad(mins),
    ampm: ampm,
    day: day,
    date: date
  };
  return o;
}

function getLocalTime(timezone, date) {
  try {
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (timezone.dstOffset + timezone.rawOffset) * 1000);
  } catch (ex) {
    console.warn(ex.message);
    return date;
  }
}