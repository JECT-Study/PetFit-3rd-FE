export const MAX_NAME_LENGTH = 20;

// 유효한 문자: 영문, 한글, 숫자, 특수문자 허용
const VALID_CHAR_REGEX = /^[a-zA-Z가-힣0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~\s]*$/;

export function isValidPetName(name: string): boolean {
  if (!name.trim()) return false;
  if (name.length > MAX_NAME_LENGTH) return false;
  if (!VALID_CHAR_REGEX.test(name)) return false;

  return true;
}

export function getPetNameValidationMessage(name: string): string | null {
  if (!name.trim()) return '이름을 입력해주세요.';
  if (name.length > MAX_NAME_LENGTH) return `${MAX_NAME_LENGTH}자까지 입력할 수 있습니다.`;
  if (!VALID_CHAR_REGEX.test(name)) return '영문, 한글, 숫자, 특수문자만 입력할 수 있습니다.';
  return null;
}
