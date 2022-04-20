import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Context } from "../../contexts/index"
import EditUser from './EditUser/EditUser';
import EditPass from './EditUser/EditPass/EditPass';

export default function User() {
    return (
        <div className='container-fluid'>
            <div className=" p-0 my-5 text-center ">
                <div className='row'>
                    <div className='col-8 p-5 m-auto'>
                        <EditUser />
                        <EditPass />
                    </div>
                </div>
            </div>
        </div>
    )
}