import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import './Styles/loginNav.css';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import language from './components/language/language';

export default class LoginNav extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <div>
          <Navbar className="loginNav" light toggleable color="info" fixed="top">
            <NavbarBrand>{language[localStorage.getItem('language')].loginNav}</NavbarBrand>
          </Navbar>
        </div>
      </ErrorBoundary>
    );
  }
}
