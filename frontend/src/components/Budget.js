import { fetchData } from '../services/api';
import { React, useEffect, useState, CircularProgress, Pie } from '../imports';

function Budget() {
  const [incomeSources, setIncomeSources] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData('budget') // Fetch data from the /budget endpoint using the api function
      .then((data) => {
        const incomeData = Array.isArray(data.income) ? data.income : [];
        const expenseData = Array.isArray(data.expenses) ? data.expenses : [];
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

export default Budget;
