import * as React from 'react';
import { Link, graphql, PageProps, HeadFC } from 'gatsby';
import Giscus from '@giscus/react';

import Layout from '../components/Layout';
import Seo from '../components/seo';

const BlogPostTemplate: React.FC<PageProps<Queries.BlogPostBySlugQuery>> = ({
  data: { previous, next, markdownRemark: post },
}) => {
  return (
    <Layout>
      <article
        className='blog-post'
        itemScope
        itemType='http://schema.org/Article'
      >
        <header>
          <h1 itemProp='headline'>{post?.frontmatter?.title}</h1>
          <p>{post?.frontmatter?.date}</p>
          <div className='post-tag'>
            {post?.frontmatter?.tags?.map((tag) => (
              <span className='post-tag-item' key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          itemProp='articleBody'
        />
        <hr />
        <Giscus
          id='comments'
          repo={(process.env.REACT_APP_REPO as `${string}/${string}`) || ''}
          repoId={process.env.REACT_APP_REPO_ID || ''}
          category={process.env.REACT_APP_CATEGORY}
          categoryId={process.env.REACT_APP_CATEGORY_ID}
          strict='0'
          mapping='og:title'
          reactionsEnabled='1'
          emitMetadata='0'
          inputPosition='top'
          theme='light'
          lang='ko'
          loading='lazy'
        />
      </article>
      <nav className='blog-post-nav'>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields?.slug || ''} rel='prev'>
                ← {previous.frontmatter?.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields?.slug || ''} rel='next'>
                {next.frontmatter?.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export const Head: HeadFC<Queries.BlogPostBySlugQuery> = ({
  data: { markdownRemark: post },
}: {
  data: Queries.BlogPostBySlugQuery;
}) => {
  return (
    <Seo
      title={post?.frontmatter?.title || ''}
      description={post?.frontmatter?.description || post?.excerpt || ''}
    />
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY[년] MM[월] DD[일]")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
