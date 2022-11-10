import { useState, createRef, useContext } from 'react';
import { NavLink } from "react-router-dom";
import c from './Registration.module.css';
import { Context } from "../../../contexts/index";
import { registerWithEmailAndPassword } from '../../../service/FBUsersService';
import Contact from '../Contact/Contact';


const Registration = (() => {
    const [state, dispatch] = useContext(Context);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const username = createRef();
    const email = createRef();
    const password = createRef();
    let errorMessageHTML = '';

    const handleSubmit = ((e) => {
        e.preventDefault()
        registerWithEmailAndPassword(username.current.value, email.current.value, password.current.value).then(function (result) {
            if (result.error === false) {
                setErrorMessage(result.message);
            };
        });
    });

    if (error) {
        errorMessageHTML = (
            <div className="alert alert-danger" role="alert">
                {errorMessage}
            </div>);
    };


    return (
        <div className={c.text_center}>
            <div className={c.form_signin}>
                <h1 className="h3 mb-3 fw-normal text-white">Регистрация</h1>

                <form onSubmit={handleSubmit}>
                    {errorMessageHTML}

                    <div className="form-floating p-1">
                        <input ref={username} type="login" className="form-control" required />

                        <label htmlFor="floatingInput">Имя</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={email} type="email" className="form-control" required />

                        <label htmlFor="floatingInput">email</label>
                    </div>

                    <div className="form-floating p-1">
                        <input ref={password} type="password" className="form-control" required />

                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>
                    
                    <button className="w-100 btn btn-lg btn-dark" type="submit" >Зарегистрироваться</button>

                    <NavLink to='/' className="nav-link text-white">
                        Войти
                    </NavLink>
                </form>


                <Contact />
            </div>
        </div>
    );
});


export default Registration;