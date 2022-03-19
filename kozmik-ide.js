const EventEmitter = require('events');
const fs = require('fs');

module.exports = {
  addons: {},
  emitter: new EventEmitter(),
  addonEnablingIsDone: false,
  addAddon: function (m) {
    this.addons[m.i] = m;
    if (this.addonEnablingIsDone) {
      this.enableAddon(m);
      m.listeners.addonEnablingIsDone(this);
    } else
      m.enabled = false;
  },
  enableAddon: function (m) {
    m.enabled = true;
    m.listeners.enable(this);
    for (k in m.listeners)
      this.emitter.on(k, m.listeners[k]);
    this.emitter.emit('enabled', this, m);
  },
  disableAddon: function (m) {
    for (k in m.listeners)
      this.emitter.off(k, m.listeners[k]);
    m.enabled = false;
    m.listeners.disable(this);
    this.emitter.emit('disabled', this, m);
  },
  removeAddon: function (i) {
    if (this.addons[i].enabled)
      this.disableAddon(this.addons[i]);
    delete this.addons[i];
  }
};

// Load add-ons
fs.readFile('./kozmik-addons.json', (err, data) => {
  if (data) {
    JSON.parse(data).forEach(e => module.exports.addAddon(require(e)));

    // Enabling add-ons
    for (i in module.exports.addons)
      module.exports.enableAddon(module.exports.addons[i]);
    module.exports.emitter.emit('addonEnablingIsDone', module.exports);
    module.exports.addonEnablingIsDone = true;
  } else
    console.log(err);
});
