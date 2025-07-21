import { AxiosError, isAxiosError } from 'axios';

interface ErrorResponse {
  success: boolean;
  code: string;
  message: string;
  content?: unknown; // 에러 응답일 때는 대부분 null 또는 생략
}

/**
 * Axios 에러 객체를 사용자 친화적인 메시지로 변환
 */
export const handleAxiosError = (error: unknown): string => {
  if (isAxiosError<ErrorResponse>(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response) {
      const { status } = axiosError.response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message, code } = axiosError.response.data;

      // 커스텀 메시지 우선 사용
      if (message) return message;

      // 상태 코드 기반 fallback 메시지
      switch (status) {
        case 400:
          return '잘못된 요청입니다.';
        case 401:
          return '로그인이 필요합니다.';
        case 403:
          return '접근 권한이 없습니다.';
        case 404:
          return '요청한 데이터를 찾을 수 없습니다.';
        case 500:
          return '서버 오류가 발생했습니다.';
        default:
          return `오류가 발생했습니다. (status: ${status})`;
      }
    }

    if (axiosError.request) {
      return '서버 응답이 없습니다. 네트워크 상태를 확인해주세요.';
    }

    return axiosError.message;
  }

  return '예기치 못한 오류가 발생했습니다.';
};
