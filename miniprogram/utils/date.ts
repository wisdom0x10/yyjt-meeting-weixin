import dayjs from 'dayjs';

export enum DATE_TYPE {
  DATE = 'YYYY-MM-DD',
  TIME = 'HH:mm:ss',
  DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
}
export const formatDate = (target: any, type: DATE_TYPE) => {
  const date = dayjs(target);
  return date.format(type);
};

export const formatToDateTime = (target: any) => {
  return formatDate(target, DATE_TYPE.DATE_TIME);
};

export const formatToDate = (target: any) => {
  return formatDate(target, DATE_TYPE.DATE);
};

export const formatToTime = (target: any) => {
  return formatDate(target, DATE_TYPE.TIME);
};
