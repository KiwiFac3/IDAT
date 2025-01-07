import { fetchData } from '../services/api';
import { React, useEffect, useState, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Bar } from '../imports';

// Registering the necessary Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


function Charts() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        // Fetching data from the API
        fetchData('data') // Assuming 'data' is the endpoint for the data you need
          .then((response) => {
            setData(response.data); // Assuming the API response contains a 'data' array
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
        <h1 className="page-header">Charts</h1>
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

  export default Charts;