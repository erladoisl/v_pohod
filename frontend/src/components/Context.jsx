import React from 'react';
import { Context as MainContext} from "../contexts/index"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header/Header';
import Login from './User/Login/Login';
import Registration from './User/Registration/Registration';
import User from './User/User';
import Dictionary from './Dictionary/Dictionary';
import Hikes from './Hikes/Hikes';

export default function Context() {
  const [state, dispatch] = React.useContext(MainContext)
  window.state = state
  const pages =
    [{
      'link': 'hikes',
      node: <Hikes param1={'42'} param2={'43'} />,
    },
    {
      'link': 'edit-user',
      node: <User />,
    },
    {
      'link': 'dictionary',
      node: <Dictionary />,
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