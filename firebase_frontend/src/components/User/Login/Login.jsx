import { useState, useEffect, createRef, useContext } from 'react';
import { NavLink } from "react-router-dom";
import c from './Login.module.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../../../service/FBUsersService";
import { Context } from "../../../contexts/index";
import Contact from '../Contact/Contact';
import { useNavigate } from "react-router-dom";


const Login = (() => {
    const [state, dispatch] = useContext(Context);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const login = createRef();
    const password = createRef();
    const navigate = useNavigate();
    let errorMessageHTML = '';
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate("/hikes");
    }, [user, loading, navigate]);


    const handleSubmit = ((e) => {
        e.preventDefault()
        logInWithEmailAndPassword(login.current.value, password.current.value).then(function (result) {
            if (result.error === false) {
                // dispatch({ 'type': 'update_user', 'user': result.data })
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
                    <h1 className="h3 mb-3 fw-normal  text-white">Вход</h1>

                    {errorMessageHTML}

                    <div className="form-floating py-1">
                        <input ref={login} type="name" className="form-control" required />

                        <label htmlFor="floatingInput">e-mail</label>
                    </div>

                    <div className="form-floating py-1">
                        <input ref={password} type="password" className="form-control" required />

                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-dark my-1" type="submit" >Войти</button>
                    <a href="#" className="nav-link text-white" onClick={signInWithGoogle}>Войти через Google</a>
                    <NavLink to='/registration' className="nav-link text-white">
                        Зарегистрироваться
                    </NavLink>

                    <Contact />
                </form>
            </div>
        </div>
    );
});


export default Login;