import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import Mapping from './Components/Mapping'
import theme from './styles/theme'

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Mapping />
    </MuiThemeProvider>
  )
}

export default App
