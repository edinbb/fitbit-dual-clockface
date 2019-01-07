import { memory } from "system";
import { display } from "display";

let watchID;

export function init() {
  display.addEventListener("change", () => {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
  
  start();
}

function start() {
 if (!watchID) {
    getReading();
    watchID = setInterval(getReading, 10000);
  } 
}

function stop() {
  if (watchID) {
    clearInterval(watchID);
    watchID = null;
  }  
}

function getReading() {
  console.log("JS memory: " + memory.js.used + "/" + memory.js.peak + "/" + memory.js.total);
  console.log("Native memory: " + memory.native.used + "/" + memory.native.peak + "/" + memory.native.total);
  console.log("Memory pressure: " + memory.monitor.pressure);  
}