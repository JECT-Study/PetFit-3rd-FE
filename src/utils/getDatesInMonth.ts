import { formatDate } from './formatDate';

export const getDatesInMonth = (year: number, month: number): string[] => {
  const date = new Date(year, month - 1, 1); // 6월 1일
  const result: string[] = [];
  while (date.getMonth() === month - 1) {
    result.push(formatDate(new Date(date))); // clone해서 안전하게 // ✅ 복제본 전달
    date.setDate(date.getDate() + 1); // 원본 date는 다음 날짜로 변경됨
  }
  return result;
};
