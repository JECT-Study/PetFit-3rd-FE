// src/ui/Field.tsx
import { cloneElement, isValidElement, useId, type ReactElement } from 'react';
import styled from 'styled-components';
import { tx } from '@/styles/typography';

/** Field가 자식 컨트롤에 주입/참조하는 prop 계약 */
type FieldControlProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean; // ✅ a11y용
};

interface FieldProps {
  /** 상단 라벨(선택) */
  label?: React.ReactNode;

  /** 라벨-컨트롤 연결용 id(선택). 보통은 자식에 id를 직접 지정 권장 */
  labelFor?: string;

  /** 헬퍼 요소 id(선택). 미지정 시 `${resolvedId}-help` 자동 부여 */
  helperId?: string;

  /** 힌트(동적 메시지 포함). 이번 정책상 에러 스타일은 헬퍼 색만 변경 */
  hint: string | null;
  /** 검증 결과(헬퍼 색/aria-invalid 주입용) */
  invalid: boolean;

  /** 글자수 카운트 */
  count: number;
  max: number;

  /** 헬퍼 행(힌트/카운트) 표시 여부. 기본 true */
  showHelper?: boolean;

  /** <InputBase .../> 또는 <TextareaBase .../> 단일 엘리먼트 */
  children: ReactElement<FieldControlProps>;
}

export const Field = ({
  label,
  labelFor,
  helperId,
  hint,
  invalid,
  count,
  max,
  showHelper = true,
  children,
}: FieldProps) => {
  const autoId = useId();

  // ---- 자식 id 해석: child.id > labelFor > useId() ----
  const childId = isValidElement<FieldControlProps>(children) ? children.props.id : undefined;
  const resolvedId = childId ?? labelFor ?? `fld-${autoId}`;

  // ---- helperId 해석: prop > `${resolvedId}-help` ----
  const resolvedHelperId = helperId ?? `${resolvedId}-help`;

  const showHint = !!invalid && !!hint; // ✅ invalid일 때만 힌트 노출

  // ---- aria-describedby/aria-invalid 주입 + id 주입 ----
  const enhancedChild = isValidElement<FieldControlProps>(children)
    ? (() => {
        const p = children.props;

        const prevDesc = p['aria-describedby'];
        // 헬퍼를 렌더하지 않으면 aria-describedby를 주입하지 않는다
        const nextDesc =
          showHelper && showHint
            ? [prevDesc, resolvedHelperId].filter(Boolean).join(' ')
            : prevDesc;

        return cloneElement<FieldControlProps>(children, {
          id: resolvedId,
          'aria-describedby': nextDesc,
          'aria-invalid': invalid || undefined, // ✅ a11y로 에러 상태 전달
        });
      })()
    : children;

  return (
    <Wrap>
      {label && (
        <LabelRow as="label" htmlFor={resolvedId}>
          {label}
        </LabelRow>
      )}

      {enhancedChild}

      {showHelper && (
        <HelperRow
          id={resolvedHelperId}
          aria-live={invalid ? 'assertive' : 'polite'} // ✅ 에러 시 즉시 읽기
        >
          <Hint $show={showHint}>{hint ?? ''}</Hint>
          <Count $invalid={!!invalid}>{`${count}/${max}`}</Count>
        </HelperRow>
      )}
    </Wrap>
  );
};

/* ===== styles ===== */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelRow = styled.label`
  padding-left: 8px;
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[500]};
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const Hint = styled.p<{ $show: boolean }>`
  ${tx.caption('med12')};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')}; /* invalid 아닐 땐 자리만 유지 */
  color: ${({ theme }) => theme.color.warning[500]};
`;

const Count = styled.span<{ $invalid: boolean }>`
  ${tx.caption('med12')};
  color: ${({ theme, $invalid }) => ($invalid ? theme.color.warning[500] : theme.color.gray[400])};
`;
