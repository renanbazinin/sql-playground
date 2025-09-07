// Sample in-memory datasets (could also be loaded from CSV/JSON dynamically)
// Each dataset has: name, schema (array of column definitions), rows (array of objects)

export const datasets = {
  customers: {
    name: 'customers',
    primaryKey: 'customer_id',
    schema: [
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'full_name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
      { name: 'status', type: 'TEXT' }
    ],
    rows: [
      { customer_id: 1, full_name: 'Alice Johnson', email: 'alice@example.com', phone: '555-1111', created_at: '2024-01-05', status: 'active' },
      { customer_id: 2, full_name: 'Bob Smith', email: 'bob@example.com', phone: '555-2222', created_at: '2024-02-12', status: 'active' },
      { customer_id: 3, full_name: 'Catherine Green', email: 'cat@example.com', phone: '555-3333', created_at: '2024-03-18', status: 'inactive' },
      { customer_id: 4, full_name: 'David Brown', email: 'david@example.com', phone: '555-4444', created_at: '2024-03-21', status: 'active' },
  { customer_id: 5, full_name: 'Emily Davis', email: 'emily@example.com', phone: '555-5555', created_at: '2024-04-02', status: 'active' },
  { customer_id: 6, full_name: 'Frank Moore', email: 'frank@example.com', phone: '555-6666', created_at: '2024-04-15', status: 'active' },
  { customer_id: 7, full_name: 'Grace Lee', email: 'grace@example.com', phone: '555-7777', created_at: '2024-04-28', status: 'active' },
  { customer_id: 8, full_name: 'Henry King', email: 'henry@example.com', phone: '555-8888', created_at: '2024-05-06', status: 'inactive' },
  { customer_id: 9, full_name: 'Irene Chen', email: 'irene@example.com', phone: '555-9999', created_at: '2024-05-18', status: 'active' },
  { customer_id: 10, full_name: 'Jack Wilson', email: 'jack@example.com', phone: '555-1010', created_at: '2024-06-01', status: 'active' },
  { customer_id: 11, full_name: 'Karen Taylor', email: 'karen@example.com', phone: '555-1112', created_at: '2024-06-09', status: 'inactive' },
  { customer_id: 12, full_name: 'Leo Martinez', email: 'leo@example.com', phone: '555-1212', created_at: '2024-06-22', status: 'active' }
    ]
  },
  orders: {
    name: 'orders',
    primaryKey: 'order_id',
    schema: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'order_date', type: 'TEXT' },
      { name: 'total_amount', type: 'REAL' },
      { name: 'status', type: 'TEXT' }
    ],
    rows: [
      { order_id: 101, customer_id: 1, order_date: '2024-04-10', total_amount: 120.5, status: 'paid' },
      { order_id: 102, customer_id: 2, order_date: '2024-04-11', total_amount: 89.99, status: 'paid' },
      { order_id: 103, customer_id: 1, order_date: '2024-04-15', total_amount: 42.0, status: 'pending' },
      { order_id: 104, customer_id: 3, order_date: '2024-04-17', total_amount: 300.0, status: 'paid' },
  { order_id: 105, customer_id: 4, order_date: '2024-04-20', total_amount: 15.75, status: 'refunded' },
  { order_id: 106, customer_id: 6, order_date: '2024-05-03', total_amount: 210.0, status: 'paid' },
  { order_id: 107, customer_id: 7, order_date: '2024-05-05', total_amount: 55.25, status: 'paid' },
  { order_id: 108, customer_id: 7, order_date: '2024-05-07', total_amount: 78.1, status: 'pending' },
  { order_id: 109, customer_id: 9, order_date: '2024-05-19', total_amount: 145.0, status: 'paid' },
  { order_id: 110, customer_id: 10, order_date: '2024-06-02', total_amount: 19.99, status: 'paid' },
  { order_id: 111, customer_id: 10, order_date: '2024-06-13', total_amount: 240.0, status: 'paid' },
  { order_id: 112, customer_id: 12, order_date: '2024-06-25', total_amount: 400.0, status: 'pending' },
  { order_id: 113, customer_id: 12, order_date: '2024-06-28', total_amount: 32.5, status: 'paid' },
  { order_id: 114, customer_id: 8, order_date: '2024-07-01', total_amount: 60.0, status: 'paid' },
  { order_id: 115, customer_id: 999, order_date: '2024-07-05', total_amount: 75.0, status: 'paid' } // orphan for RIGHT JOIN illustration
    ]
  },
  order_items: {
    name: 'order_items',
    // composite logical key (order_id + product_id) not used for highlight currently
    schema: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'product_id', type: 'INTEGER' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'REAL' }
    ],
    rows: [
      { order_id: 101, product_id: 1001, quantity: 2, unit_price: 40.00 },
      { order_id: 101, product_id: 1002, quantity: 1, unit_price: 40.50 },
      { order_id: 102, product_id: 1003, quantity: 3, unit_price: 30.00 },
      { order_id: 103, product_id: 1001, quantity: 1, unit_price: 40.00 },
      { order_id: 104, product_id: 1004, quantity: 5, unit_price: 60.00 },
      { order_id: 105, product_id: 1002, quantity: 1, unit_price: 40.50 }
    ]
  },
  products: {
    name: 'products',
    primaryKey: 'product_id',
    schema: [
      { name: 'product_id', type: 'INTEGER' },
      { name: 'sku', type: 'TEXT' },
      { name: 'product_name', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'active', type: 'INTEGER' }
    ],
    rows: [
      { product_id: 1001, sku: 'SKU-RED-TSHIRT', product_name: 'Red T-Shirt', category: 'apparel', active: 1 },
      { product_id: 1002, sku: 'SKU-BLUE-MUG', product_name: 'Blue Coffee Mug', category: 'kitchen', active: 1 },
      { product_id: 1003, sku: 'SKU-WHITE-NOTE', product_name: 'Notebook', category: 'stationery', active: 1 },
      { product_id: 1004, sku: 'SKU-BLK-HOOD', product_name: 'Black Hoodie', category: 'apparel', active: 0 }
    ]
  },
  payments: {
    name: 'payments',
    primaryKey: 'payment_id',
    schema: [
      { name: 'payment_id', type: 'INTEGER' },
      { name: 'order_id', type: 'INTEGER' },
      { name: 'paid_at', type: 'TEXT' },
      { name: 'amount', type: 'REAL' },
      { name: 'method', type: 'TEXT' }
    ],
    rows: [
      { payment_id: 5001, order_id: 101, paid_at: '2024-04-10 10:15', amount: 120.5, method: 'card' },
      { payment_id: 5002, order_id: 102, paid_at: '2024-04-11 09:00', amount: 89.99, method: 'paypal' },
      { payment_id: 5003, order_id: 104, paid_at: '2024-04-17 16:30', amount: 300.0, method: 'card' }
    ]
  }
};

export function datasetNames() { return Object.keys(datasets); }
