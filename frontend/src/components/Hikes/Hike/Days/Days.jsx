import HikeService from '../../../../service/HikeService';
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import Menu from '../../../Menu/Menu';
import { parseISO, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";


const hikeService = new HikeService();

const Days = ((props) => {
    const [days, set_days] = useState([]);

    useEffect(() => {
        if (days.length === 0) {
            updateDaysList();
        };
    }, []);

    const updateDaysList = (() => {
        hikeService.getHikeDays(props.hike_id).then(function (result) {
            if (result.error === false) {
                set_days(result.days);
            } else {
                console.log(result);
            }
        });
    });


    const deleteDay = ((id) => {
        hikeService.deleteHikeDay(id).then(function (result) {
            if (result.error === false) {
                updateDaysList();
            } else {
                console.log(result);
            }
        });
    });


    const updateDay = ((data) => {
        hikeService.updateHikeDay(data).then(function (result) {
            if (result.error === false) {
                updateDaysList();
            } else {
                console.log(result);
            }
        });
    });

    const empty_result_html = days.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            Дни похода не определены
        </div>
    ) : '';


    return (
        <div className="container">


            <button onClick={(() => { updateDay({ 'hike_id': props.hike_id }) })} className="btn btn-primary">
                Новый день
            </button>
            <hr className="my-4"></hr>

            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {empty_result_html}

                {days.map((item, i) => {
                    return (
                        <div className='card p-0' key={i}>
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col-10'>
                                        <DatePicker
                                            selected={parseISO(item.date)}
                                            onChange={((date) => updateDay({ ...item, date: date }))}
                                            name="startDate"
                                            className='col-3 form-control'
                                            dateFormat="Y-M-d"
                                        />
                                    </div>
                                    <div className='col-1 my-2' onClick={(() => { deleteDay(item.id) })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <title> Удалить день </title>
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">

                                <Menu day_id={item.id} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
});

export default Days;