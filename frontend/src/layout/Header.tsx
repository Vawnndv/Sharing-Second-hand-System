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
import { Avatar, InputAdornment, InputLabel, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FilledInput from '@mui/material/FilledInput'
import logo from '../assets/logo.png'
import { useDispatch } from 'react-redux'
import { handleClickMenu } from '../redux/actions/menuActions';
import { FiSettings } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { RiLockPasswordLine, RiLogoutCircleLine } from 'react-icons/ri'
import { AppDispatch, useAppDispatch } from '../redux/store'
import toast from 'react-hot-toast'
import { logoutAction } from '../redux/actions/authActions'
// import { useDispatch } from 'react-redux'
// import { handleClickMenu } from '../redux/actions/menuActions'


export default function Header({setIndex}: any) {
  
  const MyDispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const logoutHandler = () => {
    MyDispatch(logoutAction())
    toast.success('Logged out successfully')
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
          to='/profile'
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
              Profile account
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
          Change password
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
          Log Out
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
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="Remy Sharp" src="https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg" style={{marginRight: "20px"}}/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )
  
  const dispatch = useDispatch()
  const handleSetMenu = () => {
      dispatch(handleClickMenu())
  }
//   console.log(isOpenMenu)

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
            <img alt='logo' src={logo} style={{width: '80px', height: '60px', color: 'white'}}/>
          </IconButton>
          <FormControl sx={{ m: 1, width: '35ch', borderRadius: 2,
            transition: 'width 3s ease', // Thêm transition cho hiệu ứng mở rộng
            '&:focus-within': {
              width: '60ch', // Kích thước mới khi focus
              backgroundColor: 'rgb(128, 52, 156)',
              color: 'rgb(236, 236, 236)'
            },
          }} className='search' variant="filled">
            <InputLabel htmlFor="filled-adornment-password" className='text'>Tìm kiếm</InputLabel>
            <FilledInput
                id="filled-adornment-password"
                type='text'
                
                endAdornment={
                <InputAdornment position="end">
                    <SearchIcon className='text'/>
                </InputAdornment>
                }
            />
          </FormControl>
           {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(e) => handleProfileMenuOpen(e)}
              color="inherit"
            >
              <Avatar alt="Remy Sharp" src="https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg" style={{marginRight: "20px"}}/>
            </IconButton>
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