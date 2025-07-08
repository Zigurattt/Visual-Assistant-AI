import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import MainApp from './components/MainApp';

const App = (): React.JSX.Element => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <MainApp /> : <Auth />;
};

export default App;