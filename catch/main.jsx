import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // It's okay if you delete this file later, but keep it for now
import { App } from './app.jsx' // Notice the curly braces and lowercase 'a'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)