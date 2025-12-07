import PivotTableContainer from './components/PivotTableContainer';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Vite Pivot Table Challenge</h1>
        <p>Interactive pivot table using Jspreadsheet</p>
      </header>

      <main className="app-main">
        <PivotTableContainer />
      </main>
    </div>
  );
}

export default App;
