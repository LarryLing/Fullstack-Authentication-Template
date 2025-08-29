export const sevenDaysFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
};

export const oneHourFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 60);
};

export const tenMinutesFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 10);
};

export const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
