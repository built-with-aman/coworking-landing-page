import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// @ts-expect-error Vite handles the CSS side-effect import at runtime.
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)