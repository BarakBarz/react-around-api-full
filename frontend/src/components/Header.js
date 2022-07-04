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
    <header className={headerHeightExtension ? 'header header_type_extended-height' : 'header'}>
      <div className="header__content">
        <img src={logo} alt="Around The U.S. Logo" className="logo" />
        {isLoggedIn
          ? (toggleMenu || screenWidth > 600) && (
              <ul className="header__navbar">
                <li className="header__text">{userData}</li>
                <li>
                  <Link
                    className={'header__link header__link_type_logout link'}
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
            )
          : (toggleMenu || screenWidth > 600) && (
              <ul className="header__navbar">
                <li>
                  <Link className={'header__link link'} to={linkRoute}>
                    {linkText}
                  </Link>
                </li>
              </ul>
            )}
      </div>
      {(toggleMenu || screenWidth) < 600 && <button onClick={toggleNav} className="header__nav-button"></button>}
    </header>
  );
}

export default Header;

