import axios from 'axios';

const api = axios.create({
	baseURL: 'https://f115-24-178-244-41.ngrok-free.app',
	headers: {
		'ngrok-skip-browser-warning': 'abc'
	}
});

export default api;
