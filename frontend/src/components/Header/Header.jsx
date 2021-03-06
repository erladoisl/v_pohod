import { NavLink } from "react-router-dom";
import { useContext } from 'react';
import { Context } from "../../contexts/index";
import { Notification } from "../Notification/Notification";

const Header = (() => {
  const [state, dispatch] = useContext(Context);
  const logOut = (() => {
    dispatch({ 'type': 'update_user', 'user': undefined });
    document.cookie = "token=unset; max-age=0";
  });

  return (
    <header>
      <Notification />
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <NavLink to='/' className="navbar-brand">
            ВПоход
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <NavLink to='/hikes' className="nav-link ">
                  Походы
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to='/dictionary' className="nav-link ">
                  Словарики
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to='/help' className="nav-link ">
                  Помощь
                </NavLink>
              </li>
            </ul>
            <div className="ms-auto link-light" >
              <span className="d-sm-inline-block my-2 my-md-0 ms-md-3 text-white" >
                <NavLink to='/edit-user' className="nav-link text-white">
                  {state.user.name}
                </NavLink></span>
              <button className="btn btn-dark d-lg-inline-block my-2 my-md-0 ms-md-3 text-white" onClick={logOut}>Выйти</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});


export default Header;
