import * as React from 'react';
import Layout from '../components/Layout';
import Seo from '../components/seo';

const index = () => {
  return (
    <Layout>
      <div>chad blog</div>
    </Layout>
  );
};

export const Head = () => <Seo title='Home' />;

export default index;
