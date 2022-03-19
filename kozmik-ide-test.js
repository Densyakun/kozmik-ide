module.exports = {
  i: 'test',
  listeners: {
    enable: kozmik => {
      console.log('e');
    },
    enabled: (kozmik, m) => {
      console.log('ed: ' + m.i);
    },
    addonEnablingIsDone: kozmik => {
      console.log('aED');
    },
    disable: kozmik => {
      console.log('d');
    },
    disabled: (kozmik, m) => {
      console.log('dd: ' + m.i);
    }
  }
};