import axios from 'axios';
import { url as API_URL } from './config';
import getCookie from './util';


const getConfig = (() => {
    return {headers: {"Authorization": `Token ${getCookie('token')}`,
        "Content-Type": "application/json"}};
});


export default class HikeService {
    getHikes(only_user_hikes) {
        let data = [];
        const url = only_user_hikes ? `${API_URL}/api/user-hikes/` : `${API_URL}/api/hikes/`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getHikes: ${error}`);
        }).then(() => {
            return data;
        });
    };

    updateHike(hike) {
        let data = [];
        const url = `${API_URL}/api/hike/update`;

        return axios.post(url, data=hike, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in updateHike: ${error}`);
        }).then(() => {
            return data;
        });
    };

    addHike(hike) {
        let data = [];
        const url = `${API_URL}/api/hike/new/`;

        return axios.post(url, data=hike, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in newHike: ${error}`);
        }).then(() => {
            return data;
        });
    };

    deleteHike(id) {
        let data = [];
        const url = `${API_URL}/api/hike/delete/`;

        return axios.post(url, data={id}, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in newHike: ${error}`);
        }).then(() => {
            return data;
        });
    };


    getHike(id) {
        let data = [];
        const url = `${API_URL}/api/get-hike/?id=${id}`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in newHike: ${error}`);
        }).then(() => {
            return data;
        });
    };


    getHikeDays(hike_id) {
        let data = [];
        const url = `${API_URL}/api/hike/days/?hike_id=${hike_id}`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getHikes: ${error}`);
        }).then(() => {
            return data;
        });
    };

    updateHikeDay(hike_day) {
        let data = [];
        const url = `${API_URL}/api/hike/day/update/`;

        return axios.post(url, data=hike_day, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in updateHike: ${error}`);
        }).then(() => {
            return data;
        });
    };

    addHikeDay(hike_day) {
        let data = [];
        const url = `${API_URL}/api/hike/day/new/`;

        return axios.post(url, data=hike_day, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in newHike: ${error}`);
        }).then(() => {
            return data;
        });
    };

    deleteHikeDay(id) {
        let data = [];
        const url = `${API_URL}/api/hike/day/delete/`;

        return axios.post(url, data={id}, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in newHike: ${error}`);
        }).then(() => {
            return data;
        });
    };
};