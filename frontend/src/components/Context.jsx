import React from 'react';
import { UserContext } from "../contexts/index"
import Footer from './Footer/Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Hikes from './Hikes/Hikes';
import Login from './Login/Login';
import Raskladki from './Raskladki/Raskladki';

export default function Context() {
  const [state, dispatch] = React.useContext(UserContext)
  console.log(state)
  const pages =
    [{
      'link': '/',
      node: <Hikes param1={'42'} param2={'43'} />
    },{
      'link': '/raskladki',
      node: <Raskladki param1={'42'} param2={'43'} />,
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

          <Footer />
        </main>
      </BrowserRouter>
    )
  } else {
    return <Login />
  }
}