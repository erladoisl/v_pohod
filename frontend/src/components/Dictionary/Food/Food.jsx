import React from 'react';
import { Context } from "../../../contexts/index";
import MenuService from '../../../service/MenuService';


const menuService = new MenuService();


const Food = (() => {
    const [state, dispatch] = React.useContext(Context);
    const [formData, setFormData] = React.useState({
        name: '',
        amount_per_person: 0
    });

    const addFoodSubmit = ((e) => {
        e.preventDefault();
        menuService.addFood(formData.name, formData.amount_per_person, state.user.token).then(function (result) {
            if (result.error === false) {
                updateFood();
                setFormData({
                    name: '',
                    amount_per_person: 0
                });
            } else {
                console.log(result);
            };
        });
    });


    const deleteFood = ((name) => {
        menuService.deleteFood(name, state.user.token).then(function (result) {
            if (result.error === false) {
                updateFood();
            } else {
                console.log(result);
            };
        });
    });


    const updateFood = (() => {
        menuService.getFood(state.user.token).then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_food', 'food': JSON.parse(result.data) });
            } else {
                console.log(result);
            }
        });
    });


    if (!state.menu.hasOwnProperty("food")) {
        updateFood();
    }


    return (
        <div className="card col-12 py-5 my-3">
            <h2 className="fw-light">Граммовка продуктов на человека(гр/чел или шт/чел)</h2>

            <ul className="list-group mb-3">
                {state.menu.hasOwnProperty("food") && state.menu.food.map((food, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={food.fields.name} placeholder="Promo code" disabled />

                            <input type="text" className="form-control" value={food.fields.amount_per_person} placeholder="Promo code" disabled />

                            <button type="submit" className="btn btn-danger" onClick={() => { deleteFood(food.fields.name) }}>X</button>
                        </div>
                    )
                })}
            </ul>

            <form className="card p-2" onSubmit={addFoodSubmit}>
                <div className="input-group">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" placeholder="Продукт" required />

                    <input type="text" value={formData.amount_per_person} onChange={(e) => setFormData({ ...formData, amount_per_person: e.target.value })} className="form-control" required />

                    <button type="submit" className="btn btn-secondary">Добавить</button>
                </div>
            </form>
        </div>
    );
});


export default Food;