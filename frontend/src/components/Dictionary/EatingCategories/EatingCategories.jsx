import React from 'react';
import { Context } from "../../../contexts/index";
import { useRef } from "react";
import MenuService from '../../../service/MenuService';


const menuService = new MenuService();


const EatingCategories = (() => {
    const [state, dispatch] = React.useContext(Context);
    const [changed, set_changed] = React.useState(false)
    const newCategory = useRef();

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': {type, text} })
    })

    const deleteCategory = ((name) => {
        menuService.deleteEatingCategory(name).then(function (result) {
            if (result.error === false) {
                updateCategoryList();
            }
            addNotification(result.error ? 'error': 'success', result.message)
        });
    });


    const updateCategoryList = (() => {
        menuService.getEatingCategories().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_eating_category', 'eatingCategories': JSON.parse(result.data) });
            } else {
                console.log(result);
            }
        });
    });


    const updateCategory = ((eatingCategory) => {
        menuService.updateEatingCategory(eatingCategory).then(function (result) {
            if (result.error === false) {
                updateCategoryList()
            }
            addNotification(result.error ? 'error': 'success', result.message)
        });
    });

    if (!state.menu.hasOwnProperty("eatingCategories")) {
        updateCategoryList();
    }

    return (
        <div className="col-12 py-5 card mb-3">
            <h2 className="fw-light">Типы приемов пищи(Порядок важен)</h2>

            <ul className="list-group mb-3">
                {state.menu.hasOwnProperty("eatingCategories") && state.menu.eatingCategories.map((category, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={category.fields.name} placeholder="Promo code"
                                onChange={((e) => {
                                    if (state.menu.eatingCategories[i].fields.name !== e.target.value) {
                                        state.menu.eatingCategories[i].fields.name = e.target.value;
                                        dispatch({ 'type': 'update_eating_category', 'eatingCategories': state.menu.eatingCategories });
                                        set_changed(true)
                                    }
                                })}
                                onBlur={(() => {
                                    if (changed) {
                                        updateCategory({
                                            id: state.menu.eatingCategories[i].pk,
                                            name: state.menu.eatingCategories[i].fields.name
                                        })
                                    }
                                    set_changed(false)
                                })} />
                            <button type="submit" className="btn btn-danger" onClick={() => { deleteCategory(category.fields.name) }}>X</button>
                        </div>
                    )
                })}
            </ul>

            <form className="card p-2" onSubmit={((e) => { e.preventDefault(); updateCategory({ name: newCategory.current.value }); newCategory.current.value = '' })}>
                <div className="input-group">
                    <input type="text" ref={newCategory} className="form-control" placeholder="Новый тип" required />

                    <button type="submit" className="btn btn-secondary">Добавить</button>
                </div>
            </form>
        </div>
    );
});


export default EatingCategories;