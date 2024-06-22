import toast from "react-hot-toast";
import { logoutAction } from "../redux/actions/authActions"
import { AppDispatch, useAppDispatch } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { RiLockPasswordLine, RiLogoutCircleLine } from "react-icons/ri";
import { MenuItem } from "@mui/material";

function Home() {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutAction())
    toast.success('Đăng xuất thành công')
    navigate('login')
  }

  return( 
    <div>
      <h1>Trang home</h1>

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
