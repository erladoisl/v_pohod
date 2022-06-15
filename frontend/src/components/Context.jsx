import React from 'react';
import { Context as MainContext } from "../contexts/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Login from './User/Login/Login';
import Registration from './User/Registration/Registration';
import User from './User/User';
import Dictionary from './Dictionary/Dictionary';
import Hikes from './Hikes/Hikes';
import Hike from './Hikes/Hike/Hike';
import UsersService from '../service/UsersService';
import getCookie from '../service/util';
import UpdateHike from './Hikes/UpdateHike/UpdateHike';
import Help from './Help/Help';


const usersService = new UsersService();


const Context = (() => {
  const [state, dispatch] = React.useContext(MainContext);
  window.state = state;


  const updateUserInfo = (() => {
    usersService.getAuthUser().then(function (result) {
      if (result.error === false) {
        dispatch({ 'type': 'update_user', 'user': result.data });
      } else {
        console.log(result);
      };
    });
  });

  if (!state.hasOwnProperty("user") && getCookie('token')) {
    updateUserInfo();
  }

  const pages =
    [{
      'link': 'hikes',
      node: <Hikes param1={'42'} param2={'43'} />,
    },
    {
      'link': 'new-hike',
      node: <UpdateHike />
    },
    {
      'link': 'hike-view',
      node: <Hike />
    },
    {
      'link': 'edit-user',
      node: <User />,
    },
    {
      'link': 'dictionary',
      node: <Dictionary />,
    },
    {
      'link': 'help',
      node: <Help />,
    }];

  if (state.user) {
    return (
      <BrowserRouter>
        <Header />

        <main className='position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light'>
          <Routes>
            {pages.map((item, index) => {
              return (
                <Route path={item.link} element={item.node} key={`page_${index}`} />
              )
            })}

            <Route path="*" element={<Hikes />} />
          </Routes>
        </main>
      </BrowserRouter>
    )
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/registration' element={<Registration />} />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  };
});


export default Context;