import { createTheme,ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#F6F3EC',
      main: "#660000",
      contrastText: "#F6F3EC",
    },
    secondary: {
      light: "rgba(102, 0, 0, 0.3)",
      main: "rgba(102, 0, 0, 0.5)",
      contrastText: '#F6F3EC',
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme} >
      <Component {...pageProps} theme={theme}/>
    </ThemeProvider>
  )
}

