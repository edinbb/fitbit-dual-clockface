import document from "document";
import * as appClock from "./modules/clock";
import * as appHRM from "./modules/hrm";
import * as appActivity from "./modules/activity";
import * as appBattery from "./modules/battery";
import * as appSettings from "./modules/settings-device";
import { Switcher } from "./switcher.js";
import { AppStorage } from "./modules/storage";
//import * as appMemory from "./modules/memory";
//appMemory.init();

const clockEls = document.getElementsByClassName("clock");
const stepsFirst = document.getElementById("steps-first");
const calsFirst = document.getElementById("cals-first");
const distFirst = document.getElementById("dist-first");
const floorsFirst = document.getElementById("floors-first");
const amFirst = document.getElementById("am-first");
const stepsSecond = document.getElementById("steps-second");
const calsSecond = document.getElementById("cals-second");
const distSecond = document.getElementById("dist-second");
const floorsSecond = document.getElementById("floors-second");
const amSecond = document.getElementById("am-second");
const hrStat = document.getElementById("hr-stat");
const rhrStat = document.getElementById("rhr-stat");
const battStat = document.getElementById("batt-stat");
const clockTouchArea = document.getElementById("clock-touch-area");
const firstTouchArea = document.getElementById("first-touch-area");
const secondTouchArea = document.getElementById("second-touch-area");
const thirdTouchArea = document.getElementById("third-touch-area");

let storage = new AppStorage();
let clockSwitcher = new Switcher("clockSwitcher", storage, clockEls);
let firstSwitcher = new Switcher("firstSwitcher", storage, [stepsFirst, calsFirst, distFirst, floorsFirst, amFirst]);
let secondSwitcher = new Switcher("secondSwitcher", storage, [stepsSecond, calsSecond, distSecond, floorsSecond, amSecond], 1);
let thirdSwitcher = new Switcher("thirdSwitcher", storage, [hrStat, rhrStat, battStat]);

firstTouchArea.onclick = evt => firstSwitcher.next();
secondTouchArea.onclick = evt => secondSwitcher.next();
thirdTouchArea.onclick = evt => thirdSwitcher.next();
clockTouchArea.onclick = evt => {
  clockSwitcher.next();
  clockSwitcher.tempLock();
}

function clockCallback(data) {
  data.forEach((item, i) => {
    let el = clockEls[i];
    let container = el.getElementById("main");
    let no1 = container.firstChild;
    let no2 = no1.nextSibling;
    let no3 = no2.nextSibling;
    let no4 = no3.nextSibling;
    let day = no4.nextSibling;
    let date = day.nextSibling;
    let ampm = date.nextSibling;
    no1.href = `numbers/i${item.hours.toString().charAt(0)}.png`;
    no2.href = `numbers/i${item.hours.toString().charAt(1)}.png`;
    no3.href = `numbers/i${item.mins.toString().charAt(0)}.png`;
    no4.href = `numbers/i${item.mins.toString().charAt(1)}.png`;
    day.text = item.day;
    date.text = item.date;
    ampm.text = item.ampm || "";
  });
}
appClock.initialize(clockCallback);

function settingsCallback(data) {
  if (data.timezones) {
    appClock.addClocks(data.timezones);
    clockSwitcher.updateElements(clockEls.slice(0, data.timezones.length + 1));
  } else {
    appClock.addClocks([]);
    clockSwitcher.updateElements(clockEls.slice(0, 1));
  }

  if (data.lockFirst) {
    firstSwitcher.lock();
  } else {
    firstSwitcher.unlock();
  }

  if (data.lockSecond) {
    secondSwitcher.lock();
  } else {
    secondSwitcher.unlock();
  }

  if (data.lockThird) {
    thirdSwitcher.lock();
  } else {
    thirdSwitcher.unlock();
  }

  if (data.clockColor) setColor(data.clockColor, clockEls[0]);
  if (data.secClockColor) setColor(data.secClockColor, clockEls[1]);
  if (data.thirdClockColor) setColor(data.thirdClockColor, clockEls[2]);
}
appSettings.initialize(settingsCallback);

function hrmCallback(data) {
  hrStat.firstChild.firstChild.text = data.bpm || "--";
  rhrStat.firstChild.firstChild.text = data.restingHeartRate || "--";
}
appHRM.initialize(hrmCallback);

function battCallback(data) {
  battStat.firstChild.firstChild.text = data || "--";
}
appBattery.initialize(battCallback);

function activityCallback(data) {
  stepsFirst.firstChild.firstChild.text = data.steps.pretty;
  calsFirst.firstChild.firstChild.text = data.calories.pretty;
  distFirst.firstChild.firstChild.text = data.distance.pretty;
  floorsFirst.firstChild.firstChild.text = data.elevationGain.pretty;
  amFirst.firstChild.firstChild.text = data.activeMinutes.pretty;
  stepsSecond.firstChild.firstChild.text = data.steps.pretty;
  calsSecond.firstChild.firstChild.text = data.calories.pretty;
  distSecond.firstChild.firstChild.text = data.distance.pretty;
  floorsSecond.firstChild.firstChild.text = data.elevationGain.pretty;
  amSecond.firstChild.firstChild.text = data.activeMinutes.pretty;
}
appActivity.initialize(activityCallback);

function setColor(color, el) {
  let container = el.getElementById("main");
  let no1 = container.firstChild;
  let no2 = no1.nextSibling;
  let no3 = no2.nextSibling;
  let no4 = no3.nextSibling;
  let day = no4.nextSibling;
  let date = day.nextSibling;
  let ampm = date.nextSibling;
  no1.style.fill = color;
  no2.style.fill = color;
  no3.style.fill = color;
  no4.style.fill = color;
  day.style.fill = color;
  date.style.fill = color;
  ampm.style.fill = color;
}