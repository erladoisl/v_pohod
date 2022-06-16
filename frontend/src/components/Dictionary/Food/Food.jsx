import React from 'react';
import { Context } from "../../../contexts/index";
import MenuService from '../../../service/MenuService';


const menuService = new MenuService();


const Food = (() => {
    const [state, dispatch] = React.useContext(Context);
    const [changed, set_changed] = React.useState(false)
    const [messageHTML, setMessageHTML] = React.useState('');
    const [formData, setFormData] = React.useState({
        name: '',
        amount_per_person: 0,
        unit: 'гр.'
    });

    const addFoodSubmit = ((e) => {
        e.preventDefault();
        menuService.updateFood(formData).then(function (result) {
            if (result.error === false) {
                updateFoodList();
                setFormData({
                    name: '',
                    amount_per_person: 0,
                    unit: 'гр.'
                });
            }
            setMessageHTML(getMessageHTML(result))
        });
    });


    const deleteFood = ((name) => {
        menuService.deleteFood(name).then(function (result) {
            if (result.error === false) {
                updateFoodList();
            }
            setMessageHTML(getMessageHTML(result))
        });
    });


    const updateFoodList = (() => {
        menuService.getFood().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_food', 'food': JSON.parse(result.data) });
            }
        });
    });

    const updateFood = ((food) => {
        menuService.updateFood(food).then(function (result) {
            if (result.error === false) {
                updateFoodList()
            }
            setMessageHTML(getMessageHTML(result))
        });
    });


    if (!state.menu.hasOwnProperty("food")) {
        updateFoodList();
    }


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


    return (
        <div className="card col-12 py-5 my-3">
            <h2 className="fw-light">Граммовка продуктов на человека(гр/чел или шт/чел)</h2>
            {messageHTML}
            <ul className="list-group mb-3">
                {state.menu.hasOwnProperty("food") && state.menu.food.map((food, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={food.name} placeholder="Promo code"
                                onChange={((e) => {
                                    if (state.menu.food[i].name !== e.target.value) {
                                        state.menu.food[i].name = e.target.value;
                                        dispatch({ 'type': 'update_food', 'food': state.menu.food });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateFood({
                                            id: state.menu.food[i].value,
                                            name: state.menu.food[i].name,
                                            amount_per_person: state.menu.food[i].amount_per_person
                                        })
                                    }
                                    set_changed(false)
                                })} />

                            <input type="text" className="form-control" value={food.amount_per_person} placeholder="0"
                                onChange={((e) => {
                                    if (state.menu.food[i].amount_per_person !== e.target.value) {
                                        state.menu.food[i].amount_per_person = e.target.value;
                                        dispatch({ 'type': 'update_food', 'food': state.menu.food });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateFood({
                                            id: state.menu.food[i].value,
                                            name: state.menu.food[i].name,
                                            amount_per_person: state.menu.food[i].amount_per_person
                                        })
                                    }
                                    set_changed(false)
                                })} />

                            <input type="text" className="form-control" value={food.unit} placeholder="гр."
                                onChange={((e) => {
                                    if (state.menu.food[i].unit !== e.target.value) {
                                        state.menu.food[i].unit = e.target.value;
                                        dispatch({ 'type': 'update_food', 'food': state.menu.food });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateFood({
                                            id: state.menu.food[i].value,
                                            name: state.menu.food[i].name,
                                            amount_per_person: state.menu.food[i].amount_per_person,
                                            unit: state.menu.food[i].unit
                                        })
                                    }
                                    set_changed(false)
                                })} />

                            <button type="submit" className="btn btn-danger" onClick={() => { deleteFood(food.name) }}>X</button>
                        </div>
                    )
                })}
            </ul>

            <form className="card p-2" onSubmit={addFoodSubmit}>
                <div className="input-group">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" placeholder="Продукт" required />
                    <input type="text" value={formData.amount_per_person} onChange={(e) => setFormData({ ...formData, amount_per_person: e.target.value })} className="form-control" required />
                    <input type="text" className="form-control" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="гр." />

                    <button type="submit" className="btn btn-secondary">Добавить</button>
                </div>
            </form>
        </div>
    );
});


export default Food;