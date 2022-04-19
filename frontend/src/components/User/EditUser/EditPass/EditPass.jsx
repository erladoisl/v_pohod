import React from 'react';
import { UserContext } from "../../../../contexts/index"

export default function EditPass() {
    const [state, dispatch] = React.useContext(UserContext)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState()
    const oldPassword = React.createRef()
    const password1 = React.createRef()
    const password2 = React.createRef()
    let errorMessageHTML = ''

    const handleSubmit = ((e) => {
        e.preventDefault()
        let formData = {
            'token': state.user.token,
            'user_name': state.user.user_id,
            'oldPassword': oldPassword.current.value,
            'password1': password1.current.value,
            'password2': password2.current.value,
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
        <div className='row m-5'>
            <div className='col-10 m-auto'>
                <h1 className="h3 mb-3 fw-normal">Изменение пароля</h1>
                <form onSubmit={handleSubmit}>
                    {errorMessageHTML}

                    <div className="form-floating p-1">
                        <input ref={oldPassword} type="password" className="form-control" required/>
                        <label htmlFor="floatingPassword">Старый пароль</label>
                    </div>
                    <div className="form-floating p-1">
                        <input ref={password1} type="password" className="form-control" required/>
                        <label htmlFor="floatingPassword">Новый пароль</label>
                    </div>
                    <div className="form-floating p-1">
                        <input ref={password2} type="password" className="form-control" required/>
                        <label htmlFor="floatingPassword">Повторите новый пароль</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Сохранить</button>
                </form>
            </div>
        </div>
    )
}