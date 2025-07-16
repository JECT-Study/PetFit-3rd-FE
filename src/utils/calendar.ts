export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * 주어진 연/월에 대한 달력용 날짜 배열 반환 (앞/뒤 포함 7xN 구성)
 * @param year - 연도 (ex: 2025)
 * @param month - 월 (1-based, ex: 7 = 7월)
 */
export const getMonthDates = (year: number, month: number): string[] => {
  const result: string[] = [];

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDay = firstDayOfMonth.getDay(); // 0(일)~6(토)
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  const currMonthLastDate = new Date(year, month, 0).getDate();

  // 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, prevMonthLastDate - i);
    result.push(formatDate(date));
  }

  // 현재 달 날짜
  for (let i = 1; i <= currMonthLastDate; i++) {
    result.push(formatDate(new Date(year, month - 1, i)));
  }

  // 다음 달 날짜
  const totalCells = Math.ceil(result.length / 7) * 7; // 7의 배수 맞춤
  const remaining = totalCells - result.length;

  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month, i); // 정확히 다음 달 날짜
    result.push(formatDate(date));
  }

  return result;
};

export const isSameMonth = (date: Date, year: number, month: number): boolean => {
  return formatDate(date).startsWith(`${year}-${String(month).padStart(2, '0')}`);
};
