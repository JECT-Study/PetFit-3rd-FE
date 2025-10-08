type Params = {
  setValue: (v: string) => void;
  max: number;
};
// 공용: input | textarea 모두 지원
type Elem = HTMLInputElement | HTMLTextAreaElement;

/**
 * IME(한글 등 조합형 입력) 환경에서 조합 중 네이티브 maxLength가 일시 무시되는 문제를
 * onChange 즉시 slice + onCompositionEnd 보정 + onPaste 보정으로 해결.
 */
export function useImeMaxLength({ setValue, max }: Params) {
  const imeOnChange: React.ChangeEventHandler<Elem> = e => {
    const raw = e.target.value;
    setValue(raw.length > max ? raw.slice(0, max) : raw);
  };

  const imeOnCompositionEnd: React.CompositionEventHandler<Elem> = e => {
    const v = e.currentTarget.value;
    if (v.length > max) setValue(v.slice(0, max));
  };

  const imeOnPaste: React.ClipboardEventHandler<Elem> = e => {
    const paste = e.clipboardData?.getData('text') ?? '';
    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const next = (input.value.slice(0, start) + paste + input.value.slice(end)).slice(0, max);
    e.preventDefault();
    setValue(next);
  };

  return { imeOnChange, imeOnCompositionEnd, imeOnPaste };
}
