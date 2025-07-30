// ✅ 유효성 타입 정의
export type ValidationType = 'petName' | 'title' | 'content' | 'nickname';

interface ValidatorResult {
  isValid: boolean;
  message: string;
}

// ✅ 필드별 최대 길이 상수
export const MAX_LENGTH = {
  petName: 20,
  title: 20,
  content: 200,
  nickname: 10,
} as const;

// ✅ 정규식 (예: 특수 문자 허용 포함)
export const VALID_CHAR_REGEX = /^[\w가-힣\s!@#%^&*()[\]{}\-_=+~;:'",.<>/?\\|`·★♡♥]+$/;

// ✅ 공통 메시지 템플릿
export const VALIDATION_MESSAGES = {
  required: (label: string) => `${label}을(를) 입력해주세요.`,
  maxLength: (max: number) => `${max}자까지 입력할 수 있습니다.`,
  invalidChar: () => `영문, 한글만 입력할 수 있습니다.`,
};

// ✅ 개별 validator 함수
const validateTextField = (
  value: string,
  label: string,
  maxLength: number,
  useRegex: boolean = false
): ValidatorResult => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, message: VALIDATION_MESSAGES.required(label) };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, message: VALIDATION_MESSAGES.maxLength(maxLength) };
  }

  if (useRegex && !VALID_CHAR_REGEX.test(trimmed)) {
    return { isValid: false, message: VALIDATION_MESSAGES.invalidChar() };
  }

  return { isValid: true, message: '' };
};

// ✅ validator 객체
export const validators: Record<ValidationType, (value: string) => ValidatorResult> = {
  petName: value => validateTextField(value, '이름', MAX_LENGTH.petName, true),
  title: value => validateTextField(value, '제목', MAX_LENGTH.title),
  content: value => validateTextField(value, '전체 내용', MAX_LENGTH.content),
  nickname: value => validateTextField(value, '닉네임', MAX_LENGTH.nickname, true),
};
