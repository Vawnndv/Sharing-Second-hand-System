import { Avatar } from '@mui/material'

interface Props {
    avatar?: string;
    username?: string;
    onClick?: (event: any) => void;
    size?: number;
}

function AvatarComponent(props: Props) {
  const {avatar, username, onClick, size} = props;

  return  avatar ? ( 
    <Avatar src={avatar} onClick={onClick} alt="Avatar" sx={{width: size, height: size}}/> 
  ) : username ? (
    <Avatar sx={{ bgcolor: '#321357', width: size, height: size, fontSize: size ? size / 2.5 : 16}} onClick={onClick} alt="Avatar">{username.substring(0, 1).toLocaleUpperCase()}</Avatar>
  ) : (
    <Avatar onClick={onClick} alt="Avatar" sx={{width: size, height: size}}/> 
  )
}

export default AvatarComponent