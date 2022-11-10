import React from 'react';
import { editUser } from '../../../service/FBUsersService';
import c from './EditUser.module.css';
import { auth } from "../../../service/FBUsersService";
import { useAuthState } from "react-firebase-hooks/auth";


const EditUser = (() => {
    const [messageHTML, setMessageHTML] = React.useState('');
    const [user, loading] = useAuthState(auth);
    const [formData, setFormData] = React.useState({
        displayName: user.displayName,
        email: user.email,
    });

    const handleSubmit = ((e) => {
        e.preventDefault();
        editUser(formData.displayName).then(function (result) {
            setMessageHTML(getMessageHTML(result));
        });
    });

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

    if (!loading) {
        return (
            <div className={c.text_center}>
                <div className={c.form_signin}>
                    <h1 className="h3 mb-3 fw-normal">Редактирование данных пользователя</h1>

                    <form onSubmit={handleSubmit}>
                        {messageHTML}

                        <div className="form-floating p-1">
                            <input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} name="name" className="form-control" required />

                            <label htmlFor="floatingInput">Login</label>
                        </div>

                        <div className="form-floating p-1">
                            <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="name" className="form-control" disabled />

                            <label htmlFor="floatingInput">email</label>
                        </div>

                        <button className="w-100 btn btn-lg btn-dark" type="submit" >Сохранить</button>
                    </form>
                </div>
            </div>
        );
    }
});


export default EditUser;