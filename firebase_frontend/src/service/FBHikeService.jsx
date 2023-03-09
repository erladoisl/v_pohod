import { initializeApp } from "firebase/app";
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
    delete_object,
    edit_object,
    get_objects,
    get_objects_by_field
} from './FirebaseService';
import { firebaseConfig } from "./config";
import {
    getAuth,
} from "firebase/auth";
import { createExcel } from "./excel_creator";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default class HikeService {
    getHikes(only_user_hikes) {
        if (only_user_hikes) {
            return get_objects_by_field('user_id', auth.currentUser.uid, 'hikes')
        }
        return get_objects('hikes')
    };

    updateHike(hike) {
        return edit_object(hike, 'hikes')
    };

    deleteHike(object) {
        return delete_object(object, 'hikes')
    };


    getHikeDays(hike_id) {
        return get_objects_by_field('hike_id', hike_id, 'hike_days', 'date', true)
    };

    updateHikeDay(hike_day) {
        return edit_object(hike_day, 'hike_days')
    };

    deleteHikeDay(object) {
        return delete_object(object, 'hike_days')
    };

    getXlsx(hike_id, hike_name) {
        createExcel(hike_id, hike_name).then((response => {
            saveAs(response, `${hike_name}.xlsx`)
        }));
    };
};
