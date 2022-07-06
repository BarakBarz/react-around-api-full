import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/Logo.svg';

function Header({ isLoggedIn, userData, onClick }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [headerHeightExtension, setHeaderHeightExtension] = useState(false);

  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
    setHeaderHeightExtension(!headerHeightExtension);
  };

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', changeWidth);

    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, []);

  const linkRoute = useLocation().pathname === '/signin' ? '/signup' : 'signin';
  const linkText = linkRoute === '/signup' ? 'Sign up' : 'Log in';

  return (
    <header
      className={
        headerHeightExtension ? 'header header_type_extended-height' : 'header'
      }
    >
      {isLoggedIn ? (
        <div className='header__content'>
          <img src={logo} alt='Around The U.S. Logo' className='logo' />
          {(toggleMenu || screenWidth > 600) && (
            <ul className='header__navbar'>
              <li className='header__list'>
                <p className='header__text'>{userData}</p>
              </li>
              <li className='header__list'>
                <Link
                  className='header__link header__link_type_logout link'
                  to={linkRoute}
                  onClick={() => {
                    onClick();
                    toggleNav();
                  }}
                >
                  Log out
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <div className='header__content header__content_unauthorized'>
          <img src={logo} alt='Around The U.S. Logo' className='logo' />
          <Link
            className={
              screenWidth > 600
                ? 'header__link link'
                : 'header__link header__link_unauthorized link'
            }
            to={linkRoute}
          >
            {linkText}
          </Link>
        </div>
      )}
      {isLoggedIn && (toggleMenu || screenWidth) < 600 && (
        <button
          onClick={toggleNav}
          className={
            !toggleMenu
              ? 'header__nav-button'
              : 'header__nav-button  header__nav-button_close'
          }
        ></button>
      )}
    </header>
  );
}

export default Header;

