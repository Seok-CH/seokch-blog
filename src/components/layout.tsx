import * as React from 'react';
import { Link } from 'gatsby';

type Props = {
  title: string;
  children: React.ReactNode;
};

const Layout = ({ title, children }: Props) => {
  const header = (
    <h1 className='main-heading'>
      <Link to='/'>{title}</Link>
    </h1>
  );

  return (
    <div className='global-wrapper'>
      <header className='global-header'>{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href='https://www.gatsbyjs.com'>Gatsby</a>
      </footer>
    </div>
  );
};

export default Layout;
