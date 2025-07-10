export const MAX_TITLE_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 200;

const VALID_CHAR_REGEX = /^[a-zA-Z가-힣0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~\s]*$/;

export function isValidAlarmTitle(title: string): boolean {
  return (
    title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH && VALID_CHAR_REGEX.test(title)
  );
}

export function getTitleValidationMessage(title: string): string | null {
  if (!title.trim()) return '제목을 입력해주세요.';
  if (title.length > MAX_TITLE_LENGTH) return `${MAX_TITLE_LENGTH}자까지 입력할 수 있습니다.`;
  if (!VALID_CHAR_REGEX.test(title)) return '영문, 한글, 숫자, 특수문자만 입력할 수 있습니다.';
  return null;
}
