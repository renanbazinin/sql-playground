// SQL practice challenges definition
// Each challenge: id, title, description, starter, solution, tables (subset to highlight), hints (array), validator(resultRows) => {pass, message}

export const challenges = [
  {
    id: 'c1',
    title: 'Select All Customers',
    description: 'List every customer with all columns.',
    starter: 'SELECT * FROM customers;\n',
    solution: 'SELECT * FROM customers;',
    tables: ['customers'],
    hints: ['Use SELECT *', 'Target the customers table'],
    validator: rows => {
      if (!Array.isArray(rows)) return { pass: false, message: 'No result rows.' };
      return rows.length >= 5 ? { pass: true, message: 'Returned all customers.' } : { pass: false, message: 'Should return 5 rows.' };
    }
  },
  {
    id: 'c2',
    title: 'Active Customers Only',
    description: 'Return id, name & status for active customers (status = active).',
    starter: 'SELECT customer_id, full_name, status FROM customers WHERE status = "active";\n',
    solution: 'SELECT customer_id, full_name, status FROM customers WHERE status = "active";',
    tables: ['customers'],
    hints: ['Filter with WHERE status = "active"'],
    validator: rows => {
      if (!rows) return { pass: false, message: 'No rows.' };
      const allActive = rows.every(r => r.status === 'active');
      return allActive ? { pass: true, message: 'All rows active.' } : { pass: false, message: 'Found a non-active row.' };
    }
  },
  {
    id: 'c3',
    title: 'Total Order Amounts > 100',
    description: 'Show order_id, customer_id, total_amount for orders over 100, highest first.',
    starter: 'SELECT order_id, customer_id, total_amount FROM orders WHERE total_amount > 100 ORDER BY total_amount DESC;\n',
    solution: 'SELECT order_id, customer_id, total_amount FROM orders WHERE total_amount > 100 ORDER BY total_amount DESC;',
    tables: ['orders'],
    hints: ['WHERE total_amount > 100', 'Sort with ORDER BY total_amount DESC'],
    validator: rows => {
      if (!rows) return { pass: false, message: 'No rows.' };
      const condition = rows.every(r => r.total_amount > 100);
      return condition ? { pass: true, message: 'All amounts > 100.' } : { pass: false, message: 'Some amounts not > 100.' };
    }
  },
  {
    id: 'c4',
    title: 'Join Orders with Customers',
    description: 'List order_id, full_name, total_amount by joining orders and customers.',
    starter: 'SELECT o.order_id, c.full_name, o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id;\n',
    solution: 'SELECT o.order_id, c.full_name, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.customer_id;',
    tables: ['orders', 'customers'],
    hints: ['Use JOIN on customer_id'],
    validator: rows => {
      if (!rows) return { pass: false, message: 'No rows.' };
      const hasCols = rows.length && 'full_name' in rows[0];
      return hasCols ? { pass: true, message: 'Join succeeded.' } : { pass: false, message: 'Missing full_name column.' };
    }
  },
  {
    id: 'c5',
    title: 'Order Item Revenue',
    description: 'Compute per order_id extended revenue (sum quantity*unit_price).',
    starter: 'SELECT order_id, SUM(quantity * unit_price) AS revenue\nFROM order_items\nGROUP BY order_id;\n',
    solution: 'SELECT order_id, SUM(quantity * unit_price) AS revenue FROM order_items GROUP BY order_id;',
    tables: ['order_items'],
    hints: ['Use SUM(quantity * unit_price)', 'GROUP BY order_id'],
    validator: rows => {
      if (!rows) return { pass: false, message: 'No rows.' };
      const hasRevenue = rows.every(r => typeof r.revenue === 'number');
      return hasRevenue ? { pass: true, message: 'Revenue computed.' } : { pass: false, message: 'Missing revenue alias.' };
    }
  }
  ,
  {
    id: 'c6',
    title: 'LEFT JOIN: Customers with Orders',
    description: 'Show all customers and their latest order amount if present (NULL when no order).',
    starter: 'SELECT c.customer_id, c.full_name, o.total_amount\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.customer_id;\n',
    solution: 'SELECT c.customer_id, c.full_name, o.total_amount FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id;',
    tables: ['customers','orders'],
    hints: ['LEFT JOIN keeps all rows from the left table', 'Match on c.customer_id = o.customer_id'],
    validator: rows => {
      if (!rows) return { pass:false, message:'No rows.' };
      const hasAllCustomers = rows.some(r => r.customer_id === 11) && rows.some(r => r.customer_id === 8);
      return hasAllCustomers ? { pass:true, message:'All customers preserved.' } : { pass:false, message:'Left side not fully preserved.' };
    }
  },
  {
    id: 'c7',
    title: 'RIGHT JOIN concept via LEFT JOIN swap',
    description: 'SQLite has no RIGHT JOIN, but RIGHT JOIN Orders→Customers is equivalent to LEFT JOIN Customers←Orders by swapping tables.',
    starter: '-- RIGHT JOIN orders o RIGHT JOIN customers c ON ...\n-- In SQLite use LEFT JOIN by swapping: show all orders and customer name if found.\nSELECT o.order_id, o.customer_id, c.full_name\nFROM orders o\nLEFT JOIN customers c ON c.customer_id = o.customer_id;\n',
    solution: 'SELECT o.order_id, o.customer_id, c.full_name FROM orders o LEFT JOIN customers c ON c.customer_id = o.customer_id;',
    tables: ['orders','customers'],
    hints: ['To simulate RIGHT JOIN, invert tables and use LEFT JOIN'],
    validator: rows => {
      if (!rows) return { pass:false, message:'No rows.' };
      const hasOrphan = rows.some(r => r.order_id === 115 && r.full_name == null);
      return hasOrphan ? { pass:true, message:'Orders preserved (including orphan).' } : { pass:false, message:'Should include order 115 with NULL customer.' };
    }
  }
  ,
  {
    id: 'c8',
    title: 'ROW_NUMBER per Customer',
    description: 'Assign a sequential row number to each order per customer based on order_date.',
    starter: 'SELECT customer_id, order_id, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn\nFROM orders;\n',
    solution: 'SELECT customer_id, order_id, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn FROM orders;',
    tables: ['orders'],
    hints: ['Use ROW_NUMBER()','PARTITION BY customer_id','ORDER BY order_date'],
    validator: rows => {
      if (!rows) return { pass:false, message:'No rows.' };
      // Check that first row per customer has rn=1
      const firstRNs = {};
      rows.forEach(r => {
        if (!(r.customer_id in firstRNs) && r.rn === 1) firstRNs[r.customer_id] = true;
      });
      const distinctCustomers = [...new Set(rows.map(r => r.customer_id))];
      const ok = distinctCustomers.every(cid => firstRNs[cid]);
      return ok ? { pass:true, message:'ROW_NUMBER starts at 1 for each customer.' } : { pass:false, message:'First rn should be 1 for each customer.' };
    }
  }
  ,
  {
    id: 'c9',
    title: 'Cumulative Total per Customer',
    description: 'Compute running total of order amounts per customer ordered by date.',
    starter: 'SELECT customer_id, order_date, total_amount,\n  SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_total\nFROM orders;\n',
    solution: 'SELECT customer_id, order_date, total_amount, SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_total FROM orders;',
    tables: ['orders'],
    hints: ['Use SUM() OVER','PARTITION BY customer_id','ORDER BY order_date'],
    validator: rows => {
      if (!rows) return { pass:false, message:'No rows.' };
      // For each customer, cumulative_total should be non-decreasing and last cumulative_total equals sum of that customer's total_amounts
      const grouped = rows.reduce((acc, r) => {
        acc[r.customer_id] = acc[r.customer_id] || [];
        acc[r.customer_id].push(r);
        return acc;
      }, {});
      for (const cid in grouped) {
        const arr = grouped[cid];
        let running = 0;
        for (const r of arr) {
          if (r.cumulative_total < running) return { pass:false, message:`cumulative_total decreased for customer ${cid}` };
          running += r.total_amount;
        }
        if (running !== arr[arr.length-1].cumulative_total) return { pass:false, message:`Final cumulative_total incorrect for customer ${cid}` };
      }
      return { pass:true, message:'Cumulative totals are correct per customer.' };
    }
  }
]; // end of challenges array
