import axios from 'axios';

const api = axios.create({
	baseURL: process.env.BACKEND_URL,
	headers: {
		'ngrok-skip-browser-warning': 'abc'
	}
});

export default api;
