// React and React Router
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Axios for HTTP requests
import axios from 'axios';

// Material UI components
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
} from '@mui/material';

// Chart.js and chartjs-plugin-datalabels
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart components
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

export { React, useState, useEffect, Router, Routes, Route, Link, axios, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, Bar, Pie };
