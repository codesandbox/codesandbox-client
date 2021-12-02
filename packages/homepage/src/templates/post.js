import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React from 'react';
import camelCase from "lodash.camelCase"

import {Sandpack} from "@codesandbox/sandpack-react"
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import { AuthorImage } from '../components/PostElements';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import rehypeReact from "./rehype"
import "@codesandbox/sandpack-react/dist/index.css"

import {
  Article,
  Header,
  PostTitle,
  AuthorContainer,
  Image,
  MetaData,
  PostContainer,
} from './_post.elements';


const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { "sandpack": ({children, ...props}) =>  {
    const sandpackProps = Object.entries(props).reduce((acc, [key, value]) => {
      const kebabCase = camelCase(key)

      return {...acc, [kebabCase]: /{/.test(value) ? JSON.parse(value): value}
    }, {})

    return <Sandpack theme="sandpack-dark" {...sandpackProps} />;
  } }
}).Compiler

export default ({
  data: {
    blogPost: {
      fields: { authors, date, description, photo, title },
      frontmatter: {
        banner: { publicURL: banner },
      },
      html,
      htmlAst
    },
  },
}) => {

    return (
      <Layout>
        <Article>
          <TitleAndMetaTags
            description={description}
            image={banner}
            title={`${title} - CodeSandbox Blog`} />

          <Header>
            <Link to="blog">CodeSandbox Blog</Link>

            <PostTitle>{title}</PostTitle>

            <MetaData>
              {authors.map(author => (
                <AuthorContainer key={author}>
                  {authors.length === 1 && <AuthorImage alt={author} src={photo} />}

                  <h4>{author}</h4>
                  <date>{format(date, 'MMM / DD / YYYY')}</date>
                </AuthorContainer>
              ))}
            </MetaData>
          </Header>

          <Image alt={title} src={banner} />

          <PageContainer width={768}>
            <PostContainer>
              {renderAst(htmlAst)}
            </PostContainer>
          </PageContainer>
        </Article>
      </Layout>
    );
  };

export const pageQuery = graphql`
  query Post($id: String) {
    blogPost: markdownRemark(id: { eq: $id }) {
      fields {
        authors
        date
        description
        photo
        slug
        title
      }
      frontmatter {
        banner {
          publicURL
        }
      }
      html
      htmlAst
    }
  }
`;
