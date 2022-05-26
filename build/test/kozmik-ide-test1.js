module.exports = {
  i: 'test1',
  onEnable: function (kozmik) {
    console.log(`${this.i}:enable`);
  },
  onEnabled: function (kozmik, m) {
    console.log(`${this.i}:enabled: ${m.i}`);
  },
  onAddonEnablingIsDone: function (kozmik) {
    console.log(`${this.i}:addonEnablingIsDone`);
  },
  onDisable: function (kozmik) {
    console.log(`${this.i}:disable`);
  },
  onDisabled: function (kozmik, m) {
    console.log(`${this.i}:disabled: ${m.i}`);
  }
};