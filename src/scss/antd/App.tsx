import React from 'react';
import logo from './logo.svg';
import '../antd/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { NavBar } from '../../app/shared/components/layoutAguas/NavBar';
import { Bandeja } from '../../app/aguasconsumo/Components/Bandeja';
import { Servicios } from '../../app/aguasconsumo/Components/Servicios';
import Footer from '../../app/shared/components/layoutAguas/Footer';

function App() {
  console.log('entrotsx');
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/Servicios' exact component={Servicios} />
        <Route path='/Bandeja' exact component={Bandeja} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
