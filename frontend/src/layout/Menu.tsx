/* eslint-disable jsx-a11y/control-has-associated-label */
import { Avatar, Stack, Typography } from '@mui/material';
// import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PageviewIcon from '@mui/icons-material/Pageview';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Groups2Icon from '@mui/icons-material/Groups2';
// import MenuIcon from '@mui/icons-material/Menu';
import './styles.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
// import { handleClickMenu } from '../redux/actions/menuActions';

function Menu({index, setIndex}: any) {
    // const [isShowMenu, setIsShowMenu] = useState(false)
    const isOpenMenu = useSelector((state: RootState) => state.handleClickMenu)

    const navigate = useNavigate()

    const userLogin = useSelector((state: any) => state.userLogin);

    return ( 
        <div>
            {
                userLogin.roleID === 2 ?
                <Stack direction="column" spacing={1} className={`menu ${isOpenMenu && 'hidden'}`}>
  
                    <Stack direction="row" alignItems="center" spacing={1} style={{paddingLeft: "20px", cursor: 'pointer'}}>
                        <Avatar alt="Remy Sharp" src="https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg" style={{marginRight: "20px"}}/>
                        <Typography variant="body1" sx={{fontWeight: 'bold', color: 'rgb(50,19,87)'}}>
                            John
                        </Typography>
                    </Stack>

                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 0 ? 'tabSelected' : 'tab'}
                        component='div'
                        onClick={() => {setIndex(0); navigate('/')}}
                        >
                        <HomeIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Trang chủ
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 1 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(1); navigate('/statistic')}}
                        >
                        <StackedLineChartIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Thống kê
                        </Typography>
                    </Stack>
                    
                
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 2 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(2); navigate('/order')}}
                        >
                        <ContentPasteSearchIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Tình trạng món hàng
                        </Typography>
                    </Stack>
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 3 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(3); navigate('/history')}}
                        >
                        <WorkHistoryIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Lịch sử giao dịch
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 4 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(4); navigate('/posts')}}
                        >
                        <ArticleIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Bài viết
                        </Typography>
                    </Stack>
                    
                
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 5 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(5); navigate('/approval')}}
                        >
                        <AssignmentTurnedInIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Duyệt bài
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 6 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(6); navigate('/inventory')}}
                        >
                        <PageviewIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Quản lý nhập xuất
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 7 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(7); navigate('/report')}}
                        >
                        <ReportGmailerrorredIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Tố cáo/Báo cáo
                        </Typography>
                    </Stack>
                
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 8 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(8); navigate('/chat')}}
                        >
                        <ContactPageIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Liên hệ người dùng
                        </Typography>
                    </Stack>
                    
                    
                </Stack>
                :
                <Stack direction="column" spacing={1} className={`menu ${isOpenMenu && 'hidden'}`}>
  
                    <Stack direction="row" alignItems="center" spacing={1} style={{paddingLeft: "20px", cursor: 'pointer'}}>
                        <Avatar alt="Remy Sharp" src="https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg" style={{marginRight: "20px"}}/>
                        <Typography variant="body1" sx={{fontWeight: 'bold', color: 'rgb(50,19,87)'}}>
                            John
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={0} 
                        className={index === 0 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(0); navigate('/statistic')}}
                        >
                        <StackedLineChartIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Thống kê
                        </Typography>
                    </Stack>
                    
                
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 1 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(1); navigate('/users')}}
                        >
                        <Groups2Icon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Quản lý cộng tác viên
                        </Typography>
                    </Stack>
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 2 ? 'tabSelected' : 'tab'} 
                        component='div'
                        // onClick={() => {setIndex(2); navigate('/history')}}
                        >
                        <WarehouseIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Quản lý kho
                        </Typography>
                    </Stack>
                    
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 3 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(3); navigate('/collaborators')}}
                        >
                        <ManageAccountsIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Quản lý người dùng
                        </Typography>
                    </Stack>
                    
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className={index === 4 ? 'tabSelected' : 'tab'} 
                        component='div'
                        onClick={() => {setIndex(4); navigate('/chat')}}
                        >
                        <ContactPageIcon className='icon'/>
                        <Typography variant="body1" component="h2" className='text'>
                            Liên hệ
                        </Typography>
                    </Stack>
                    
                    
                </Stack>
            }
            
        </div>
        
     );
}

export default Menu;