// src/ds/Toast/ToastProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ToastView, ToastAnchor, type ToastVariant } from './Toast';

/** ===== 타입 ===== */
type AlertToastOptions = {
  id?: string;
  variant: 'alert';
  time: string;
  content: string;
  onConfirm?: () => void; // 확인 클릭 시 실행
  duration?: number; // 기본 60s (확인 시 즉시 닫힘)
};

type ErrorToastOptions = {
  id?: string;
  variant: 'error';
  content: string;
  duration?: number; // 기본 1s
};

export type ToastOptions = AlertToastOptions | ErrorToastOptions;

type AlertToastItem = Required<Pick<AlertToastOptions, 'variant' | 'time' | 'content'>> & {
  id: string;
  onConfirm?: () => void;
  duration: number;
};

type ErrorToastItem = Required<Pick<ErrorToastOptions, 'variant' | 'content'>> & {
  id: string;
  duration: number;
};

type ToastItem = AlertToastItem | ErrorToastItem;

export type ToastAPI = {
  show: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<ToastAPI | null>(null);
export const useToast = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast must be used within <ToastProvider>');
  return v;
};

const DEFAULT_DURATION = {
  error: 1000, // 1s
  alert: 60000, // 60s
} as const;

// variant별 최대 스택 길이(필요 시 조정)
const MAX_PER_VARIANT: Record<ToastVariant, number> = {
  error: 3,
  alert: 3,
};

/** ===== Provider ===== */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback<ToastAPI['show']>(
    opts => {
      const id = opts.id ?? crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
      const duration =
        typeof opts.duration === 'number' ? opts.duration : DEFAULT_DURATION[opts.variant];

      const item: ToastItem =
        opts.variant === 'alert'
          ? {
              id,
              variant: 'alert',
              time: opts.time,
              content: opts.content,
              onConfirm: opts.onConfirm,
              duration,
            }
          : { id, variant: 'error', content: opts.content, duration };

      // ✅ 중복 ID 디듀프(치환) + 최대 스택 제한
      setItems(prev => {
        // 1) 기존 아이템 치환(중복 ID)
        let next = (() => {
          const i = prev.findIndex(x => x.id === id);
          if (i === -1) return [...prev, item];
          const copy = prev.slice();
          copy[i] = item;
          return copy;
        })();

        // 2) variant별 최대 스택 제한(초과 시 가장 오래된 것부터 제거)
        const cap = MAX_PER_VARIANT[item.variant];
        let over = next.filter(x => x.variant === item.variant).length - cap;
        if (over > 0) {
          const result: ToastItem[] = [];
          for (const it of next) {
            if (it.variant === item.variant && over > 0) {
              over--;
              // 제거된 항목의 타이머 정리는 아래 useEffect에서 처리
              continue;
            }
            result.push(it);
          }
          next = result;
        }
        return next;
      });

      // ✅ 타이머(중복 ID 치환 시 리셋)
      const old = timers.current.get(id);
      if (old) {
        window.clearTimeout(old);
        timers.current.delete(id);
      }
      if (duration > 0) {
        const t = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, t);
      }

      return id;
    },
    [dismiss]
  );

  const clear = useCallback(() => {
    setItems([]);
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current.clear();
  }, []);

  const api = useMemo<ToastAPI>(() => ({ show, dismiss, clear }), [show, dismiss, clear]);

  // ✅ Provider 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      timers.current.forEach(t => window.clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  // ✅ items 변화에 따라 제거된 항목의 타이머 정리(스택 제한/수동 dismiss 등)
  useEffect(() => {
    const alive = new Set(items.map(i => i.id));
    timers.current.forEach((t, id) => {
      if (!alive.has(id)) {
        window.clearTimeout(t);
        timers.current.delete(id);
      }
    });
  }, [items]);

  const topItems = items.filter((i): i is AlertToastItem => i.variant === 'alert');
  const bottomItems = items.filter((i): i is ErrorToastItem => i.variant === 'error');

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <Ctx.Provider value={api}>
      {children}

      {portalTarget &&
        createPortal(
          <>
            {/* alert: 상단, 확인 전 최대 60s 유지 */}
            <ToastAnchor $variant="alert" role="status" aria-live="polite" aria-label="Alerts">
              <Stack>
                {topItems.map(t => (
                  <ToastView
                    key={t.id}
                    variant="alert"
                    time={t.time}
                    content={t.content}
                    onConfirm={t.onConfirm}
                    onClose={() => dismiss(t.id)} // 확인 즉시 종료
                  />
                ))}
              </Stack>
            </ToastAnchor>

            {/* error: 하단, 기본 1s 자동 종료 */}
            <ToastAnchor $variant="error" role="alert" aria-live="assertive" aria-label="Errors">
              <Stack>
                {bottomItems.map(t => (
                  <ToastView key={t.id} variant="error" content={t.content} />
                ))}
              </Stack>
            </ToastAnchor>
          </>,
          portalTarget
        )}
    </Ctx.Provider>
  );
};

/** 스택 컨테이너 */
const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  > * {
    pointer-events: auto;
  }

  /* ✅ 모션 민감 사용자 배려: 자식 포함 애니메이션/트랜지션 제거 */
  @media (prefers-reduced-motion: reduce) {
    &,
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;

/** 편의 함수 */
export const showError =
  (api: ToastAPI) => (content: string, opts?: Omit<ErrorToastOptions, 'variant' | 'content'>) =>
    api.show({ variant: 'error', content, ...opts });

export const showAlert =
  (api: ToastAPI) =>
  (
    args:
      | { time: string; content: string; onConfirm?: () => void; duration?: number; id?: string }
      | [time: string, content: string, onConfirm?: () => void, duration?: number]
  ) => {
    if (Array.isArray(args)) {
      const [time, content, onConfirm, duration] = args;
      return api.show({ variant: 'alert', time, content, onConfirm, duration });
    }
    return api.show({ variant: 'alert', ...args });
  };
