import { TitleHeader } from '@/components/common/TitleHeader';
import styled from 'styled-components';
import { tx } from '@/styles/typography';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getPetById } from '@/apis/pets';
import { getReportList } from '@/apis/ai-report';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AIReportListPage = () => {
  const navigate = useNavigate();
  const selectedPetId = useSelector((s: RootState) => s.selectedPet.id);
  const { data: pet } = useQuery({
    queryKey: ['pet', selectedPetId],
    queryFn: () => getPetById(selectedPetId as number),
    enabled: selectedPetId !== null,
    staleTime: 1000 * 60 * 5,
  });
  const { data: reportList } = useQuery({
    queryKey: ['reportList', selectedPetId],
    queryFn: () => getReportList(selectedPetId as number),
    enabled: selectedPetId !== null,
    staleTime: 1000 * 60 * 5,
  });

  console.log(reportList);
  return (
    <>
      <TitleHeader title="AI 진단" />
      <Container>
        <ListHeader>
          <ListTitle>
            <Nickname>{pet?.name}</Nickname> 루틴 분석 목록
          </ListTitle>
          <EditButton>편집</EditButton>
        </ListHeader>

        <ListContainer>
          {reportList &&
            reportList.length > 0 &&
            reportList.map((report: any) => (
              <ReportItem key={report.id} onClick={() => navigate(`/aireport/${2}`)}>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportDate>
                  기간 | {report.startDate} ~ {report.endDate}
                </ReportDate>
              </ReportItem>
            ))}
        </ListContainer>
      </Container>

      <FloatingButton>
        <Sparkles size={16} />
        <span>AI 진단받기</span>
      </FloatingButton>
    </>
  );
};

const Container = styled.div`
  margin: 20px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ListTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${tx.title('semi18')};
`;

const Nickname = styled.div`
  ${tx.title('bold22')};
`;

const EditButton = styled.button`
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[500]};
  background: none;
  border: none;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReportItem = styled.div`
  padding: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray[300]};
`;

const ReportTitle = styled.div`
  ${tx.body('semi14')};
  color: ${({ theme }) => theme.color.gray[700]};
`;

const ReportDate = styled.div`
  margin-top: 4px;
  ${tx.caption('med12')};
  color: ${({ theme }) => theme.color.gray[400]};
`;

const FloatingButton = styled.button`
  display: flex;
  align-items: center;
  position: fixed;
  right: 20px;
  bottom: 80px;
  padding: 18px;
  gap: 6px;
  ${tx.body('med16')};
  border: 1px solid ${({ theme }) => theme.color.main[500]};
  border-radius: 30px;
  cursor: pointer;
`;
