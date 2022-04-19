import React from 'react';
import { UserContext } from "../../../../contexts/index"
import UsersService from '../../../../service/UsersService';
const usersService = new UsersService();

export default function EditPass() {
    const [state, dispatch] = React.useContext(UserContext)
    const [successMessage, setSuccessMessage] = React.useState('')
    const [error, setError] = React.useState({
        error: false,
        errorMessage: ''
    })
    const [formData, setFormData] = React.useState({
        'name': state.user.name,
        'oldPassword': '',
        'password1': '',
        'password2': '',
    });
    let errorMessageHTML = ''
    let successMessageHTML = ''

    const handleSubmit = ((e) => {
        e.preventDefault()

        let user = usersService.changePass(formData).then(function (result) {
            if (result.error == false) {
                setSuccessMessage(result.message)
                setError({error: false})
            } else {
                setError({
                    error: result.error,
                    errorMessage: result.message
                })
                setSuccessMessage('')
            }
        });
    });

    if (successMessage != '') {
        successMessageHTML = (
            <div className="alert alert-success" role="alert">
                {successMessage}
            </div>);
    }

    if (error.error) {
        errorMessageHTML = (
            <div className="alert alert-danger" role="alert">
                {error.errorMessage}
            </div>);
    }

    return (
        <div className='row m-5'>
            <div className='col-10 m-auto'>
                <h1 className="h3 mb-3 fw-normal">Изменение пароля</h1>
                <form onSubmit={handleSubmit}>
                    {errorMessageHTML}
                    {successMessageHTML}

                    <div className="form-floating p-1">
                        <input value={formData.oldPassword} onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} type="password" className="form-control" required />
                        <label htmlFor="floatingPassword">Старый пароль</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.password1} onChange={(e) => setFormData({ ...formData, password1: e.target.value })} type="password" className="form-control" required />
                        <label htmlFor="floatingPassword">Новый пароль</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.password2} onChange={(e) => setFormData({ ...formData, password2: e.target.value })} type="password" className="form-control" required />
                        <label htmlFor="floatingPassword">Повторите новый пароль</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Сохранить</button>
                </form>
            </div>
        </div>
    )
}