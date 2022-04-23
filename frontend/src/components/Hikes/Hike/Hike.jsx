import React from 'react';
import { useState, useEffect } from "react"
import { Context } from "../../../contexts/index"
import HikeService from '../../../service/HikeService';
const hikeService = new HikeService();


const Hike = () => {
    const [use_example, setUseExample] = useState(false);
    const [example_HTML, setExampleHTML] = useState('');
    const [form_data, setFormData] = React.useState({
        name: "",
        description: "",
        participant_count: 0,
        example_hike_id: -1
    });


    useEffect(() => {
        setExampleHTML(use_example ? (
            <div className="col-md-12">
                <label htmlFor="example" className="form-label"> Шаблон похода </label>
                <select className="form-select" id="example" required>
                    <option value={form_data} onChange={((e) => setFormData({...form_data, example_hike_id: e.target.id}))}>Выбрать...</option>
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

    const onSubmitForm = ((e) => {
        console.log('add hike')
        e.preventDefault()
    });


    return (
        <div className="container pt-5">
            <div className="py-5 text-center">
                <h2>Новый поход</h2>
                <p className="lead">
                    Опиши основные моменты похода.
                    <br />
                    Так же есть возможность создавать поход на основе существующего или абсолютно новый.
                    <br />
                    Раскладка и другие вещи будут скопированны из выбранного похода.
                    <br />
                    <b> Количество участников </b>- очень важное поле, оно позволит правильно рассчитать ингредиенты.
                </p>
            </div>
            <form className="needs-validation" onSubmit={onSubmitForm} >
                <div className="row g-3">
                    <div className="col-sm-12">
                        <label htmlFor="name" className="form-label">Название похода</label>
                        <input type="text" className="form-control" id="name" placeholder="" value={form_data.name} onChange={((e) => { setFormData({...form_data, name: e.target.value}) })} required />
                        <div className="invalid-feedback">
                            Обязательное поле, должно быть уникальным
                        </div>
                    </div>

                    <div className="col-12">
                        <label htmlFor="description" className="form-label">Описание <span className="text-muted">(Необязательное)</span></label>
                        <textarea className="form-control" value={form_data.description} onChange={((e) => { setFormData({...form_data, description: e.target.value}) })}  id="description" placeholder="Введи сюда описание похода..." />
                        <div className="invalid-feedback">

                        </div>
                    </div>

                    <div className="form-check">
                        <input type="checkbox" checked={use_example} onChange={(() => {setUseExample(!use_example)})} className="form-check-input" id="same-address" />
                        <label className="form-check-label" htmlFor="same-address">Использовать существующий поход как основу</label>
                    </div>

                    {example_HTML}
                    
                    <div className="col-sm-12">
                        <label htmlFor="name" className="form-label">Количество участников</label>
                        <input type="number" className="form-control" id="name" placeholder="" value={form_data.participant_count} onChange={((e) => { setFormData({...form_data, participant_count: e.target.value}) })} required />
                        <div className="invalid-feedback">
                            Обязательное поле, должно быть уникальным
                        </div>
                    </div>
                </div>

                <br />

                <button className="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
            </form>

            <br className="my-4" />
        </div>
    )
};

export default Hike;