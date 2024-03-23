import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'ngrok-skip-browser-warning': 'abc'
	}
});

export default api;
