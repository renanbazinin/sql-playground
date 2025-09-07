
Try now:
https://renanbazinin.github.io/sql-playground/

## SQL Practice Playground

In-browser interactive SQL learning environment (React + Vite + sql.js). No backend required: the entire database is an in-memory SQLite instance compiled to WebAssembly.

### Features
* Preloaded e-commerce style dataset (customers, orders, order_items, products, payments)
* Challenge list with starter queries, hints, solution reveal
* Instant query execution (Ctrl+Enter)
* Execution timing + basic validation per challenge
* Schema panel with column types & sample rows
* Copy full schema/seed SQL for offline practice
* Safe reset of database to original seed


### Adding New Challenges (only while working local)
Edit `src/data/challenges.js` and append a new object:
```
{
	id: 'c6',
	title: 'My Challenge',
	description: 'Explain goal',
	starter: 'SELECT ...',
	solution: 'SELECT ...',
	tables: ['customers'],
	hints: ['Hint 1','Hint 2'],
	validator: rows => ({ pass: true, message: 'Great!' })
}
```


### Other options for the future
* Persistent saved queries in localStorage
* Multi-result-set display
* Richer validation (row set diffs)
* Syntax highlighting (Monaco / CodeMirror)
* Query history panel
* Dark mode toggle

