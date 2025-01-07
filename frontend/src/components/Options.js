import { fetchData } from '../services/api';
import {React, useEffect, useState} from '../imports';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
  } from '@mui/material';

function Options() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    useEffect(() => {
        fetchData('data') // Assuming 'data' is the endpoint for the data you need
        .then((response) => {
          setData(response.data); // Assuming the API response contains a 'data' array
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    return (
      <div className="App">
        <h1>Options Page</h1>
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>item.id</TableCell>
                <TableCell>item.name</TableCell>
                <TableCell>item.value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  export default Options;
