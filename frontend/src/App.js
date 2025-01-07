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
  TextField,
  CircularProgress,
} from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/options">Options</Link>
        <Link to="/charts">Charts</Link>
        <Link to="/budget">Budget</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/options" element={<Options />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/budget" element={<Budget />} />
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
        <div>Loading...</div> // Display loading message or spinner
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

function Budget() {
  const [incomeSources, setIncomeSources] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/budget")
      .then((response) => {
        const incomeData = Array.isArray(response.data.income)
          ? response.data.income
          : [];
        const expenseData = Array.isArray(response.data.expenses)
          ? response.data.expenses
          : [];
        setIncomeSources(incomeData);
        setExpenses(expenseData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching budget data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
        <p>Loading Budget Data...</p>
      </div>
    );
  }

  const totalIncome = incomeSources.reduce(
    (acc, income) => acc + (income.amount || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + (expense.amount || 0),
    0
  );
  const savings = totalIncome - totalExpenses;

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors; // Spread hues evenly across the color wheel
      colors.push(`hsl(${hue}, 40%, 60%)`); // Keep saturation and lightness constant
    }
    return colors;
  };

  const numExpenses = expenses.length;
  const colors = generateColors(numExpenses + 1); // +1 for savings/debt

  const chartData = {
    labels: [...expenses.map((expense) => expense.category), "Savings/Debt"],
    datasets: [
      {
        label: "Expense Allocation",
        data: [
          ...expenses.map((expense) => expense.amount),
          Math.max(0, savings),
        ],
        backgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        color: "#000",
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          // Show labels for expenses and savings
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);

          // Skip labels for small portions
          if (percentage <= 5) {
            return ""; // Do not display labels for portions < 5%
          }

          // Show category name and percentage for larger portions
          return `${
            context.chart.data.labels[context.dataIndex]
          } (${percentage}%)`;
        },
      },
    },
  };

  return (
    <div className="App">
      <h1>Budget Page</h1>
      <h2>Total Income: ${totalIncome}</h2>
      <h2>Total Expenses: ${totalExpenses}</h2>
      <h2 style={{ color: savings >= 0 ? "green" : "red" }}>
        {savings >= 0 ? `Savings: $${savings}` : `Debt: $${Math.abs(savings)}`}
      </h2>
      <Pie
        data={chartData}
        options={{
          ...chartOptions,
          hoverOffset: 25,
        }}
      />
    </div>
  );
}

export default App;
