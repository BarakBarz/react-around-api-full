import { Link, useLocation } from 'react-router-dom';
import logo from '../images/Logo.svg';
function Header({ isLoggedIn, userData, onClick }) {
  const linkRoute = useLocation().pathname === '/signin' ? '/signup' : 'signin';
  const linkText = linkRoute === '/signup' ? 'Sign up' : 'Log in';
  return (
    <header className="header">
      <img src={logo} alt="Around The U.S. Logo" className="logo" />
      <div className="header__navbar">
        {isLoggedIn ? (
          <>
            <p className="header__text">{userData}</p>
            <Link
              className={'header__link header__link_type_logout link'}
              to={linkRoute}
              onClick={onClick}
            >
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link className={'header__link link'} to={linkRoute}>
              {linkText}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

