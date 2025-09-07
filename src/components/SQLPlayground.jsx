import { useEffect, useRef, useState } from 'react';
import initSqlJs from 'sql.js';
import { datasets } from '../data/datasets.js';
import { challenges } from '../data/challenges.js';

/*
  Core playground component: in-browser SQLite via sql.js
  Features:
  - Preload tables from datasets
  - SQL editor (textarea) with keyboard shortcuts (Ctrl+Enter to run)
  - Results table with row hover highlight
  - Error display
  - Challenge sidebar: select challenge, run validator, success feedback
*/

function buildCreateAndInsertStatements(dataMap) {
  const statements = [];
  Object.values(dataMap).forEach(ds => {
    const cols = ds.schema.map(c => `${c.name} ${c.type}`).join(', ');
    statements.push(`CREATE TABLE ${ds.name} (${cols});`);
    ds.rows.forEach(r => {
      const colNames = Object.keys(r).join(', ');
      const values = Object.values(r).map(v =>
        v === null || v === undefined ? 'NULL' : typeof v === 'number' ? v : `'${String(v).replace(/'/g, "''")}'`
      ).join(', ');
      statements.push(`INSERT INTO ${ds.name} (${colNames}) VALUES (${values});`);
    });
  });
  return statements.join('\n');
}

const baseSchemaSQL = buildCreateAndInsertStatements(datasets);

export default function SQLPlayground() {
  const [SQL, setSQL] = useState(null);
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM customers;');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeChallenge, setActiveChallenge] = useState(challenges[0]);
  const [challengeStatus, setChallengeStatus] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [tableHighlights, setTableHighlights] = useState({}); // { tableName: Set(ids) }
  const [sandboxMode, setSandboxMode] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` }).then(SQLLib => {
      setSQL(SQLLib);
      const newDb = new SQLLib.Database();
      newDb.run(baseSchemaSQL);
      setDb(newDb);
    });
  }, []);

  function resetDb() {
    if (!SQL) return;
    const newDb = new SQL.Database();
    newDb.run(baseSchemaSQL);
    setDb(newDb);
    setResult(null);
    setError('');
    setChallengeStatus(null);
  }

  function runQuery(customQuery) {
    if (!db) return;
    const q = (customQuery ?? query).trim();
    if (!q) return;
    try {
      const start = performance.now();
      const res = db.exec(q); // array of result sets
      const end = performance.now();
      setExecutionTime((end - start).toFixed(2));
      if (res.length === 0) {
        setResult({ columns: [], rows: [], message: 'Query executed (no result set).' });
      } else {
        // We'll only show first result set for simplicity
        const first = res[0];
        const rows = first.values.map(rowArr => Object.fromEntries(first.columns.map((c, i) => [c, rowArr[i]])));
        setResult({ columns: first.columns, rows });
        deriveHighlights(first, rows, q);
        // Validate if challenge active
        if (!sandboxMode && activeChallenge && /select/i.test(q.split(/\s+/)[0])) {
          const validation = activeChallenge.validator(rows);
          setChallengeStatus({ ...validation, userQuery: q });
        } else {
          setChallengeStatus({ pass: true, message: 'Sandbox mode: Query executed successfully.' });
        }
      }
      setError('');
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  }

  function deriveHighlights(resultSet, rows, q) {
    // Very lightweight parse: if FROM <table> present, highlight that table's PK values found in result rows
    // Also try JOIN <table> patterns to highlight multiple tables
    const lower = q.toLowerCase();
    const candidates = new Set();
    const fromMatch = lower.match(/from\s+([a-zA-Z_][\w]*)/);
    if (fromMatch) candidates.add(fromMatch[1]);
    const joinMatches = [...lower.matchAll(/join\s+([a-zA-Z_][\w]*)/g)];
    joinMatches.forEach(m => candidates.add(m[1]));
    const newHighlights = {};
    candidates.forEach(t => {
      const ds = datasets[t];
      if (!ds || !ds.primaryKey) return;
      const pk = ds.primaryKey;
      const ids = new Set();
      rows.forEach(r => { if (pk in r) ids.add(r[pk]); });
      if (ids.size) newHighlights[t] = ids;
    });
    setTableHighlights(newHighlights);
  }

  function loadChallenge(ch) {
    setActiveChallenge(ch);
    setQuery(ch.starter);
    setChallengeStatus(null);
    textareaRef.current?.focus();
  }

  function giveUpAndShowSolution() {
    if (!activeChallenge) return;
    setQuery(activeChallenge.solution + '\n');
    setChallengeStatus({ pass: false, message: 'Solution loaded. Run it to see results.' });
  }

  function copyExportSQL() {
    navigator.clipboard.writeText(baseSchemaSQL).catch(()=>{});
  }

  return (
    <div className="sql-playground layout">
      <aside className="sidebar">
        <h2>Challenges</h2>
        <ul className="challenge-list">
          {challenges.map(ch => (
            <li key={ch.id} className={ch.id === activeChallenge.id ? 'active' : ''}>
              <button onClick={() => loadChallenge(ch)}>{ch.title}</button>
            </li>
          ))}
        </ul>
        {activeChallenge && (
          <div className="challenge-details">
            <h3>{activeChallenge.title}</h3>
            <p>{activeChallenge.description}</p>
            <div className="hints">
              <details>
                <summary>Hints</summary>
                <ul>{activeChallenge.hints.map((h,i)=><li key={i}>{h}</li>)}</ul>
              </details>
            </div>
            <div className="challenge-actions">
              <button onClick={() => runQuery()}>Run Query</button>
              <button onClick={giveUpAndShowSolution}>Show Solution</button>
              <button onClick={resetDb}>Reset DB</button>
              <button onClick={copyExportSQL}>Copy Schema SQL</button>
              <label className="sandbox-toggle">
                <input
                  type="checkbox"
                  checked={sandboxMode}
                  onChange={() => setSandboxMode(!sandboxMode)}
                />
                Sandbox Mode
              </label>
            </div>
            {challengeStatus && (
              <div className={`challenge-status ${challengeStatus.pass ? 'pass' : 'fail'}`}>
                {challengeStatus.pass ? '✅' : '❌'} {challengeStatus.message}
              </div>
            )}
          </div>
        )}
      </aside>
      <main className="main-panel">
        <section className="editor-section">
          <div className="editor-header">
            <h2>SQL Editor</h2>
            <small>Ctrl+Enter to run</small>
          </div>
          <textarea
            ref={textareaRef}
            className="sql-editor"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runQuery(); }
            }}
            spellCheck={false}
          />
          {error && <div className="error-box">{error}</div>}
        </section>
        <section className="result-section">
          <div className="result-header">
            <h2>Result {executionTime && <span>({executionTime}ms)</span>}</h2>
            {result?.message && <small>{result.message}</small>}
          </div>
          {result && result.columns.length > 0 && (
            <div className="result-table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    {result.columns.map(c => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r,i) => (
                    <tr key={i}>
                      {result.columns.map(c => <td key={c}>{String(r[c])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!result && <div className="placeholder">Run a query to see results.</div>}
          <div className="data-explorer">
            <button className="collapse-toggle" onClick={() => setExplorerOpen(o=>!o)}>
              {explorerOpen ? '▼' : '►'} Data Explorer
            </button>
            {explorerOpen && (
              <div className="explorer-content">
                {Object.values(datasets).map(ds => (
                  <div key={ds.name} className="explorer-table-block">
                    <div className="explorer-table-header">
                      <strong>{ds.name}</strong>
                      <small>rows: {ds.rows.length}</small>
                    </div>
                    <div className="explorer-table-wrapper">
                      <table>
                        <thead>
                          <tr>{Object.keys(ds.rows[0]).map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {ds.rows.slice(0,50).map((row, idx) => {
                            const pk = ds.primaryKey;
                            const highlight = pk && tableHighlights[ds.name]?.has(row[pk]);
                            return (
                              <tr key={idx} className={highlight ? 'hl-row' : ''}>
                                {Object.keys(row).map(k => <td key={k}>{String(row[k])}</td>)}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
  <section className="schema-section">
          <h2>Schema</h2>
          {Object.values(datasets).map(ds => (
            <div key={ds.name} className="schema-block">
              <h3>{ds.name}</h3>
              <table className="schema-table">
                <thead><tr><th>Column</th><th>Type</th></tr></thead>
                <tbody>
                  {ds.schema.map(col => <tr key={col.name}><td>{col.name}</td><td>{col.type}</td></tr>)}
                </tbody>
              </table>
              <details>
                <summary>Preview first rows</summary>
                <table className="preview-table">
                  <thead><tr>{Object.keys(ds.rows[0]).map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {ds.rows.slice(0,3).map((r,i)=>(
                      <tr key={i}>{Object.keys(r).map(k => <td key={k}>{String(r[k])}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
