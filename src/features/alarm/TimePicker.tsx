// TimePicker.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
import { tx } from '@/styles/typography';
import { useClickOutside } from '@/hooks/useClickOutside';

type Period = '오전' | '오후';

interface TimePickerProps {
  /** 0..23 */
  hour24: number;
  /** 0..59 */
  minute: number;
  /** onChange는 항상 24시간제로 반환 */
  onChange: (hour24: number, minute: number) => void;
  /** 분 간격 (기본 1) */
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
}

const ROW = 32; // 항목 높이(px)
const VISIBLE = 3; // 보이는 항목 수(홀수)
const CENTER_OFFSET = 1; // 중앙에서 위로 몇 행이 비어있어야 하는지(3행이면 1)

export const TimePicker = ({
  hour24,
  minute,
  onChange,
  minuteStep = 1,
  disabled,
  className,
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const periodRef = useRef<HTMLDivElement>(null!);
  const hourRef = useRef<HTMLDivElement>(null!);
  const minuteRef = useRef<HTMLDivElement>(null!);

  // 파생 값(표시용 12시간제)
  const period: Period = hour24 >= 12 ? '오후' : '오전';
  const hour12 = to12(hour24);

  // 외부 클릭/터치 시 닫기
  useClickOutside(wrapRef, open, () => setOpen(false));

  // 분 목록 (step 반영)
  const minutes = useMemo(() => {
    const arr: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) arr.push(m);
    return arr;
  }, [minuteStep]);

  // 열릴 때 현재 값으로 스크롤 정렬
  useEffect(() => {
    if (!open) return;
    snapTo(periodRef.current, period === '오전' ? 0 : 1);

    const hourIdx = hour12 - 1; // 1..12 → 0..11
    snapTo(hourRef.current, hourIdx);

    const minIdx = closestIndex(minutes, minute);
    snapTo(minuteRef.current, minIdx);
  }, [open, period, hour12, minute, minutes]);

  // 스크롤 → 값 확정 (디바운스)
  const onScrollPeriod = useSnapScroll(periodRef, 2, idx => {
    const nextIsPm = idx === 1;
    const next = to24(hour12, nextIsPm);
    if (next !== hour24) onChange(next, minute);
  });
  const onScrollHour = useSnapScroll(hourRef, 12, idx => {
    const next = to24(idx + 1, period === '오후');
    if (next !== hour24) onChange(next, minute);
  });
  const onScrollMinute = useSnapScroll(minuteRef, minutes.length, idx => {
    const nextMin = minutes[idx] ?? 0;
    if (nextMin !== minute) onChange(hour24, nextMin);
  });

  return (
    <Wrap ref={wrapRef} className={className}>
      <Trigger
        type="button"
        onClick={() => !disabled && setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={!!disabled}
      >
        <Display>
          <Time>{period}</Time>
          <Time>{`${pad2(hour12)}:${pad2(minute)}`}</Time>
        </Display>
        <ChevronDown size={20} />
      </Trigger>

      {open && (
        <Popover role="dialog" aria-label="시간 선택">
          <ColumnsWrap>
            {/* ✅ 고정 가이드라인 오버레이 (스크롤과 무관) */}
            <Guides>
              <GuideCell />
              <GuideCell />
              <GuideCell />
            </Guides>

            {/* 실제 스크롤 되는 컬럼들 */}
            <Columns>
              {/* 오전/오후 */}
              <Column aria-label="오전/오후" ref={periodRef} onScroll={onScrollPeriod}>
                {(['오전', '오후'] as Period[]).map(p => (
                  <Item key={p} $active={p === period}>
                    {p}
                  </Item>
                ))}
              </Column>

              {/* 시(1~12) */}
              <Column aria-label="시" ref={hourRef} onScroll={onScrollHour}>
                {range(1, 12).map(h => (
                  <Item key={h} $active={h === hour12}>
                    {pad2(h)}
                  </Item>
                ))}
              </Column>

              {/* 분 */}
              <Column aria-label="분" ref={minuteRef} onScroll={onScrollMinute}>
                {minutes.map(m => (
                  <Item key={m} $active={m === minute}>
                    {pad2(m)}
                  </Item>
                ))}
              </Column>
            </Columns>
          </ColumnsWrap>
        </Popover>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  background: ${({ theme }) => theme.color.white};
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[700]};
`;

const Display = styled.div`
  display: flex;
  gap: 10px;
`;

const Time = styled.span`
  color: ${({ theme }) => theme.color.gray[700]};
  ${tx.body('reg14')};
`;

const Popover = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

/* 래퍼: 오버레이 기준 */
const ColumnsWrap = styled.div`
  position: relative;
`;

/* 스크롤되는 실제 컬럼 그리드 */
const Columns = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr; /* 오전/오후 | 시 | 분 */
  column-gap: 8px;
  align-items: center;
`;

/* ✅ 오버레이: 컬럼과 동일한 그리드로 라인만 깔기 */
const Guides = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  column-gap: 8px;
  pointer-events: none; /* 클릭/스크롤 방해 금지 */
`;

const GuideCell = styled.div`
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
  /* 가운데 라인 2개 (gap 부분은 셀 사이에서 자동으로 끊김) */
  &::before {
    top: calc(50% - ${ROW / 2}px);
  }
  &::after {
    top: calc(50% + ${ROW / 2}px);
  }
`;

/* 컬럼(스크롤 영역) */
const Column = styled.div`
  position: relative; /* ✅ 가이드라인 기준 */
  height: ${ROW * VISIBLE}px; /* 보이는 영역(3행) */
  overflow-y: auto;
  /* ✅ 중앙선 정렬용 상/하 패딩: 첫/마지막 아이템도 중앙선에 올 수 있음 */
  padding-top: ${CENTER_OFFSET * ROW}px;
  padding-bottom: ${CENTER_OFFSET * ROW}px;
  scroll-snap-type: y proximity;
  /* 수평 중앙 정렬(숫자 위치 중앙 고정) */
  text-align: center;

  /* ✅ 스크롤바 완전 숨김: 데스크톱/모바일 공통 */
  -ms-overflow-style: none; /* IE/Edge 구형 */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    /* Chrome/Safari/Edge */
    width: 0;
    height: 0;
  }
  /* (선택) 스크롤바 정책으로 레이아웃 흔들림 방지 */
  scrollbar-gutter: stable both-edges;
`;

/* 항목 */
const Item = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* ✅ 컬럼 폭 기준 정중앙 */
  height: ${ROW}px; /* 행 높이 고정 */
  color: ${({ theme, $active }) => ($active ? theme.color.main[600] : theme.color.gray[500])};
  ${({ $active }) => ($active ? tx.body('semi14') : tx.body('reg14'))};
  user-select: none;
`;

/* ───────────── utils ───────────── */

const range = (start: number, end: number) => {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
};
const pad2 = (n: number) => n.toString().padStart(2, '0');

const to12 = (h24: number) => {
  const v = h24 % 24;
  return v % 12 === 0 ? 12 : v % 12; // 0 -> 12, 13 -> 1 ...
};
const to24 = (h12: number, isPm: boolean) => (h12 % 12) + (isPm ? 12 : 0); // 12AM->0, 12PM->12

/* ───────────── scroll/snap helpers ───────────── */

// 중앙에 특정 인덱스를 맞추도록 스크롤
function snapTo(el: HTMLDivElement | null, idx: number) {
  if (!el) return;
  // 패딩을 사용하므로 단순히 "idx * ROW" 만큼 스크롤하면 중앙선에 정렬됨
  const maxIdx = Math.max(0, Math.floor((el.scrollHeight - CENTER_OFFSET * 2 * ROW) / ROW) - 1);
  const clamped = Math.min(Math.max(idx, 0), maxIdx);
  const top = clamped * ROW;
  el.scrollTo({ top, behavior: 'auto' });
}

// 스크롤 위치로부터 "중앙에 온" 인덱스를 계산
function centerIndexFrom(el: HTMLDivElement) {
  // 패딩이 이미 CENTER_OFFSET * ROW 만큼 들어가 있으므로 그만큼 보정 불필요
  return Math.round(el.scrollTop / ROW);
}

// 디바운스 스냅 + onChange 호출
function useSnapScroll(
  ref: React.RefObject<HTMLDivElement>,
  count: number,
  onIndexChange: (idx: number) => void
) {
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  return () => {
    const el = ref.current;
    if (!el) return;

    if (timer.current) window.clearTimeout(timer.current);
    // 스크롤 종료 후 120ms에 스냅/업데이트
    timer.current = window.setTimeout(() => {
      const idx = clamp(centerIndexFrom(el), 0, count - 1);
      snapTo(el, idx);
      onIndexChange(idx);
      timer.current = null;
    }, 120);
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function closestIndex(arr: number[], target: number) {
  if (!arr.length) return 0;
  let best = 0;
  let bestDiff = Math.abs(arr[0] - target);
  for (let i = 1; i < arr.length; i++) {
    const d = Math.abs(arr[i] - target);
    if (d < bestDiff) {
      best = i;
      bestDiff = d;
    }
  }
  return best;
}
