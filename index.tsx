import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import { CollectionProvider } from './hooks/useCollection';
import { PdfCollectionProvider } from './hooks/usePdfCollection';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CollectionProvider>
          <PdfCollectionProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </PdfCollectionProvider>
        </CollectionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);