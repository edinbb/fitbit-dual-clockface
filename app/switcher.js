export class Switcher {
  constructor(switcherName, appStorage, switcherElements, defaultIndex) {
    this.name = switcherName;
    this.storage = appStorage;
    this.elements = switcherElements;
    this.range = switcherElements.length;
    this.actIndex = appStorage.getItem(`${switcherName}Index`) || defaultIndex || 0;
    this.isLocked = false;
    this.watchID = null;
    this._showEl(this.actIndex, "select", false);
  }

  updateElements(els) {
    if (this.actIndex > els.length - 1)
      this._showEl(0, "enable", true);
    this.elements = els;
    this.range = els.length;
  }

  next() {
    let newIndex = this.actIndex === this.range - 1 ? 0 : this.actIndex + 1;
    if (newIndex === this.actIndex) return;
    this._showEl(newIndex, "enable", true);
  }

  previous() {
    let newIndex = this.actIndex === 0 ? this.range - 1 : this.actIndex - 1;
    if (newIndex === this.actIndex) return;
    this._showEl(newIndex, "enable", true);
  }

  tempLock() {
    this.isLocked = true;
    if (!this.watchID) {
      this.watchID = setTimeout(() => {
        this.isLocked = false;
        this.watchID = null;
      }, 500);
    }
  }

  lock() {
    this.isLocked = true;
  }

  unlock() {
    this.isLocked = false;
  }

  _showEl(newIndex, type, withDisable) {
    if (this.isLocked) return;
    if (withDisable) {
      let disableEl = this.elements[this.actIndex];
      if (disableEl) disableEl.firstChild.animate("disable");
    }
    let newEl = this.elements[newIndex];
    if (newEl) {
      newEl.firstChild.animate(type);
      this.actIndex = newIndex;
      this.storage.setItem(`${this.name}Index`, newIndex);
    }
  }
}