const express=require('express');
const app=express();
const port=8000;
const cors=require('cors'); //middleware
app.use(cors());
const path=require('path');
const mysql=require('mysql2');
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret_key';
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.json()); //middle ware for parsing JSON in req body

app.listen(port,()=>{
    console.log("your server is running");

});

require('dotenv').config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  allowPublicKeyRetrieval: true,
     ssl: false
});
db.connect((err)=>
{
    if(err)
    {
        console.log("Error at connection",err)
        return
    }
    console.log("sucessully connected");
})

app.get('/',(req,res)=>
{
    res.render("Register");
});
app.get('/login', (req, res) => {
  res.render('login'); 
});


app.get('/register', (req, res) => {
  res.render('Register');
});

app.post('/register', (req, res) => {
  const { farmername, phonenumber, password, land, income, investment } = req.body;

  const query = `INSERT INTO person (farmername, phonenumber, password, land, income, investment)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [farmername, phonenumber, password, land, income, investment], (err, result) => {
    if (err) {
        console.error("Database error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Phone number already exists' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Success' });
  });
});

app.get('/api/farmers', (req, res) => {
  db.query('SELECT * FROM person', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
app.get('/api/farmers/:id', (req, res) => {
  db.query('SELECT * FROM person WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Farmer not found' });
    res.json(results[0]);
  });
});
app.put('/api/farmers/:id', (req, res) => {
  const { farmername, phonenumber, land, income, investment } = req.body;
  const query = `UPDATE person SET farmername=?, phonenumber=?,password=?,land=?, income=?, investment=? WHERE id=?`;
  db.query(query, [farmername, phonenumber,password, land, income, investment, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Farmer updated' });
  });
});
app.delete('/api/farmers/:id', (req, res) => {
  db.query('DELETE FROM person WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Farmer deleted' });
  });
});





// Example "users" table: id | username | password
app.post('/login', (req, res) => {
  const { farmername, password } = req.body;

  db.query('SELECT * FROM person WHERE farmername = ? AND password = ?', [farmername, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'error' });
    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found or incorrect password' });
    }
    const user = results[0];
    const token = jwt.sign({ id: user.id, farmername: user.farmername }, secret, { expiresIn: '1h' });
    res.json({ token });
  });
});
