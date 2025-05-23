const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'rm-t4n55s7c50nax1164uo.mysql.singapore.rds.aliyuncs.com',
  user: 'foodexpress',
  password: 'FoodExpress2024',
  database: 'cake_vending_machine_database'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(cors());
app.use(express.json());

// Helper function to get table name from query parameter
const getTableName = (req) => {
    const tableNumber = req.query.tableNumber;
    if (!tableNumber) {
        throw new Error('tableNumber query parameter is required');
    }
    // Ensure tableNumber is a two-digit number (e.g., 01, 02)
    const formattedNumber = tableNumber.padStart(2, '0');
    return `cake_vending_${formattedNumber}`;
};

app.get('/gettables', (req, res) => {
    const query = 'SHOW TABLES';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err);
            return res.status(500).send('Internal Server Error');
        }

        const tableKey = Object.keys(results[0])[0];
        const tableNames = results
            .map(row => row[tableKey])
            .filter(name => /^cake_vending_\d+$/.test(name)); // Only names ending with numbers

        res.json(tableNames);
    });
});

/** Fetch all data */
app.get('/fetch-data', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Update a specific TypeValue by ID */
app.post('/update-data', (req, res) => {
    try {
        const tableName = getTableName(req);
        const { id, value } = req.body;
        if (!id || !value) return res.status(400).send('ID and value are required.');

        const query = `UPDATE ${tableName} SET TypeValue = ? WHERE ID = ?`;
        db.query(query, [value, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Data updated successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch machine operation variable (Z mm - ID 69) */
app.get('/fetch-operation-variable', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT TypeValue FROM ${tableName} WHERE ID = 69`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(result);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Update machine operation variable (Z mm - ID 69) */
app.post('/update-operation-variable', (req, res) => {
    try {
        const tableName = getTableName(req);
        const { value } = req.body;
        if (!value) return res.status(400).send('Value is required.');
        console.log(value);

        const query = `UPDATE ${tableName} SET TypeValue = ? WHERE ID = 69`;
        db.query(query, [value], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Operation variable updated successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch OPS value (ID 73) */
app.get('/fetch-ops-value', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT TypeValue FROM ${tableName} WHERE ID = 73`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(result);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch test value (ID 85) */
app.get('/fetch-test-value', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT TypeValue FROM ${tableName} WHERE ID = 85`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(result);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Reset test value to 1 (ID 85) */
app.post('/reset-test-value', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `UPDATE ${tableName} SET TypeValue = 1 WHERE ID = 85`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Test value reset to 1 successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Reset OPS value to 0 (ID 73) */
app.post('/reset-ops-value', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `UPDATE ${tableName} SET TypeValue = 0 WHERE ID = 73`;
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('OPS value reset to 0 successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Update OPS value to any value (ID 73) */
app.post('/update-ops-value', (req, res) => {
    try {
        const tableName = getTableName(req);
        const { value } = req.body;
        if (!value) return res.status(400).send('Value is required.');
        const query = `UPDATE ${tableName} SET TypeValue = ? WHERE ID = 73`;
        db.query(query, [value], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('OPS value updated successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch expiry dates (IDs 13-16) */
app.get('/fetch-expiry-dates', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 13 AND 16`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch NEXT stock data (IDs 5-8) */
app.get('/fetch-next-stock', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 5 AND 8`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch product names (IDs 77-80) */
app.get('/fetch-products', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 77 AND 80`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch all stock values (PQ1 to PQ4) */
app.get('/fetch-stock', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 1 AND 4`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch all product prices (PRICE1 to PRICE4) */
app.get('/fetch-prices', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 9 AND 12`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch machine IPs */
app.get('/fetch-machine-ips', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 55 AND 57`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Fetch homing settings */
app.get('/fetch-homing-settings', (req, res) => {
    try {
        const tableName = getTableName(req);
        const query = `SELECT * FROM ${tableName} WHERE ID BETWEEN 64 AND 66`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Update a stock quantity */
app.post('/update-stock', (req, res) => {
    try {
        const tableName = getTableName(req);
        const { id, value } = req.body;
        if (!id || !value) return res.status(400).send('ID and value are required.');

        const query = `UPDATE ${tableName} SET TypeValue = ? WHERE ID = ?`;
        db.query(query, [value, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Stock updated successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/** Update a product price */
app.post('/update-price', (req, res) => {
    try {
        const tableName = getTableName(req);
        const { id, value } = req.body;
        if (!id || !value) return res.status(400).send('ID and value are required.');

        const query = `UPDATE ${tableName} SET TypeValue = ? WHERE ID = ?`;
        db.query(query, [value, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Price updated successfully');
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});