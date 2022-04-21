import { useState, createRef, useContext } from 'react'
import { NavLink } from "react-router-dom";
import UsersService from '../../../service/UsersService';
import c from './Login.module.css'
import { Context } from "../../../contexts/index"


const usersService = new UsersService();


const Login = () => {
    const [state, dispatch] = useContext(Context)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const login = createRef()
    const password = createRef()
    let errorMessageHTML = ''
    

    const handleSubmit = ((e) => {
        e.preventDefault()
        usersService.logIn(login.current.value, password.current.value).then(function (result) {
            if (result.error == false) {
                dispatch({ 'type': 'authorization', 'user': result.data })
            } else {
                setError(result.error)
                setErrorMessage(result.message)
            }
        });
    });


    if (error) {
        errorMessageHTML = (
            <div className="alert alert-danger" role="alert">
                {errorMessage}
            </div>);
    }


    return (
        <div className={c.text_center}>
            <div className={c.form_signin}>
                <form onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Вход</h1>
                    {errorMessageHTML}

                    <div className="form-floating py-1">
                        <input ref={login} type="name" className="form-control" required />
                        <label htmlFor="floatingInput">Имя</label>
                    </div>
                    <div className="form-floating py-1">
                        <input ref={password} type="password" className="form-control" required />
                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>


                    <button className="w-100 btn btn-lg btn-dark my-1" type="submit" >Войти</button>

                    <NavLink to='/registration' className="nav-link text-white">
                        Зарегистрироваться
                    </NavLink>

                    <p className="mt-5 mb-3 text-muted">© Rakhi 2022</p>
                </form>
            </div>
        </div>
    )
}

export default Login;