import React from 'react';
import { UserContext } from "../../../contexts/index"

export default function EditUser() {
    const [state, dispatch] = React.useContext(UserContext)
    const [error, setError] = React.useState({
        error: false,
        errorMessage: ''
      });
    let errorMessageHTML = ''
    console.log(state.user)
    const [formData, setFormData] = React.useState({
        username: state.user.name,
        email: state.user.email,
        first_name: state.user.first_name,
        last_name: state.user.last_name,
      });
    
    const handleSubmit = ((e) => {
        setFormData({key: e.target.value})
        e.preventDefault()
        // let user = usersService.registration(formData).then(function (result) {
        //     if (result.error == false) {
        //         dispatch({ 'type': 'authorization', 'user': result.data })
        //     } else {
        //         setError({errer: result.error
        //                   errorMessage: result.message})
        //     }
        // });
    });

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

                    <div className="form-floating p-1">
                        <input value={formData.username} onChange={handleSubmit} name="username" className="form-control" required />
                        <label htmlFor="floatingInput">Login</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.first_name} onChange={handleSubmit} type="first_name" className="form-control" />
                        <label htmlFor="floatingInput">Имя</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.last_name} onChange={handleSubmit} type="last_name" className="form-control" />
                        <label htmlFor="floatingInput">Фамилия</label>
                    </div>
                    <div className="form-floating p-1">
                        <input value={formData.email} onChange={handleSubmit} type="name" className="form-control" />
                        <label htmlFor="floatingInput">email</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Сохранить</button>
                </form>
            </div>
        </div>
    )
}