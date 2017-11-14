import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import querystring from 'querystring'
import { cyan500 } from 'material-ui/styles/colors'

var searchParams = new URLSearchParams(window.location.search);
console.log('querystring', searchParams.get('event'))

const theme = searchParams.get('theme') === 'dark' ? darkBaseTheme : lightBaseTheme

const brandColor = searchParams.get('brand-color')
if (brandColor) {
  theme.palette.primary1Color = `#${ searchParams.get('brand-color') }`
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={ getMuiTheme(theme) }>
    <App event={ searchParams.get('event') } />
  </MuiThemeProvider>,
  document.getElementById('root')
)
registerServiceWorker()
