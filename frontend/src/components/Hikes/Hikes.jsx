import React from 'react';
import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import HikeService from '../../service/HikeService';


const hikeService = new HikeService();


const Hikes = (() => {
    const [only_my_hikes, set_only_my_hikes] = useState(false);
    const [hikes, set_hikes] = useState([]);


    useEffect(() => {
        updateHikeList();
    }, [only_my_hikes]);

    const updateHikeList = (() => {
        hikeService.getHikes(only_my_hikes).then(function (result) {
            if (result.error === false) {
                set_hikes(result.hikes);
            } else {
                console.log(result);
            }
        });
    });


    const deleteHike = ((id) => {
        hikeService.deleteHike(id).then(function (result) {
            if (result.error === false) {
                updateHikeList();
            } else {
                console.log(result);
            }
        });
    });


    const empty_result_html = hikes.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            Не найдено походов
        </div>
    ) : '';


    return (
        <div className="container">
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Архив</h1>
                        <p className="lead text-muted">Помошник по созданию раскладок для походов и не только. Автоматический рассчет количества ингредиентов для участников, помощь при совместной закупке. Делает работу легче :)</p>
                        <p>
                            <NavLink to='/new-hike' className="btn btn-primary m-2">
                                Создать новый поход
                            </NavLink>
                            {/* <a href="#" className="btn btn-secondary m-2">Создать на основе существующего</a> */}
                        </p>
                    </div>
                </div>
            </section>

            <div className="form-check">
                <input type="checkbox" checked={only_my_hikes} onChange={(() => { set_only_my_hikes(!only_my_hikes) })} className="form-check-input" id="same-address" />
                <label className="form-check-label" htmlFor="same-address">Показывать только мои походы</label>
            </div>

            <hr className="my-4"></hr>

            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {empty_result_html}
                {hikes.map((item) => {
                    return (
                        <div className="col" key={item.id} >
                            <div className="card mb-4 rounded-3 shadow-sm">
                                <div className="card-header py-3 row">
                                    <div className='col-10'><h4 className="my-0 fw-normal">{item.name}</h4></div>
                                    <div className='col-2' onClick={(() => { deleteHike(item.id) })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </div>

                                </div>
                                <div className="card-body">
                                    <h1 className="card-title pricing-card-title">{item.participant_count}<small className="text-muted fw-light">человек</small></h1>
                                    <p className="text-center py-3">
                                        {item.description}
                                    </p>
                                    <NavLink to='/new-hike'
                                        state={{ id: item.id }}
                                        className="w-100 btn btn-lg btn-outline-primary" >
                                        Просмотреть
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
});


export default Hikes;