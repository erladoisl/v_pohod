import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Context } from "../../contexts/index"
import EditUser from './EditUser/EditUser';
import EditPass from './EditUser/EditPass/EditPass';

export default function User() {
    const [state, dispatch] = React.useContext(Context)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState()
    const username = React.createRef()
    const email = React.createRef()
    const first_name = React.createRef()
    const last_name = React.createRef()
    let errorMessageHTML = ''

    const handleSubmit = ((e) => {
        e.preventDefault()
        let formData = {
            'username': username.current.value,
            'email': email.current.value,
            'first_name': first_name.current.value,
            'last_name': last_name.current.value,
        }
        console.log(formData)

        // let user = usersService.registration(formData).then(function (result) {
        //     if (result.error == false) {
        //         dispatch({ 'type': 'authorization', 'user': result.data })
        //     } else {
        //         setError(result.error)
        //         setErrorMessage(result.message)
        //     }
        // });
    });

    if (error) {
        errorMessageHTML = (
            <div className="alert alert-danger" role="alert">
                {errorMessage}
            </div>);
    }


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