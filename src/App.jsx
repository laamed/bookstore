import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css'

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    {field: 'author', sortable: true, filter: true},
    {field: 'title', sortable: true, filter: true},
    {field: 'year', sortable: true, filter: true},
    {field: 'isbn', sortable: true, filter: true},
    {field: 'price', sortable: true, filter: true},
    {
      headerName: '',
      field: 'id',
      width: 190,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    }
  ]

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch('https://bookstore-474a5-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.log(err))
  }

  //Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((book, index) =>
    Object.defineProperty(book, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  //Add book
  const addBook = (newBook) => {
    fetch('https://bookstore-474a5-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchData())
    .catch(err => console.log(err))
  }

  //Delete book
  const deleteBook = (id) => {
    fetch(`https://bookstore-474a5-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchData())
    .catch(err => console.log(err))
  }

  return (
    <>
    <AppBar className="bookstore-header" position="static">
      <Toolbar>
        <Typography variant="h5">
          Bookstore
        </Typography>
      </Toolbar>
    </AppBar>
    <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{height: 400, width: 1200}}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;
