import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

export default class UsersService {
	constructor() { }

	logIn(username, password) {
		let data = [];
		const url = `${API_URL}/api-token-auth/`;

		return axios.post(url, data = {
			"username": username,
			"password": password
		}).then(response => {
			data = response.data;
		}).catch(error => {
			console.log(`ERROR while logIn: ${error}`);
		}).then(() => {
			return data;
		});
	}

	registration(user) {
		let data = [];
		const url = `${API_URL}/api/registration/`;

		return axios.post(url, data = user).then(response => {
			data = response.data;
		}).catch(error => {
			console.log(`ERROR while logIn: ${error}`);
		}).then(() => {
			return data;
		});
	}
}