export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Date 객체를 'YYYY-MM' 형식 문자열로 포맷합니다.
 * 예: new Date(2025, 6, 1) → '2025-07'
 */
export const formatYearMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based → 1-based
  return `${year}-${month.toString().padStart(2, '0')}`;
};

/**
 * 주어진 날짜에 해당하는 달력용 날짜 배열 반환 (앞/뒤 포함 7xN 구성)
 * @param viewDate - 기준 날짜 (ex: new Date(2025, 6, 1) = 2025년 7월)
 */
export const getMonthDates = (viewDate: Date): Date[] => {
  const result: Date[] = [];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-based (0 = 1월, 6 = 7월)

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay(); // 0(일)~6(토)
  const prevMonthLastDate = new Date(year, month, 0).getDate(); // 이전 달 마지막 날짜
  const currMonthLastDate = new Date(year, month + 1, 0).getDate(); // 현재 달 마지막 날짜

  // 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    result.push(new Date(year, month - 1, prevMonthLastDate - i));
  }

  // 현재 달 날짜
  for (let i = 1; i <= currMonthLastDate; i++) {
    result.push(new Date(year, month, i));
  }

  // 다음 달 날짜 (총 셀 수를 7의 배수로 맞춤)
  const totalCells = Math.ceil(result.length / 7) * 7;
  const remaining = totalCells - result.length;

  for (let i = 1; i <= remaining; i++) {
    result.push(new Date(year, month + 1, i));
  }

  return result;
};

/**
 * 두 날짜가 같은 연도와 같은 월인지 확인
 *
 * @param a - 비교할 첫 번째 날짜 객체
 * @param b - 비교할 두 번째 날짜 객체
 * @returns 두 날짜가 같은 연도 및 같은 월이면 true, 그렇지 않으면 false
 */
export const isSameMonth = (a: Date, b: Date): boolean => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
};

export const isSameDay = (a: Date, b: Date): boolean => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

/**
 * 주어진 Date 객체에서 연도를 반환합니다.
 * @param date Date 객체
 * @returns 연도 (ex: 2025)
 */
export const getYear = (date: Date): number => {
  return date.getFullYear();
};

/**
 * 주어진 Date 객체에서 1-based 월을 반환합니다.
 * (JS Date는 0~11월이므로 +1 필요)
 * @param date Date 객체
 * @returns 월 (1~12)
 */
export const getMonthNumber = (date: Date): number => {
  return date.getMonth() + 1;
};

/**
 * 지정한 날짜를 기준으로 이전/현재/다음 달의 YYYY-MM 문자열 배열을 반환
 * @example getSurroundingMonths(new Date('2025-08-01'))
 * // → ['2025-07', '2025-08', '2025-09']
 */
export const getSurroundingMonths = (date: Date): string[] => {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const current = new Date(date.getFullYear(), date.getMonth(), 1);
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return [prev, current, next].map(formatYearMonth);
};

export const isWithinRange = (date: Date, start: Date, end: Date) => {
  const t = date.getTime();
  return t >= start.getTime() && t <= end.getTime();
};
