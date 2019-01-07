import * as fs from "fs";
import { me } from "appbit";

export class AppStorage {
  constructor() {
    this.content = this._load() || {};
    me.addEventListener("unload", () => this._save(this.content));
  }

  getItem = (item) => this.content[item];
  setItem = (key, value) => this.content[key] = value;
  clearItem = (key) => delete this.content[key];

  _load() {
    try {
      return fs.readFileSync("storage.cbor", "cbor");
    } catch (ex) { }
  }

  _save(content) {
    try {
      fs.writeFileSync("storage.cbor", content, "cbor");
    } catch (ex) { }
  }
}