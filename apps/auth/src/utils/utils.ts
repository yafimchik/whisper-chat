import { RADIX } from '../configs/auth.constants';

enum TimeLetter {
  second = 's',
  minute = 'm',
  hour = 'h',
  day = 'd',
  week = 'w',
}

const SECS_IN_MINUTE = 60;
const SECS_IN_HOUR = SECS_IN_MINUTE * 60;
const SECS_IN_DAY = SECS_IN_HOUR * 24;
const SECS_IN_WEEK = SECS_IN_DAY * 7;

export const asyncPause: (ms: number) => Promise<void> = (ms = 0) =>
  new Promise((res) => setTimeout(res, ms));

export function getSecondsFromLifeTimeString(lifeTimeString = ''): number {
  if (!lifeTimeString.length) return 0;
  let seconds = 0;
  lifeTimeString.split(' ').forEach((value) => {
    if (!value.length) return;
    const valueNum = parseInt(value, RADIX);

    if (Number.isNaN(valueNum)) return;

    let multiplier;
    switch (value[value.length - 1]) {
      case TimeLetter.second:
        multiplier = SECS_IN_MINUTE;
        break;
      case TimeLetter.minute:
        multiplier = SECS_IN_MINUTE;
        break;
      case TimeLetter.hour:
        multiplier = SECS_IN_HOUR;
        break;
      case TimeLetter.day:
        multiplier = SECS_IN_DAY;
        break;
      case TimeLetter.week:
        multiplier = SECS_IN_WEEK;
        break;
      default:
        multiplier = 0;
    }

    seconds += valueNum * multiplier;
  });
  return seconds;
}

const SPECIFIC_SYMBOLS = {
  '#': '%23',
};

export function encodeUrl(url: string): string {
  const newUrl = encodeURI(url);
  return newUrl
    .split('')
    .map((letter) => SPECIFIC_SYMBOLS[letter] ?? letter)
    .join('');
}
