import React from 'react';
import HikeService from '../../../service/FBHikeService';
import { useLocation } from 'react-router-dom'
import Days from './Days/Days';
import { NavLink } from 'react-router-dom';

const hikeService = new HikeService();

const Hike = (() => {
    const { state } = useLocation();

    const download_menu = (() => {
        hikeService.getXlsx(state.hike.id).then(((result) => {
            console.log(result);
        }));

    });


    return (
        <div className="container pt-5">
            <div className="py-5 text-center">
                <h2> {state.hike.name} </h2>
            </div>
            <div className="row g-3 text-start">
                <div className="col-12">
                    {state.hike.description}
                </div>

                <div className="col-sm-12">
                    Количество участников:
                    {state.hike.participant_count}
                </div>
            </div>

            <br />

            <div className='text-start'>
                <button onClick={(() => { download_menu() })} className="btn btn-primary m-2">
                    Загрузить раскладку
                </button>
                <NavLink to='/new-hike' className="btn btn-primary m-2" state={{ hike: state.hike }}>
                    Изменить данные о походе
                </NavLink>
            </div>

            <br />

            <Days hike_id={state.hike.id} />

            <br className="my-4" />
        </div>
    );
});


export default Hike;