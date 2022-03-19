const EventEmitter = require('events');
const fs = require('fs');

module.exports = {
  addons: {},
  emitter: new EventEmitter(),
  allAddonEnabled: false,
  addAddon: function (m) {
    this.addons[m.i] = m;
    if (!this.allAddonEnabled)
      this.enableAddon(m);
  },
  enableAddon: function (m) {
    m.listeners.enable(this);
    for (k in m.listeners)
      this.emitter.on(k, m.listeners[k]);
    this.emitter.emit('enabled', this);
  },
  disableAddon: function (m) {
    for (k in m.listeners)
      this.emitter.off(k, m.listeners[k]);
    m.listeners.disable(this);
    this.emitter.emit('disabled', this);
  },
  removeAddon: function (i) {
    delete this.addons[i];
  }
};

// Load add-ons
fs.readFile('./kozmik-addons.json', (err, data) => {
  if (data) {
    JSON.parse(data).forEach(e => module.exports.addAddon(require(e)));

    // Enabling add-ons
    module.exports.addons.forEach(m => module.exports.enableAddon(m));
    module.exports.emitter.emit('allEnabled', module.exports);
    module.exports.allAddonEnabled = true;
  } else
    console.log(err);
});
