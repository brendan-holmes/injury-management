import Nav from './Nav.js';
import Diagram from './Diagram.js';
import Form from './Form.js';
import './styles.css';
import './skeleton.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Nav />
      </header>
      <main>
        <Diagram />
        <Form />
      </main>
    </div>
  );
}

export default App;
