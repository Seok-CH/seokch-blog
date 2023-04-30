import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import Seo from '../components/seo';

const BookIndexPage: React.FC<PageProps<Queries.BookIndexPageQuery>> = ({
  data,
}) => {
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout>
        <p>no content</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <ol className='post-list'>
        {posts.map((post) => {
          const title = post.frontmatter?.title || post.fields?.slug;

          return (
            <li key={post.fields?.slug} className='post-list-item'>
              <article itemScope itemType='http://schema.org/Article'>
                <div>
                  <header>
                    <h2>
                      <Link
                        to={
                          `/${post.frontmatter?.type}${post.fields?.slug}` || ''
                        }
                        itemProp='url'
                      >
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
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default BookIndexPage;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title='Book' />;

export const pageQuery = graphql`
  query BookIndexPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/(content/book)/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt(truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY[년] MM[월] DD[일]")
          title
          description
          type
        }
      }
    }
  }
`;
