import dayjs from 'dayjs';

export function formatDayjs(
  t: dayjs.ConfigType,
  format = 'YYYY-MM-DD HH:mm:SS',
): string {
  const d = dayjs(t);
  return d.isValid() ? d.format(format) : '-';
}

export function formatDate(t: dayjs.ConfigType) {
  return formatDayjs(t, 'YYYY-MM-DD');
}
