import { NavLink } from "react-router-dom";
import { useContext } from 'react'
import { UserContext } from "../../contexts/index"

function Header() {
  const [state, dispatch] = useContext(UserContext)
  console.log(state)

  const logOut = (() => {
    dispatch({ 'type': 'authorization', 'user': undefined })
  });
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">ВПоход</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <NavLink to='/' className="nav-link ">
                  Главная
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to='/raskladki' className="nav-link ">
                  Архив Раскладок
                </NavLink>
              </li>
            </ul>
            <div className="ms-auto link-light" >
              <span className="d-lg-inline-block my-2 my-md-0 ms-md-3 text-white" >{state.user.name}</span>
              <button className="btn btn-dark d-lg-inline-block my-2 my-md-0 ms-md-3 text-white" onClick={logOut}>Выйти</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
