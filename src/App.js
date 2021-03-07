import Nav from './Header/Nav.js';
import BodyContainer from './Body/BodyContainer.js';
import { useState } from 'react';

import './styles.css';
import './skeleton.min.css';

const App = () => {
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

export default App;
