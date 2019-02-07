import config from "../resources/appconfig.json";

function mySettings(props) {

  function search(value) {
    let ret = [];

    if (!value || value === "") return ret;

    let encoded = encodeURIComponent(value);
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${config.token}`;

    return fetch(url).then((resp) => {
      if (!resp.ok) throw ("Response is not 200!");
      return resp.json();
    }).then((res) => {
      if (res.status === "ZERO_RESULTS") return ret;
      if (res.status !== "OK") throw (res.status);

      let results = res.results || [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        ret.push({
          name: result.formatted_address,
          location: result.geometry.location
        });
      }

      return ret;
    }).catch((err) => {
      console.error(err);
    });
  }

  return (
    <Page>
      <Section
        description={<Text align="left">Please note that additional clocks will not adjust for DST automatically.
        You have to remove and add clock again to adjust it for DST.</Text>}
        title={<Text bold align="left">Additional Clocks</Text>}>
        <AdditiveList
          title="Selected clocks"
          settingsKey="clocks"
          maxItems="2"
          addAction={
            <TextInput
              title="Add clock"
              label="Add clock for different time zone"
              placeholder="Enter address"
              onAutocomplete={(value) => search(value)}
            />
          }
        />
      </Section>
      <Section
        title={<Text bold align="left">Colors</Text>}>
        {renderColorToggle('mainClockToggle', 'Main Clock')}
        {renderColorPicker(props, 'mainClockToggle', 'clockColor')}
        {renderColorToggle('secondClockToggle', 'Second Clock')}
        {renderColorPicker(props, 'secondClockToggle', 'secClockColor')}
        {renderColorToggle('thirdClockToggle', 'Third Clock')}
        {renderColorPicker(props, 'thirdClockToggle', 'thirdClockColor')}
      </Section>
      <Section
        title={<Text bold align="left">Stats Lock</Text>}
        description={<Text align="left">Version: 2.8.0</Text>}>
        <Toggle
          settingsKey="lockFirst"
          label="Top"
        />
        <Toggle
          settingsKey="lockSecond"
          label="Middle"
        />
        <Toggle
          settingsKey="lockThird"
          label="Bottom"
        />
      </Section>
    </Page>
  );
}

function renderColorToggle(toggleName, label) {
  return (<Toggle
    settingsKey={toggleName}
    label={label}
  />);
}

function renderColorPicker(props, toggleName, settingName) {
  if (JSON.parse(props.settings[toggleName] || 'false')) {
    return (
      <ColorSelect
        settingsKey={settingName}
        colors={[
          { color: "#FFFFFF" },
          { color: "#CCCCCC" },
          { color: "#999999" },
          { color: "#666666" },
          { color: "#333333" },
          { color: "#000000" },

          { color: "#FFCCCC" },
          { color: "#FF7F7F" },
          { color: "#FF4C4C" },
          { color: "#FF0000" },
          { color: "#CC0000" },
          { color: "#990000" },
          { color: "#660000" },

          { color: "#FF7700" },
          { color: "#FFAB00" },
          { color: "#FFCC00" },
          { color: "#FFFF00" },
          { color: "#E5E533" },
          { color: "#CCCC19" },
          { color: "#999919" },

          { color: "#B2FFB2" },
          { color: "#66FF66" },
          { color: "#33FF33" },
          { color: "#00FF00" },
          { color: "#00B200" },
          { color: "#339933" },
          { color: "#196619" },

          { color: "#00FF9C" },
          { color: "#00FFB9" },
          { color: "#00FFC8" },
          { color: "#00FFFF" },
          { color: "#00EEFF" },
          { color: "#00CDFF" },
          { color: "#00B6FF" },

          { color: "#B2B2FF" },
          { color: "#9999FF" },
          { color: "#4C4CFF" },
          { color: "#0000FF" },
          { color: "#0000B2" },
          { color: "#0000AA" },
          { color: "#004C99" },

          { color: "#9600FF" },
          { color: "#BE00FF" },
          { color: "#D300FF" },
          { color: "#FF00FF" },
          { color: "#FF00CB" },
          { color: "#FF009E" },
          { color: "#FF006A" }
        ]}
      />);
  }
}


registerSettingsPage(mySettings);
