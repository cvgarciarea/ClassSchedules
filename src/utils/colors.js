export default class Colors {

  static primary = '#ff5722'
  static primaryDark = '#c41C00'
  static primaryLight = '#ffC3b7'

  static secondary = '#8bc34a'
  static secondaryDark = '#5a9216'
  static secondaryLight = '#5a9216'

  static tests = '#7cb342'
  static testsDark = '#4b830d'
  static testsLight = '#aee571'

  static settings = '#1976d2'
  static settingsDark = '#004ba0'
  static settingsLight = '#63a4ff'

  static dayNameBackground = '#4b830d'
  static hourBackground = '#004ba0'

  static Action = {
    CONSTRUCTIVE: '#8bc34a',
    DESTRICTIVE: '#c34a4a',
  }

  static THEME = 'dark';
  static THEME_CALLBACKS = [];

  static Themes = {
    light: {
      background: '#f6f6f6',
      foreground: '#363c3d',
      sectionHeaderBackground: '#eaeaea',
      cellBackground: '#dadada',
      gridBackground: '#fff',
    },

    dark: {
      background: '#2a2a2a',
      foreground: '#f6f6f6',
      sectionHeaderBackground: '#000',
      cellBackground: '#2a2a2a',
      gridBackground: '#000',
    },

    amoled: {
      background: '#000',
      foreground: '#f6f6f6',
      sectionHeaderBackground: '#000',
      cellBackground: '#000',
      gridBackground: '#2a2a2a',
    },
  }

  static hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  static getTextColorForBackground(color) {
    if (typeof(color) === 'string') {
      color = this.hexToRGB(color);
    }

    let light = color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186;
    return light ? '#000' : '#fff';
  }

  static addThemeCallback(func) {
    Colors.THEME_CALLBACKS.push(func);
  }

  static setTheme(theme) {
    Colors.THEME = theme;

    for (let i=0; i<Colors.THEME_CALLBACKS.length; i++) {
      Colors.THEME_CALLBACKS[i](theme);
    }
  }
}
