import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import Mapping from './components/Mapping'
import theme from './styles/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Mapping />
      </MuiThemeProvider>
    </>
  )
}

export default App
