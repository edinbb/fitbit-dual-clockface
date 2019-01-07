import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { TimeZoneAPI } from "./api";
import * as appSettings from "./modules/settings-companion";
import config from "../resources/appconfig.json";

let api = new TimeZoneAPI(config.token);

settingsStorage.addEventListener("change", evt => {
  if (evt.key !== "clocks") return;
  let clocks = JSON.parse(evt.newValue);
  if (!clocks || clocks.length === 0) {
    appSettings.set("timezones", []);
    appSettings.updateSettings({
      key: "timezones",
      newValue: JSON.stringify([])
    });
  } else {
    let promises = [];
    clocks.forEach(tz => promises.push(api.getOffset(tz.location)));
    Promise.all(promises)
      .then(data => {
        appSettings.set("timezones", data);
        appSettings.updateSettings({
          key: "timezones",
          newValue: JSON.stringify(data)
        });
      })
      .catch(ex => console.error(ex.message));
  }
});

messaging.peerSocket.onopen = () => appSettings.initialize();
