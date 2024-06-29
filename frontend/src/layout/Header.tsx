/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import { Avatar, InputAdornment, InputLabel, Popover, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FilledInput from '@mui/material/FilledInput'
import logo from '../assets/Retreasure_Icon_Header.svg'
import logo_title from '../assets/Retreasure_Icon_Title.svg'
import { useDispatch, useSelector } from 'react-redux'
import { handleClickMenu } from '../redux/actions/menuActions';
import { FiSettings } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { RiLockPasswordLine, RiLogoutCircleLine } from 'react-icons/ri'
import { AppDispatch, RootState, useAppDispatch } from '../redux/store'
import toast from 'react-hot-toast'
import { logoutAction } from '../redux/actions/authActions'
import Notification from '../components/notification/Notification'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'

export default function Header({setIndex}: any) {
  const MyDispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector( (state: RootState) => state.userLogin);

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [isNoti, setIsNoti] = React.useState (false)
  const [anchorElNoti, setAnchorElNoti] = React.useState(null)

  const [unreadNotificationCount, setUnreadNotificationCount] = React.useState<number>(0);

  // Hàm đếm số lượng tài liệu trong sub-collection "notification" của collection "receivers" với điều kiện isRead là false
  const countUnreadNotifications = (receiverId: string, callback: (count: number) => void) => {
    const docRef = doc(db, "receivers", receiverId);
    const notificationsRef = collection(docRef, "notification");

    // Tạo query với điều kiện isRead là false
    const q = query(notificationsRef, where("isRead", "==", false));

    // Thiết lập listener để lắng nghe các thay đổi
    const unsubscribe = onSnapshot(q, (snapshot: { size: number }) => {
      const count = snapshot.size;
      callback(count);
    });

    return unsubscribe;
  };
  
  React.useEffect(() => {
    if (!userInfo?.id) return;
    // Thiết lập listener và lưu hàm hủy đăng ký
    const unsubscribe = countUnreadNotifications(userInfo?.id.toString(), (count) => {
      setUnreadNotificationCount(count);
    });

    // Hủy đăng ký listener khi component unmount
    // eslint-disable-next-line consistent-return
    return () => unsubscribe();
  }, [userInfo?.id]);

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  
  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleClickNotification = () => {
    setIsNoti(!isNoti)
  }

  const handleClickAncorEl = (e: any) => {
    setAnchorElNoti(e.target)
    handleClickNotification()
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const logoutHandler = () => {
    MyDispatch(logoutAction())
    toast.success('Đã đăng xuất thành công')
    navigate('/login')
  }


  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link
          to={`/profile?profileID=${userInfo?.id}`}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            color: 'inherit'
          }}
        >
          <FiSettings />
          <Typography
            style={{
              marginLeft: '4px'
            }}
          >
              Thông tin
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
      <Link
        to='/password'
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          color: 'inherit'
        }}
      >
        <RiLockPasswordLine />
        <Typography
          style={{
            marginLeft: '4px'
          }}
        >
          Đổi mật khẩu
        </Typography>
      </Link>
      </MenuItem>
      <MenuItem
        onClick={logoutHandler}
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <RiLogoutCircleLine />
        <Typography style={{ marginLeft: '4px' }}>
          Đăng xuất
        </Typography>
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge badgeContent={unreadNotificationCount} color="error">
            <NotificationsIcon onClick={( e ) => handleClickAncorEl( e ) }/>
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <Popover
        anchorEl={anchorElNoti}
        open={isNoti}
        onClose={handleClickNotification}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Notification/>
      </Popover>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="Remy Sharp" src={`${userInfo?.avatar ? userInfo?.avatar : "https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg"}`} style={{marginRight: "20px"}}/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )
  
  const dispatch = useDispatch()
  const handleSetMenu = () => {
      dispatch(handleClickMenu())
  }

  const handleNavigateToHome = () => {
    setIndex(0)
    navigate('/')
  }
  return (
    <Box sx={{ flexGrow: 1}} id='header'>
      <AppBar position="static">
        <Toolbar style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => handleSetMenu()}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            component="div"
            sx={{ display: { xs: 'none', sm: 'flex' }}}
            onClick={() => handleNavigateToHome()}
          >
            <img alt='logo' src={logo} style={{width: '40px', height: '40px', color: 'white', borderRadius: 10}}/>
            <img alt='logo' src={logo_title} style={{width: '150px', height: '50px', color: 'white', borderRadius: 10}}/>
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', gap: 2 } }}>
            <Typography>Hi, {userInfo?.firstName}</Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(e) => handleProfileMenuOpen(e)}
              color="inherit"
            >
              <Avatar alt="Remy Sharp" src={`${userInfo?.avatar ? userInfo?.avatar : "https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg"}`} style={{marginRight: "20px"}}/>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={unreadNotificationCount} color="error">
                <NotificationsIcon onClick={( e ) => handleClickAncorEl( e ) }/>
              </Badge>
            </IconButton>
            <Popover
              anchorEl={anchorElNoti}
              open={isNoti}
              onClose={handleClickNotification}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <Notification/>
            </Popover>
            
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={(e) => handleMobileMenuOpen(e)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}