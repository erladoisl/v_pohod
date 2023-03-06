import React from 'react';
import { Context } from "../../../contexts/index";
import FBMenuService from '../../../service/FBMenuService';


const menuService = new FBMenuService();


const Formula = (() => {
    const [state, dispatch] = React.useContext(Context);
    const [changed, set_changed] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: '',
        value: ''
    });

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': {type, text} })
    })

    const addFormulaSubmit = ((e) => {
        e.preventDefault();
        menuService.updateFormula({name: formData.name, value: formData.value}).then(function (result) {
            if (result.error === false) {
                updateFormulaList();
                setFormData({
                    name: '',
                    value: 0
                });
            } else {
                console.log(result);
            }
            addNotification(result.error ? 'error': 'success', result.message)
        });
    });

    const deleteFormula = ((object) => {
        menuService.deleteFormula(object).then(function (result) {
            if (result.error === false) {
                updateFormulaList();
            }
            addNotification(result.error ? 'error': 'success', result.message)
        });
    });

    const updateFormulaList = (() => {
        menuService.getFormula().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_formula', 'formula': result.objects });
            } else {
                console.log(result);
            };
        });
    });

    const updateFormula = ((formula) => {
        menuService.updateFormula(formula).then(function (result) {
            if (result.error === false) {
                updateFormulaList()
            }
            addNotification(result.error ? 'error': 'success', result.message)
        });
    });

    if (!state.menu.hasOwnProperty("formula")) {
        updateFormulaList();
    };

    return (
        <div className="card col-12 py-5 my-3">
            <h2 className="fw-light">Формулы для вычисления количества ингредиентов на один прием пищи</h2>

            <section className="container">
                <div className="row py-lg-5">
                    <div className="">
                        <h3 className="fw-light">Правила оформления формул:</h3>

                        <div className="lead text-muted">Можно применять математические операторы <b>[+, -, *, /, // - целая часть от деления, % - остаток от деления]</b>
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
                        </div>
                    </div>
                </div>
            </section>
            <ul className="list-group mb-3">

                {state.menu.hasOwnProperty("formula") && state.menu.formula.map((formula, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={formula.name} placeholder="Название формулы" 
                                onChange={((e) => {
                                    if (state.menu.formula[i].name !== e.target.value) {
                                        state.menu.formula[i].name = e.target.value;
                                        dispatch({ 'type': 'update_formula', 'formula': state.menu.formula });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateFormula(state.menu.formula[i])
                                    }
                                    set_changed(false)
                                })}  />

                            <input type="text" className="form-control" value={formula.value} placeholder="0" 
                                onChange={((e) => {
                                    if (state.menu.formula[i].value !== e.target.value) {
                                        state.menu.formula[i].value = e.target.value;
                                        dispatch({ 'type': 'update_formula', 'formula': state.menu.formula });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateFormula(state.menu.formula[i])
                                    }
                                    set_changed(false)
                                })}  />

                            <button type="submit" className="btn btn-danger" onClick={() => { deleteFormula(formula) }}>X</button>
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
    );
});


export default Formula;