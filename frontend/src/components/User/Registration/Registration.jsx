import { useState, createRef, useContext } from 'react';
import { NavLink } from "react-router-dom";
import c from './Registration.module.css';
import { Context } from "../../../contexts/index";
import UsersService from '../../../service/UsersService';
const usersService = new UsersService();

const Registration = (() => {
    const [state, dispatch] = useContext(Context);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const username = createRef();
    const email = createRef();
    const first_name = createRef();
    const last_name = createRef();
    const password1 = createRef();
    const password2 = createRef();
    let errorMessageHTML = '';

    const handleSubmit = ((e) => {
        e.preventDefault();
        let formData = {
            'username': username.current.value,
            'email': email.current.value,
            'first_name': first_name.current.value,
            'last_name': last_name.current.value,
            'password1': password1.current.value,
            'password2': password2.current.value,
        };

        usersService.registration(formData).then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'authorization', 'user': result.data });
            } else {
                setError(result.error);
                setErrorMessage(result.message);
            };
        });
    });

    if (error) {
        errorMessageHTML = (
            <div class="alert alert-danger" role="alert">
                {errorMessage}
            </div>);
    };

    
    return (
        <div className={c.text_center}>
            <div className={c.form_signin}>
                <h1 className="h3 mb-3 fw-normal">Регистрация</h1>

                <form onSubmit={handleSubmit}>
                    {errorMessageHTML}

                    <div className="form-floating p-1">
                        <input ref={username} type="login" className="form-control" required/>
                        
                        <label htmlFor="floatingInput">Login</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={first_name} type="first_name" className="form-control" required/>
                        
                        <label htmlFor="floatingInput">Имя</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={last_name} type="last_name" className="form-control" required/>
                        
                        <label htmlFor="floatingInput">Фамилия</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={email} type="name" className="form-control" required/>
                        
                        <label htmlFor="floatingInput">email</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={password1} type="password" className="form-control" required/>
                        
                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={password2} type="password" className="form-control" required/>
                        
                        <label htmlFor="floatingPassword">Повторите пароль</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Зарегистрироваться</button>
                    
                    <NavLink to='/' className="nav-link text-white">
                        Войти
                    </NavLink>
                </form>

                <p className="mt-5 mb-3 text-muted">© Rakhi 2022</p>
            </div>
        </div>
    );
});


export default Registration;