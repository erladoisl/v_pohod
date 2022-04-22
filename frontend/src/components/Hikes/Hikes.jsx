import React from 'react';
import { useState, useEffect } from "react"
import { Context } from "../../contexts/index"
import HikeService from '../../service/HikeService';
const hikeService = new HikeService();


const Hikes = () => {
    const [state, dispatch] = React.useContext(Context);
    const [only_my_hikes, set_only_my_hikes] = useState(false);
    const [hikes, set_hikes] = useState([]);


    useEffect(() => {
        hikeService.getHikes(state.user.token, only_my_hikes).then(function (result) {
            if (result.error === false) {
                set_hikes(result.hikes);
            } else {
                console.log(result);
            }
        });
    }, [only_my_hikes]);


    return (
        <div className="container">
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Архив</h1>
                        <p className="lead text-muted">Помошник по созданию раскладок для походов и не только. Автоматический рассчет количества ингредиентов для участников, помощь при совместной закупке. Делает работу легче :)</p>
                        <p>
                            <a href="#" className="btn btn-primary m-2">Создать новый поход</a>
                            <a href="#" className="btn btn-secondary m-2">Создать на основе существующего</a>
                        </p>
                    </div>
                </div>
            </section>

            <div className="form-check">
                <input type="checkbox" checked={only_my_hikes} onChange={(() => {set_only_my_hikes(!only_my_hikes)})} className="form-check-input" id="same-address" />
                <label className="form-check-label" htmlFor="same-address">Показывать только мои походы</label>
            </div>

            <hr className="my-4"></hr>
            
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {hikes.map((item) => {
                    return (
                        <div className="col" key={item.id}>
                            <div className="card mb-4 rounded-3 shadow-sm">
                                <div className="card-header py-3">
                                    <h4 className="my-0 fw-normal">{item.name}</h4>
                                </div>
                                <div className="card-body">
                                    <h1 className="card-title pricing-card-title">{item.participant_count}<small className="text-muted fw-light">человек</small></h1>
                                    <p className="text-center py-3">
                                        {item.description}
                                    </p>
                                    <button type="button" className="w-100 btn btn-lg btn-outline-primary">Просмотреть</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Hikes;