import { blueGrey, cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
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