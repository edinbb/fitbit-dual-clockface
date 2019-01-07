import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize() {
  restoreSettings();
  settingsStorage.addEventListener("change", evt => updateSettings(evt));
}

export function get(key) {
  return JSON.parse(settingsStorage.getItem(key));
}

export function set(key, value) {
  settingsStorage.setItem(key, JSON.stringify(value));
}

export function updateSettings(evt) {
  let key = evt.key;
  if (!key
    || key === "mainClockToggle"
    || key === "secondClockToggle"
    || key === "thirdClockToggle"
    || key === "clocks") return;
  sendValue({ key: key, newValue: JSON.parse(evt.newValue) });
};

function restoreSettings() {
  console.warn("Restoring settings...");
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (!key
      || key === "mainClockToggle"
      || key === "secondClockToggle"
      || key === "thirdClockToggle"
      || key === "clocks") continue;
    sendValue({ key: key, newValue: get(key) });
  }
}

function sendValue(val) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    messaging.peerSocket.send(val);
}