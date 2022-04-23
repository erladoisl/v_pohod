import axios from 'axios';
import { url as API_URL } from './config';
// const API_URL = 'http://127.0.0.1:8000';

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
		}).catch(error => {
			console.log(`ERROR while logIn: ${error}`);
            data = {'error': true, 'message': error.toString()}
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
            data = {'error': true, 'message': error.toString()}
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
			console.log(`ERROR while logIn: ${error}`);
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
			console.log(`ERROR while logIn: ${error}`);
		}).then(() => {
			return data;
		});
	}
}