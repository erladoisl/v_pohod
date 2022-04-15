import { useState, createRef, useContext } from 'react'
import UsersService from '../../service/UsersService';
import c from './Login.module.css'
import { UserContext } from "../../contexts/index"
const usersService = new UsersService();

const Login = (props) => {
    const [state, dispatch] = useContext(UserContext)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const login = createRef()
    const password = createRef()
    let errorMessageHTML = ''

    const handleSubmit = (() => {
        console.log(login.current.value, password.current.value)
        let user = usersService.logIn(login.current.value, password.current.value).then(function (result) {
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
            <div class="alert alert-danger" role="alert">
                {errorMessage}
            </div>);
    }

    return (
        <div className={c.text_center}>
            <div className={c.form_signin}>
                {/* <form onSubmit={handleSubmit}> */}
                <h1 className="h3 mb-3 fw-normal">Вход</h1>
                {errorMessage}

                <div className="form-floating p-1">
                    <input ref={login} type="login" className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Имя</label>
                </div>
                <div className="form-floating p-1">
                    <input ref={password} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Пароль</label>
                </div>

                <div className="checkbox mb-3 text-white">
                    <label>
                        <input type="checkbox" value="remember-me" /> Запомнить меня
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-dark" onClick={handleSubmit} type="submit" >Войти</button>
                <p className="mt-5 mb-3 text-muted">© Rakhi 2022</p>
                {/* </form> */}
            </div>
        </div>
    )
}

export default Login;