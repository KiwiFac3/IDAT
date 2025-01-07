import axios from 'axios';

// Base URL for your FastAPI backend
const API_URL = "http://127.0.0.1:8000";

// Function to fetch data from the server
export const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error ${endpoint} fetching data:`, error);
      throw error;
    }
  };

