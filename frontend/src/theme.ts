import { blueGrey, cyan, deepOrange, orange } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'


declare module '@mui/material/styles' {
  interface PaletteOptions {
    customColor?: {
      main: string;
      muted: string;
      status: string;
    };
  }
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#321357', // Màu chính ở đây
        },
        secondary: deepOrange,
        customColor: {
          main: '#321357', // Thay đổi mã màu tùy chỉnh của bạn ở đây
          muted: 'rgba(50, 19, 87, 0.1)', // Sử dụng alpha để thêm độ mờ
          status: '#41B06E',
        },
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        background: {
          paper: blueGrey[800],
          default: blueGrey[800]
        }
      }
    }
  }
  // ...other properties
})

export default theme