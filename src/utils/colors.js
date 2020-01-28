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

  static Themes = {
    light: {
      background: '#f6f6f6',
      foreground: '#363c3d',
      sectionHeaderBackground: '#eaeaea',
      cellBackground: '#dadada',
      gridBackground: '#fff',
      warning: '#D93438',
      link: '#363c3d',
    },

    dark: {
      background: '#2a2a2a',
      foreground: '#f6f6f6',
      sectionHeaderBackground: '#000',
      cellBackground: '#2a2a2a',
      gridBackground: '#000',
      warning: '#D93438',
      link: '#fff',
    },

    amoled: {
      background: '#000',
      foreground: '#f6f6f6',
      sectionHeaderBackground: '#000',
      cellBackground: '#000',
      gridBackground: '#2a2a2a',
      warning: '#D93438',
      link: '#fff',
    },
  }

  // Extraje estos colores de la app Daylio (net.daylio)
  static pickerPallete = [
    [
      '#E7C14C',
      '#E1A834',
      '#E37E2F',
      '#D58157',
      '#D57322',
      '#B75427',
    ],
    [
      '#E98E75',
      '#EA7656',
      '#EA5358',
      '#D54637',
      '#DD1D34',
      '#B7212B',
    ],
    [
      '#D84B95',
      '#E05E82',
      '#DE386F',
      '#AC0750',
      '#8D1C73',
      '#870A8F',
    ],
    [
      '#C63DCF',
      '#9C6CDA',
      '#AE73BC',
      '#834D90',
      '#725292',
      '#5D2888',
    ],
    [
      '#4091BC',
      '#628AA8',
      '#4B6C93',
      '#476991',
      '#30546F',
      '#004F83',
    ],
    [
      '#00C9C1',
      '#00BA9F',
      '#00A481',
      '#279C96',
      '#00707C',
      '#006962',
    ],
    [
      '#BBC133',
      '#94AA2F',
      '#6DAD31',
      '#73AE77',
      '#4FB26B',
      '#339560',
    ],
    [
      '#606B70',
      '#4B6E74',
      '#2F4652',
      '#877A7A',
      '#534B4A',
      '#383838',
    ]
  ]

  /**
   * https://stackoverflow.com/a/5624139/2461236
   * Convierte un color en formato '#XXX' o '#XXXXXX' a { r: X, g: X, b: X }
   * 
   * @typedef {Object} RGBColor
   * @property {Number} r Red.
   * @property {Number} g Green.
   * @property {Number} b Blue.
   * 
   * @param {String} hex
   * 
   * @return {RGBColor}
   */
  static hexToRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static getTextColorForBackground(color) {
    if (typeof(color) === 'string') {
      color = Colors.hexToRGB(color);
    }

    let light = color.r * 0.299 +
                color.g * 0.587 +
                color.b * 0.114 > 186;

    return light ? '#000' : '#fff';
  }
}
