import { Nav } from './Header/Nav';
import { BodyContainer } from './Body/BodyContainer';
import { useState } from 'react';

import './styles.css';
import './skeleton.min.css';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <div className="App">

      <header className="App-header">
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName} setUserName={setUserName}/>
      </header>

      <main>
        <BodyContainer isLoggedIn={isLoggedIn}/>
      </main>

    </div>
  );
}
