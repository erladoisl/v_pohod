import React from 'react';
import { UserContext } from "../contexts/index"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header/Header';
import Login from './User/Login/Login';
import Raskladki from './Raskladki/Raskladki';
import Registration from './User/Registration/Registration';
import User from './User/User';

export default function Context() {
  const [state, dispatch] = React.useContext(UserContext)
  console.log(state)
  const pages =
    [{
      'link': 'raskladki',
      node: <Raskladki param1={'42'} param2={'43'} />,
    },
    {
      'link': 'edit-user',
      node: <User />,
    }]

  if (state.user) {
    return (
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {pages.map((item, index) => {
              return <Route path={item.link} element={item.node} key={`page_${index}`} />
            })}
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
    )
  }
}