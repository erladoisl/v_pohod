import React from 'react';
import { useState, useEffect } from "react";
import HikeService from '../../../service/FBHikeService';
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../Loader/Loader';


const hikeService = new HikeService();


const UpdateHike = (() => {
    const { state } = useLocation();
    const navigate = useNavigate()
    const [use_example, setUseExample] = useState(false);
    const [example_HTML, setExampleHTML] = useState('');
    const [messageHTML, setMessageHTML] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [form_data, setFormData] = React.useState({
        id: -1,
        name: "",
        description: "",
        participant_count: 0,
    });

    if (state && state.hasOwnProperty('hike') && form_data.id === -1) {
        setFormData(state.hike);
    };


    const updateHikeSubmit = ((e) => {
        e.preventDefault();
        if (loading) { return }
        setLoading(true)
        hikeService.updateHike(form_data).then(function (result) {
            setMessageHTML(getMessageHTML(result));

            if (!result.error && form_data.id === -1) {
                setFormData({ ...form_data, id: result.id })
            }
            if (!result.error) {
                navigate('/hike-view', { state: { hike: form_data } })
            }
            setLoading(false)
        });
    });


    const getMessageHTML = ((response) => {
        if (response.error || response.message !== '') {
            return (
                <div className={`alert alert-${response.error ? 'danger' : 'success'}`} role="alert">
                    {response.message}
                </div>
            );
        } else {
            return '';
        };
    });


    useEffect(() => {
        setExampleHTML(use_example ? (
            <div className="col-md-12">
                <label htmlFor="example" className="form-label"> Шаблон похода </label>
                <select className="form-select" id="example" required>
                    <option value={form_data} onChange={((e) => setFormData({ ...form_data, example_hike_id: e.target.id }))}>Выбрать...</option>
                    <option id='1'>1</option>
                    <option id='2'>2</option>
                    <option id='3'>3</option>
                </select>
                <div className="invalid-feedback">
                    Нужно выбрать один вариант
                </div>
            </div>
        ) : '');
    }, [use_example]);


    return (
        <div className="container pt-5">
            {loading && <Loader /> }
            
            <div className="py-5 text-center">
                <h2>{form_data.id > 0 ? form_data.name : 'Редактирование данных о походе'}</h2>
                {form_data.id === -1 && <p className="lead">
                    Опиши основные моменты похода.
                    <br />
                    Так же есть возможность создавать поход на основе существующего или абсолютно новый.
                    <br />
                    Раскладка и другие вещи будут скопированны из выбранного похода.
                    <br />
                    <b> Количество участников </b>- очень важное поле, оно позволит правильно рассчитать ингредиенты.
                </p>}
            </div>
            {messageHTML}
            <form className="needs-validation text-start" onSubmit={updateHikeSubmit} >
                <div className="row g-3">
                    <div className="col-sm-12">
                        <label htmlFor="name" className="form-label">Название похода</label>
                        <input type="text" className="form-control" id="name" placeholder="" value={form_data.name} onChange={((e) => { setFormData({ ...form_data, name: e.target.value }) })} required />
                        <div className="invalid-feedback">
                            Обязательное поле, должно быть уникальным
                        </div>
                    </div>

                    <div className="col-12">
                        <label htmlFor="description" className="form-label">Описание <span className="text-muted">(Необязательное)</span></label>
                        <textarea className="form-control" value={form_data.description} onChange={((e) => { setFormData({ ...form_data, description: e.target.value }) })} id="description" placeholder="Введи сюда описание похода..." />
                        <div className="invalid-feedback">

                        </div>
                    </div>
                    {/* {form_data.id === -1 &&
                        <div className="form-check">
                            <input type="checkbox" checked={use_example} onChange={(() => { setUseExample(!use_example) })} className="form-check-input" id="same-address" />
                            <label className="form-check-label" htmlFor="same-address">Использовать существующий поход как основу</label>
                        </div>
                    } */}

                    {form_data.id === -1 && example_HTML}

                    <div className="col-sm-12">
                        <label htmlFor="name" className="form-label">Количество участников</label>
                        <input type="number" className="form-control" id="name" placeholder="" value={form_data.participant_count} onChange={((e) => { setFormData({ ...form_data, participant_count: e.target.value }) })} required />
                    </div>
                </div>

                <br />

                <button className="w-100 btn btn-primary btn-lg" type="submit">Сохранить</button>
            </form>

            <br className="my-4" />
        </div>
    );
});


export default UpdateHike;