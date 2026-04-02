import axios from 'axios';

// This line checks if you are running on your laptop or on Vercel
const isLocalhost = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocalhost 
    ? "http://localhost:4000/api" 
    : "https://royal-backend-2.onrender.com/api"
});

export default API;