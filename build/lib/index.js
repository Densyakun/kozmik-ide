/*
フロントエンド:
- Mikado
- ファイル管理はシェルを参考
- 最初に./を表示
- カレントディレクトリを移動できるようにする
*/
const fs = require('fs');
const path = require('path');

module.exports = {
  addons: {},
  addonEnablingIsDone: false,
  addAddon: function (m) {
    this.addons[m.i] = m;
    if (this.addonEnablingIsDone)
      this.enableAddon(m);
    else
      m.enabled = false;
  },
  enableAddon: function (m) {
    m.enabled = true;
    if (m.onEnable)
      m.onEnable(this);
    for (i in this.addons)
      if (this.addons[i].enabled && this.addons[i].onEnabled)
        this.addons[i].onEnabled(this, m);
    if (this.addonEnablingIsDone && m.onAddonEnablingIsDone)
      m.onAddonEnablingIsDone(this);
  },
  disableAddon: function (m) {
    m.enabled = false;
    if (m.onDisable)
      m.onDisable(this);
    for (i in this.addons)
      if (this.addons[i].enabled && this.addons[i].onDisabled)
        this.addons[i].onDisabled(this, m);
  },
  removeAddon: function (i) {
    if (this.addons[i].enabled)
      this.disableAddon(this.addons[i]);
    delete this.addons[i];
  },
  ast: require('./ast/ast.js'),
  server: require('./server/server.js')
};

// Load add-ons
fs.readFile('./kozmik-addons.json', (err, data) => {
  if (data) {
    JSON.parse(data).forEach(e => module.exports.addAddon(require(path.join('../', e))));

    // Enabling add-ons
    for (i in module.exports.addons) {
      module.exports.enableAddon(module.exports.addons[i]);
      if (module.exports.addons[i].onAddonEnablingIsDone)
        module.exports.addons[i].onAddonEnablingIsDone();
    }
    module.exports.addonEnablingIsDone = true;
  } else
    console.log(err);
});
