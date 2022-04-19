import React from 'react';
import { UserContext } from "../../../contexts/index"
import UsersService from '../../../service/UsersService';
const usersService = new UsersService();

export default function EditUser() {
    const [state, dispatch] = React.useContext(UserContext)
    const [successMessage, setSuccessMessage] = React.useState('')
    let errorMessageHTML = ''
    let successMessageHTML = ''
    const [error, setError] = React.useState({
        error: false,
        errorMessage: ''
      });
    const [formData, setFormData] = React.useState({
        name: state.user.name,
        email: state.user.email,
        first_name: state.user.first_name,
        last_name: state.user.last_name,
      });
    
    const handleSubmit = ((e) => {
        console.log(formData)
        e.preventDefault()
        let response = usersService.editUser(formData).then(function (result) {
            if (result.error == false) {
                dispatch({ 'type': 'edit_user', 'user': formData })
                setSuccessMessage(result.message)
            } else {
                setError({errer: result.error,
                          errorMessage: result.message})
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
                <h1 className="h3 mb-3 fw-normal">Редактирование данных пользователя</h1>
                <form onSubmit={handleSubmit}>
                    {errorMessageHTML}
                    {successMessageHTML}

                    <div className="form-floating p-1">
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} name="name" className="form-control" required disabled />
                        <label htmlFor="floatingInput">Login</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} type="first_name" className="form-control" />
                        <label htmlFor="floatingInput">Имя</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} type="last_name" className="form-control" />
                        <label htmlFor="floatingInput">Фамилия</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="name" className="form-control" />
                        <label htmlFor="floatingInput">email</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Сохранить</button>
                </form>
            </div>
        </div>
    )
}