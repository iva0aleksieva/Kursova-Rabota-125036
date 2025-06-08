import express from 'express';
import cors from 'cors';
import XLSX from 'xlsx';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // for parsing JSON POST requests

//returns a json of the first sheet
app.get('/read-excel-users', (req, res) => {
    const workbook = XLSX.readFile('./src/account-data.xlsx');
    const sheetNames = workbook.SheetNames;
    const accountDataSheet = workbook.Sheets[sheetNames[0]];

    const accountDataJson = XLSX.utils.sheet_to_json(accountDataSheet);
    res.json(accountDataJson);
});

//returns a json of the second sheet
app.get('/read-excel-books', (req, res) => {
    const workbook = XLSX.readFile('./src/account-data.xlsx');
    const sheetNames = workbook.SheetNames;
    const listDataSheet = workbook.Sheets[sheetNames[1]];

    const listDataJson = XLSX.utils.sheet_to_json(listDataSheet);
    res.json(listDataJson);
});

//adds a record for a new user
app.post('/add-row-users', (req, res) => {
    const newRow = req.body;

    const workbook = XLSX.readFile('./src/account-data.xlsx');
    const sheetNames = workbook.SheetNames;
    const accountDataSheet = workbook.Sheets[sheetNames[0]];

    XLSX.utils.sheet_add_json(accountDataSheet, [newRow], { skipHeader: true, origin: -1 });

    XLSX.writeFile(workbook, './src/account-data.xlsx');
    res.json({ status: 'success' });
});

//adds a new book for a user
app.post('/add-row-books', (req, res) => {
    const newRow = req.body;

    const workbook = XLSX.readFile('./src/account-data.xlsx');
    const sheetNames = workbook.SheetNames;
    const listDataSheet = workbook.Sheets[sheetNames[1]];

    XLSX.utils.sheet_add_json(listDataSheet, [newRow], { skipHeader: true, origin: -1 });

    XLSX.writeFile(workbook, './src/account-data.xlsx');
    res.json({ status: 'success' });
});

//removes a book record
app.post('/remove-row-books', (req, res) => {
    const rowToRemove = req.body;

    const workbook = XLSX.readFile('./src/account-data.xlsx');
    const sheetNames = workbook.SheetNames;
    const listDataSheet = workbook.Sheets[sheetNames[1]];

    let data = XLSX.utils.sheet_to_json(listDataSheet);

    data = data.filter(record =>
        (String(record.ReaderID).trim() == String(rowToRemove.ReaderID).trim() &&
          String(record.Title).trim() != String(rowToRemove.Title).trim())
    );

    const newSheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetNames[1]] = newSheet;

    XLSX.writeFile(workbook, './src/account-data.xlsx');

    res.json({ status: 'success', message: 'Row removed' });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
