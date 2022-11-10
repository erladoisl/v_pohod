import { Context } from "../../../contexts/index";
import FBMenuService from '../../../service/FBMenuService';
import React from 'react';
import { useState } from "react";


const menuService = new FBMenuService();


const Eating = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [eating, set_eating] = useState(props.eating)
    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': { type, text } })
    })

    const updateEating = (() => {
        menuService.updateDayEating(eating).then(function (result) {
            if (result.error === false) {
                console.log('Update Eating. Success', result);
            } else {
                addNotification('error', result.message)
            }
        });
    });


    return (
        <>
            <input type="text" className="form-control bg-light border-0" value={eating.name}
                onChange={((e) => { set_eating({ ...eating, name: e.target.value }) })}
                onBlur={(() => { updateEating() })}
                placeholder='Название...' />
            <span className="input-group-text bg-light border-0" id="basic-addon2">
                <div className="btn-group">
                    <select className="form-select bg-light btn-sm px-4 border-0"
                        defaultValue={eating.eating_category_id}
                        onChange={((event) => { set_eating({ ...eating, eating_category_id: event.target.value }) })}
                        onBlur={(() => { updateEating() })}>
                        {state.menu.hasOwnProperty("eatingCategories") && state.menu.eatingCategories.map((category, i) => {
                            return (
                                <option key={i} value={category.id}>{category.name}</option>
                            )
                        })}
                    </select>
                </div>
            </span>
        </>
    );
});

export default Eating;