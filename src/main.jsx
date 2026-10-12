// main.jsx — the entry point: puts the React app on the page.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import UpdatePrompt from './UpdatePrompt.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Shows a "new version available" banner after a deploy */}
    <UpdatePrompt />
  </StrictMode>
);
