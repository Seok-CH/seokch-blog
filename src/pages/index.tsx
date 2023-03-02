import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';

const BlogIndexPage: React.FC<PageProps<Queries.BlogIndexPageQuery>> = ({
  data,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout title={siteTitle}>
        <p>no content</p>
      </Layout>
    );
  }

  return (
    <Layout title={siteTitle}>
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const title = post.frontmatter?.title || post.fields?.slug;

          return (
            <li key={post.fields?.slug}>
              <article
                className='post-list-item'
                itemScope
                itemType='http://schema.org/Article'
              >
                <header>
                  <h2>
                    <Link to={post.fields?.slug || ''} itemProp='url'>
                      <span itemProp='headline'>{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter?.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        post.frontmatter?.description || post.excerpt || '',
                    }}
                    itemProp='description'
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default BlogIndexPage;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title='All posts' />;

export const pageQuery = graphql`
  query BlogIndexPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;
