export class TimeZoneAPI {
  constructor(token) {
    this.baseUrl = "https://maps.googleapis.com/maps/api/timezone/json?";
    this.token = token;
  }

  async getOffset(loc) {
    let json = await this.fetch("location=lat,lng", loc);
    return json;
  }

  async fetch(endUrl, params) {
    let retries = 5; //fetch() retry counter
    let url = this.baseUrl + endUrl;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        url = url.replace(key, params[key]);
      }
    }

    url = `${url}&timestamp=${Math.floor(Date.now() / 1000)}&key=${this.token}`;

    try {
      let error;
      for (let i = 0; i < retries; i++) {
        try {
          let response = await fetch(url);
          if (!response.ok) throw (`Response status is ${response.status}`);
          let json = await response.json();
          if (json.status !== "OK") throw (json.status);
          return json;
        } catch (e) {
          console.warn(`Temporary error - ${e}`);
          error = e;
        }
      }
      throw error;
    } catch (e) {
      console.error(`Permanent error - ${e}`);
      throw e;
    }
  }
}