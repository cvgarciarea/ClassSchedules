export default class Consts {

  static APP_VERSION = '0.1.4';

  static Sizes = {
    CellWidth: 175,
    CellHeight: 80,
    CellMargin: 0.5,
    rowLabelTitleWidth: 30,
    rowLabelWidth: 65,
    columnLabelHeight: 35,
  };

  static Days = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  static dayNames = {
    [Consts.Days.SUNDAY]:    'sunday',
    [Consts.Days.MONDAY]:    'monday',
    [Consts.Days.TUESDAY]:   'tuesday',
    [Consts.Days.WEDNESDAY]: 'wednesday',
    [Consts.Days.THURSDAY]:  'thursday',
    [Consts.Days.FRIDAY]:    'friday',
    [Consts.Days.SATURDAY]:  'saturday',
  };

  static defaultSettings = {
    language: 'en',
    theme: 'light',
    visibleDays: [
      Consts.Days.MONDAY,
      Consts.Days.TUESDAY,
      Consts.Days.WEDNESDAY,
      Consts.Days.THURSDAY,
      Consts.Days.FRIDAY,
    ],
    visibleHours: {
      start: 7,
      end: 18,
    },
    recentColors: [
      '#E7C14C',
      '#E98E75',
      '#D84B95',
      '#C63DCF',
      '#4091BC',
    ],
    createScheduleAtEmptyHour: false,
    dailySubjectsNotifications: false,
    dailySubjectsNotificationTime: '08:00',
  };
}
