import * as React from 'react';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className='global-wrapper'>
      <Header />
      <main className='main-wrapper'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
