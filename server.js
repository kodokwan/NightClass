const express = require("express");
const app = express();
const path = require('path');
const mysql = require("mysql2");
const PORT = process.env.port || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const moment = require('moment-timezone');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "bbs",
});

app.use(express.static(path.join(__dirname, 'react-client/build')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'react-client/build/index.html'))
});

// 하루마다 새로운 테이블 생성
cron.schedule('1 0 * * *', () => {
  const tableName = `requested_${moment().tz('Asia/Singapore').format('YYYY_MM_DD')}`.replace(/-/g, '_'); // 날짜를 기반으로 테이블 이름 생성

  console.log(`Creating new table: ${tableName}...`);
  
  const createTableQuery = `
    CREATE TABLE ${tableName} (
      rowno VARCHAR(10) NOT NULL PRIMARY KEY,
      name VARCHAR(255),
      grade INT
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Create table error:', err);
      return;
    }
    console.log(`Table ${tableName} created successfully!`);

    // 기본 데이터 삽입
    const insertQueries = [];
    for (let i = 1; i <= 40; i++) {
      const rowno = `a${i}`;
      const query = `INSERT INTO ${tableName} (rowno, name, grade) VALUES ('${rowno}', 'None_uses', -1);`;
      insertQueries.push(query);
    }

    // 모든 기본 데이터 삽입 쿼리 실행
    insertQueries.forEach(insertQuery => {
      db.query(insertQuery, (err) => {
        if (err) {
          console.error('Insert data error:', err);
        } else {
          console.log(`Inserted into ${tableName}: ${insertQuery}`);
        }
      });
    });
  });
});


app.post("/submit", (req, res) => {
  const context = req.body;
  const tableName = `requested_${moment().tz('Asia/Singapore').format('YYYY_MM_DD')}`.replace(/-/g, '_'); // 현재 날짜에 해당하는 테이블 이름

  console.log(context);

  // 테이블에 데이터를 삽입하는 SQL 쿼리
  const insertQuery = `
    INSERT INTO ${tableName} (rowno, name, grade)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      grade = VALUES(grade);
  `;

  db.query(insertQuery, [context.seatNumber.toLowerCase(), context.name, Number(context.grade.slice(1))], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send("Database insert error");
    }

    console.log('Insert successful!');
    res.send('Success');
  });
});

app.get('/getAllData', (req, res) => {
  const tableName = `requested_${moment().tz('Asia/Singapore').format('YYYY_MM_DD')}`.replace(/-/g, '_'); // 현재 날짜에 해당하는 테이블 이름

  const sqlQuery = `SELECT * FROM ${tableName}`; // 현재 날짜에 해당하는 테이블의 모든 데이터를 조회

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.json(result); // 데이터를 JSON 형식으로 응답
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`running on port ${PORT} Network: http://localhost:8000`);
});
