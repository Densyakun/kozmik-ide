module.exports = {
  i: 'test1',
  listeners: {
    enable: kozmik => {
      console.log('e1');
    },
    enabled: (kozmik, m) => {
      console.log('ed1: ' + m.i);
    },
    addonEnablingIsDone: kozmik => {
      console.log('aED1');
    },
    disable: kozmik => {
      console.log('d1');
    },
    disabled: (kozmik, m) => {
      console.log('dd1: ' + m.i);
    }
  }
};