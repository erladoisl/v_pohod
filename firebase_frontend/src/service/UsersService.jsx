import axios from 'axios';
import { url as API_URL } from './config';
import getCookie from './util';


const getConfig = (() => {
	return {
		headers: {
			"Authorization": `Token ${getCookie('token')}`,
			"Content-Type": "application/json"
		}
	};
});


export default class UsersService {
	// constructor() { }

	logIn(username, password) {
		let data = [];
		const url = `${API_URL}/api-token-auth/`;

		return axios.post(url, data = {
			"username": username,
			"password": password
		}).then(response => {
			data = response.data;
			if (data.hasOwnProperty('data')) {
				document.cookie = `token=${data.data['token']}; path=/;`
			}
		}).catch(error => {
			console.log(`ERROR while logIn: ${error}`);
			data = { 'error': true, 'message': error.toString() }
		}).then(() => {
			return data;
		});
	}

	registration(user) {
		let data = [];
		const url = `${API_URL}/api/registration/`;

		return axios.post(url, data = user).then(response => {
			data = response.data;
			if (data.hasOwnProperty('data')) {
				document.cookie = `token=${data.data['token']}; path=/;`
			}
		}).catch(error => {
			console.log(`ERROR while registration: ${error}`);
			data = { 'error': true, 'message': error.toString() }
		}).then(() => {
			return data;
		});
	}

	changePass(user) {
		let data = [];
		const url = `${API_URL}/api/change-password/`;

		return axios.post(url, data = user).then(response => {
			data = response.data;
		}).catch(error => {
			console.log(`ERROR while changePass: ${error}`);
		}).then(() => {
			return data;
		});
	}

	editUser(user) {
		let data = [];
		const url = `${API_URL}/api/edit-user/`;

		return axios.post(url, data = user).then(response => {
			data = response.data;
		}).catch(error => {
			console.log(`ERROR while editUser: ${error}`);
		}).then(() => {
			return data;
		});
	}


	getAuthUser() {
		let data = [];
		const url = `${API_URL}/api/get-auth-user/`;

		return axios.get(url, getConfig()).then(response => {
			data = response.data;
		}).catch(error => {
			console.log(`ERROR while getAuthUser: ${error}`);
		}).then(() => {
			return data;
		});
	}
}