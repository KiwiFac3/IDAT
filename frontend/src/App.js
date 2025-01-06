import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from "@mui/material";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/options">Options</Link>
        <Link to="/charts">Charts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/options" element={<Options />} />
        <Route path="/charts" element={<Charts />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Analytics Dashboard</h1>
      </header>
      <main>
        <p>Welcome! This is where the data will be displayed.</p>
        <p>{message}</p>
      </main>
    </div>
  );
}

function Analytics() {
  return <h1>Analytics Page</h1>;
}

function Options() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/data")
      .then((response) => {
        setData(response.data.data);
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

function Charts() {

const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  axios
    .get("http://127.0.0.1:8000/data")
    .then((response) => {
      setData(response.data.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    });
}, []);

const chartData = {
  labels: data.map((item) => item.name),
  datasets: [
    {
      label: "Values",
      data: data.map((item) => item.value),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

return (
  <div className="App">
    <h1>Charts</h1>
    {/* Data Table */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      {/* Loading state */}
      {isLoading ? (
        <div>Loading...</div>  // Display loading message or spinner
      ) : (
        <div>
          {/* Chart */}
          <h2>Data Visualization</h2>
          <Bar data={chartData} />
        </div>
      )}
    </div>
);

}

export default App;
