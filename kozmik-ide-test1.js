module.exports = {
  i: 'test1',
  listeners: {
    enable: kozmik => {
      console.log('e1');
    },
    enabled: kozmik => {
      console.log('ed1');
    },
    allEnabled: kozmik => {
      console.log('aEd1');
    },
    disable: kozmik => {
      console.log('d1');
    },
    disabled: (kozmik, m) => {
      console.log('dd1: ' + m.i);
    }
  }
};