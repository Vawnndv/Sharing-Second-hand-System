import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box } from '@mui/material';
import ReportCard from './ReportCard';
import { getPostReports, putUpdateReport } from '../../redux/services/reportServices';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Report {
  reportid: string;
  firstname: string;
  lastname: string;
  avatar: string;
  reporttype: string;
  description: string;
  createdat: string;
  updatedat: string;
  userid?: string;
  postid?: string;
  approvedate?: string;
  reporterid: string;
}

function PostReport() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const userLogin = useSelector((state: any) => state.userLogin);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const postReportsData = await getPostReports(userLogin.userInfo.id);
        setReports([...postReportsData]);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false); // Set loading to false when fetch completes or errors
      }
    };

    fetchReports();
  }, []);

  const handleNavigateToChat = (roomID :string) => {
    navigate(`/chat/${roomID}`);
  };

  const handleViewPostDetails = (postid: string) => {
    navigate(`/post/${postid}`, { state: {canApproval: false, canDelete: true, isWaitForPost: false}});
  };

  const handleResolve = async (reportID: string) => {
    try {
      await putUpdateReport({ reportID });
      setReports(prevReports => prevReports.filter(report => report.reportid !== reportID));
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }
  };

  return (
    <Container>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        reports.map((report) => (
          <ReportCard
            key={report.reportid}
            report={report}
            onNavigateToChat={handleNavigateToChat}
            onViewPostDetails={report.postid ? handleViewPostDetails : undefined}
            onResolve={() => handleResolve(report.reportid)}
          />
        ))
      )}
    </Container>
  );
};

export default PostReport;
