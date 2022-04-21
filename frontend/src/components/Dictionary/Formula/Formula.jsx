import React from 'react';
import { Context } from "../../../contexts/index"
import MenuService from '../../../service/MenuService';
const menuService = new MenuService();

export default function Formula() {
    const [state, dispatch] = React.useContext(Context);
    const [formData, setFormData] = React.useState({
        name: '',
        value: ''
    });


    const addFormulaSubmit = ((e) => {
        e.preventDefault()
        menuService.addFormula(formData.name, formData.value, state.user.token).then(function (result) {
            if (result.error === false) {
                updateFormula()
                setFormData({
                    name: '',
                    value: 0
                })
            } else {
                console.log(result)
            }
        });
    });


    const deleteFormula = ((name) => {
        menuService.deleteFormula(name, state.user.token).then(function (result) {
            if (result.error === false) {
                updateFormula()
            } else {
                console.log(result)
            }
        });
    });


    const updateFormula = (() => {
        menuService.getFormula(state.user.token).then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_formula', 'formula': JSON.parse(result.data) })
            } else {
                console.log(result)
            }
        });
    });


    if (state.food.length === 0) {
        updateFormula();
    }


    return (
        <div className="card col-12 py-5 my-3">
            <h2 className="fw-light">Формулы для вычисления количества ингредиентов на один прием пищи</h2>

            <section className="container">
                <div className="row py-lg-5">
                    <div className="">
                        <h3 className="fw-light">Правила оформления формул:</h3>

                        <p className="lead text-muted">Можно применять математические операторы <b>[+, -, *, /, // - целая часть от деления, % - остаток от деления]</b>
                            <div>Доступны скобочки для обозначения приоритетов операций</div>
                            <hr />
                            <div>Доступные методы:</div>
                            <div><b>ceil(number: float) -> int</b> - округление в большую сторону</div>
                            <div><b>floor(number: float) -> int</b> - округление в меньшую сторону</div>
                            <hr />
                            <div>Доступные переменные:</div>
                            <div><b>PARTICIPANT_COUNT</b> - используй переменную для получения общего количества участников похода</div>
                            <div><b>AMOUNT_PER_PERSON</b> - для получения количества ингредиента на одного человека(гр/чел или шт/чел)</div>
                            <div><b>TOTAL_COUNT</b> - для получения количества приемов пищи с данным продуктом</div>
                            <div><b>DAYS_COUNT</b> - для получения количества дней в походе</div>
                        </p>
                    </div>
                </div>
            </section>
            <ul className="list-group mb-3">

                {state.formula.map((food, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={food.fields.name} placeholder="Promo code" disabled />

                            <input type="text" className="form-control" value={food.fields.value} placeholder="Promo code" disabled />

                            <button type="submit" className="btn btn-danger" onClick={() => { deleteFormula(food.fields.name) }}>X</button>
                        </div>
                    )
                })}
            </ul>
            <form className="card p-2" onSubmit={addFormulaSubmit}>
                <div className="input-group">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" placeholder="Название формулы" required />

                    <input type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="form-control" placeholder="Формула" required />

                    <button type="submit" className="btn btn-secondary">Добавить</button>
                </div>
            </form>
        </div>
    )
}