export const thirtyDaysFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
};

export const fifteenMinutesFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 15);
};

export const tenMinutesFromNow = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 10);
};
