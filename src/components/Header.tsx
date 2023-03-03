import * as React from 'react';
import { Link } from 'gatsby';

const Header = () => {
  return (
    <header className='global-header'>
      <div className='inner-container'>
        <nav>
          <Link to='/' className='nav-item'>
            CHAD
          </Link>
          <Link to='/category' className='nav-item'>
            카테고리
          </Link>
        </nav>
        <div></div>
      </div>
    </header>
  );
};

export default Header;
