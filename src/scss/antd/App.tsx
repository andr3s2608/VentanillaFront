import React from 'react';
import logo from './logo.svg';
import '../antd/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { NavBar } from '../../app/shared/components/layoutAguas/NavBar';
import { Servicios } from '../../app/aguasconsumo/Components/Servicios';
import Footer from '../../app/shared/components/layoutAguas/Footer';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/Servicios' exact component={Servicios} />

      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
