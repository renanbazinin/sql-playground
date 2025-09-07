import './App.css';
import SQLPlayground from './components/SQLPlayground.jsx';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SQL Practice Playground</h1>
        <p className="tagline">Practice SQL queries in your browser with instant feedback.</p>
      </header>
      <SQLPlayground />
      <footer className="app-footer">
        <p>In-browser SQLite (sql.js) • No backend • Learning-focused UX</p>
      </footer>
    </div>
  );
}
