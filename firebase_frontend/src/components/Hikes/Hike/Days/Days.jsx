import HikeService from '../../../../service/FBHikeService';
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
// import { parseISO, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Eatings from '../../../Eatings/Eatings';
import { Context } from "../../../../contexts/index";
import React from 'react';
import Loader from '../../../Loader/Loader';


const hikeService = new HikeService();

const Days = ((props) => {
    const [loading, setLoading] = React.useState(false)
    const [state, dispatch] = React.useContext(Context);
    const [days, set_days] = useState([]);

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': {type, text} })
    })

    useEffect(() => {
        if (days.length === 0) {
            updateDaysList();
        };
    }, []);

    const updateDaysList = (() => {
            hikeService.getHikeDays(props.hike_id).then(function (result) {
            if (result.error === false) {
                set_days(result.objects);
            } else {
                addNotification('error', result.message)
            }
        });
    });


    const deleteDay = ((objects) => {
        setLoading(true)
        hikeService.deleteHikeDay(objects).then(function (result) {
            if (result.error === false) {
                updateDaysList();
            } else {
                addNotification('error', result.message)
            }
            setLoading(false)
        });
    });


    const updateDay = ((data) => {
        setLoading(true)
        hikeService.updateHikeDay(data).then(function (result) {
            if (result.error === false) {
                updateDaysList();
            } else {
                addNotification('error', result.message)
            }
            setLoading(false)
        });
    });

    const empty_result_html = days.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            Дни похода не определены
        </div>
    ) : '';


    return (
        <>
            {loading && <Loader /> }

            <div className='text-end'>
                <div className=''>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle mx-1" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}
                        onClick={(() => { updateDay({ 'hike_id': props.hike_id, 'date': new Date() }) })}>
                        <title> Добавить новый день </title>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    день
                </div>
            </div>

            <hr className="my-4"></hr>

            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {empty_result_html}

                {days.map((item, i) => {
                    return (
                        <div className='p-1' key={item.id}>
                            <div className='card p-0 h-100' key={i}>
                                <div className="card-header">
                                    <div className='row'>
                                        <div className='col-10'>
                                            <DatePicker
                                                selected={item.date.toDate()}
                                                onChange={((date) => updateDay({ ...item, date: date }))}
                                                name="startDate"
                                                className='col-3 form-control'
                                                dateFormat="Y-M-d"
                                            />
                                        </div>
                                        <div className='col-1 my-2' onClick={(() => { deleteDay(item) })}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <title> Удалить день </title>
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body h-100">

                                    <Eatings day_id={item.id} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
});

export default Days;