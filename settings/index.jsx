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
        title={<Text bold align="left">Stats Lock</Text>}>
        <Toggle
          settingsKey="lockFirst"
          label="First"
        />
        <Toggle
          settingsKey="lockSecond"
          label="Second"
        />
        <Toggle
          settingsKey="lockThird"
          label="Third"
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
          { color: '#32CD32' },
          { color: '#FFA500' },
          { color: '#4682B4' },
          { color: '#D828B8' },
          { color: '#F83C40' }
        ]}
      />);
  }
}


registerSettingsPage(mySettings);
