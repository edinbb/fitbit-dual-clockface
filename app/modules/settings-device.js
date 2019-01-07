import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";

const FILENAME_TYPE = "cbor";
const FILENAME_SETT = "settings1.cbor";
let settings, settingsCallback;

export function initialize(callback) {
  settingsCallback = callback;
  settings = loadSettings();
  settingsCallback(settings);
  me.addEventListener("unload", saveSettings);
  messaging.peerSocket.addEventListener("message", (evt) => {
    let msg = evt.data;
    if (!msg.key) return;
    settings[msg.key] = msg.newValue;
    settingsCallback(settings);
  });
}

function loadSettings() {
  try {
    return fs.readFileSync(FILENAME_SETT, FILENAME_TYPE);
  } catch (e) {
    console.warn("Settings file is not present!");
    return {};
  }
}

function saveSettings() {
  fs.writeFileSync(FILENAME_SETT, settings, FILENAME_TYPE);
}