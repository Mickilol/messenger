const WEEK_IN_MILLISECONDS = 6.048e+8;

const MAP_MONTH_TO_STRING: Record<string, string> = {
  0: 'Янв',
  1: 'Фев',
  2: 'Мар',
  3: 'Апр',
  4: 'Мая',
  5: 'Июн',
  6: 'Июл',
  7: 'Авг',
  8: 'Сен',
  9: 'Окт',
  10: 'Нояб',
  11: 'Дек',
};

const MAP_DAY_TO_STRING: Record<string, string> = {
  0: 'Вс',
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const currentDate = new Date();

  const diff = currentDate.getTime() - date.getTime();

  if (diff > WEEK_IN_MILLISECONDS) {
    return `${date.getDate()} ${MAP_MONTH_TO_STRING[date.getMonth()]} ${date.getFullYear()}`;
  }

  const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

  if (currentDate.getDay() !== date.getDay()) {
    return `${MAP_DAY_TO_STRING[date.getDay()]} ${hours}:${minutes}`;
  }

  return `${hours}:${minutes}`;
}