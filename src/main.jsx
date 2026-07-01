import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './hero-compact.css';

const container = document.getElementById('root');
createRoot(container).render(<React.StrictMode><App /></React.StrictMode>);
