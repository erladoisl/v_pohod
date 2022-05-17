import { Context } from "../../../../contexts/index";
import MenuService from '../../../../service/MenuService';
import React from 'react';
import { useState } from "react";


const menuService = new MenuService();


const Eating = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [eating, set_eating] = useState(props.eating)


    const updateEating = (() => {
        menuService.updateDayEating(eating).then(function (result) {
            if (result.error === false) {
            } else {
                console.log(result);
            }
        });
    });


    return (
        <>
            <input type="text" className="form-control bg-light border-0" value={eating.name}
                onChange={((e) => { set_eating({ ...eating, name: e.target.value }) })}
                onBlur={(() => { updateEating() })} />
            <span className="input-group-text bg-light border-0" id="basic-addon2">
                <div className="btn-group">

                    <select className="form-select bg-light btn-sm px-4 border-0"
                        defaultValue={parseInt(eating.eating_category_id)}
                        onChange={((event) => { set_eating({ ...eating, eating_category_id: event.target.value }) })}
                        onBlur={(() => { updateEating() })}>
                        {state.menu.hasOwnProperty("eatingCategories") && state.menu.eatingCategories.map((category, i) => {
                            return (
                                <option key={i} value={category.pk}>{category.fields.name}</option>
                            )
                        })}
                    </select>
                </div>
            </span>
        </>
    );
});

export default Eating;