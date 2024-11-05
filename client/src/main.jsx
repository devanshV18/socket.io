import React from 'react'
import ReactDOM from "react-dom/client"
import App from './App.jsx'
import {CssBaseline} from "@mui/material"
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <CssBaseline/>
    <App />
  </>,
)
