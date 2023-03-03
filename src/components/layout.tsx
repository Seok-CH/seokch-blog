import * as React from 'react';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className='global-wrapper'>
      <Header />
      <main className='main-wrapper'>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href='https://www.gatsbyjs.com'>Gatsby</a>
      </footer>
    </div>
  );
};

export default Layout;
