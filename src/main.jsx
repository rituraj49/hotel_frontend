import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

// ag grid dependencies
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  AllCommunityModule,
  InfiniteRowModelModule
  // MenuModule,
  // ColumnsToolPanelModule,
  // SetFilterModule,
} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,  
  AllCommunityModule,
  InfiniteRowModelModule
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
