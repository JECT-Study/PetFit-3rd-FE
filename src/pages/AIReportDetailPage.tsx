import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReport } from '@/apis/ai-report';
import { TitleHeader } from '@/components/common/TitleHeader';
import styled from 'styled-components';
import { tx } from '@/styles/typography';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const AIReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const selectedPetId = useSelector((s: RootState) => s.selectedPet.id);

  const { data: reportDetail } = useQuery({
    queryKey: ['reportDetail', reportId],
    queryFn: () => getReport(Number(reportId)),
    enabled: selectedPetId !== null,
  });

  if (!reportDetail) return <div>리포트를 찾을 수 없습니다.</div>;

  console.log(reportDetail);
  return (
    <>
      <TitleHeader title="분석 결과" showBack={true} />
      <Container>
        <Title>{reportDetail.title}</Title>
        <Date>
          기간 | {reportDetail.startDate} ~ {reportDetail.endDate}
        </Date>
      </Container>

      <Divider />
      <Container>
        <Content>{reportDetail.content}</Content>
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 10px 20px 0;
`;

const Title = styled.h2`
  ${tx.title('semi18')};
  margin-bottom: 8px;
`;

const Date = styled.div`
  ${tx.caption('med12')};
  color: ${({ theme }) => theme.color.gray[400]};
  margin-bottom: 20px;
`;

const Divider = styled.div`
  height: 4px;
  background-color: ${({ theme }) => theme.color.gray[200]};
`;
const Content = styled.div`
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[700]};
  line-height: 1.6;
`;
