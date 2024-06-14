import React from 'react';
import { Card, CardContent, Typography, Avatar, IconButton, Button, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { getRoomId } from '../../utils/GetRoomID';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface ReportCardProps {
  report: {
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
  };
  onNavigateToChat: (roomID: string) => void;
  onViewPostDetails?: (postid: string) => void;
  onResolve: () => void;
}

function ReportCard({ report, onNavigateToChat, onViewPostDetails, onResolve }: ReportCardProps) {
  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const userID = userInfo?.id

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Avatar src={report.avatar} alt={`${report.firstname} ${report.lastname}`} />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="h6">{`${report.firstname} ${report.lastname}`}</Typography>
            <Typography variant="body2" color="textSecondary">{report.createdat}</Typography>
          </Box>
          <IconButton onClick={() => {
            if(userID !== undefined)
              onNavigateToChat(getRoomId(userID, report.reporterid))
          }} sx={{ marginLeft: 'auto' }}>
            <ChatIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" paragraph>{report.description}</Typography>
        {report.postid ? (
          <>
            <Typography variant="body2" color="textSecondary">Mã bài đăng: {report.postid}</Typography>
            <Typography variant="body2" color="textSecondary">Thông tin bài đăng: {report.description}</Typography>
            <Button variant="outlined" onClick={() => {
              if (report.postid !== undefined && onViewPostDetails !== undefined)
                onViewPostDetails(report.postid)
            }} sx={{ mr: 3, my: 1 }}>Xem chi tiết bài đăng</Button>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mr: 3, my: 1 }}>Mã người dùng: {report.userid}</Typography>
        )}
        <Button variant="outlined" color="secondary" onClick={onResolve}>Đã giải quyết</Button>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
