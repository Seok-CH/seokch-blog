import * as React from 'react';
import { Link } from 'gatsby';
import Logo from '../../assets/logo.inline.svg';

const Header = () => {
  return (
    <header className='blog-header'>
      <nav className='blog-nav'>
        <Link to='/' className='logo-link'>
          <Logo />
          <h1 className='logo-name'>Chad Blog</h1>
        </Link>
        <div className='divider' />
        {/* <Link to='/category' className='nav-item'>
          Category
        </Link>
        <Link to='/about' className='nav-item'>
          About
        </Link> */}
      </nav>
    </header>
  );
};

export default Header;
