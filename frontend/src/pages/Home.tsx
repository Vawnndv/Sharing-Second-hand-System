import toast from "react-hot-toast";
import { logoutAction } from "../redux/actions/authActions"
import { AppDispatch, useAppDispatch } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { RiLockPasswordLine, RiLogoutCircleLine } from "react-icons/ri";
import { MenuItem } from "@mui/material";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";

function Home() {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutAction())
    toast.success('Logged out successfully')
    navigate('login')
  }

  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return( 
    <div style={{marginLeft: '20px', marginTop: '20px'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"
            sx={{
              ".Mui-selected": {
                backgroundColor: 'customColor.muted',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 10,
                fontWeight: 'bold',
              }
            }}
          >
            <Tab label="Bài đăng" value="1" sx={{paddingX: 3}}/>
            <Tab label="Bài trong kho" value="2" sx={{paddingX: 3}} />
          </TabList>
        </Box>
        <TabPanel value="1">
          hello tab 1
        </TabPanel>
        <TabPanel value="2">
          hello tab 2
        </TabPanel>
      </TabContext>

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
        <span
          style={{
            marginLeft: '4px'
          }}
        >
            Profile account
        </span>
      </Link>
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
        <span
          style={{
            marginLeft: '4px'
          }}
        >
          Change password
        </span>
      </Link>
      <MenuItem
        onClick={logoutHandler}
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <RiLogoutCircleLine />
        <span style={{ marginLeft: '4px' }}>
          Log Out
        </span>
      </MenuItem>
    </div>
  )
}

export default Home;
