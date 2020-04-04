/**
 * Existen componentes (como Transitioner o SafeView) de librerías que utlizo
 * que a día de hoy (04/04/2020) siguen utilizando el método obsoleto
 * "componentWillreceiveProps", por lo cual react-native muestra una
 * advertencia en la consola, lo cual es bastante molesto. Con este script me
 * encargo de ocultar esos warnings. 
 */

 let originalConsoleWarn = console.warn;

console.warn = message => {
  if (message.indexOf('componentWillReceiveProps') <= -1) {
    originalConsoleWarn(message);
  }
}
