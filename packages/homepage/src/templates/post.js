import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React from 'react';

import { Sandpack } from '@codesandbox/sandpack-react';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import { AuthorImage } from '../components/PostElements';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import rehypeReact from '../utils/rehype';

import {
  Article,
  Header,
  PostTitle,
  AuthorContainer,
  Image,
  MetaData,
  PostContainer,
} from './_post.elements';

// eslint-disable-next-line new-cap
const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    sandpack1: () => {
      return (
        <Sandpack
          theme="sandpack-dark"
          template="react"
          customSetup={{
            dependencies: { '@codesandbox/sandpack-react': 'latest' },
            files: {
              '/App.js': `import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

const APP_CODE = \`
import { sum } from 'lodash';

export default function App() {
  return <>
    <h1>Hello Sandpack!</h1>
    <h2>{sum([2, 3])}</h2>
  </>
}
\`.trim();

export default function App() {
  return (
    <Sandpack
      customSetup={{
        dependencies: {
          lodash: "latest"
        },
        files: {
          "/App.js": {
            code: APP_CODE
          }
        }
      }}
      template="react"
    />
  );
}
`,
            },
          }}
        />
      );
    },
    sandpack2: () => {
      return (
        <Sandpack
          theme="sandpack-dark"
          template="react"
          customSetup={{
            dependencies: { '@codesandbox/sandpack-react': 'latest' },
            files: {
              '/TranspiledCode.js': `import { useSandpack } from "@codesandbox/sandpack-react";

export const TranspiledCode = () => {
  const { sandpack } = useSandpack();

  if (
    !sandpack.bundlerState?.transpiledModules[sandpack.activePath + ":"]?.source
      ?.compiledCode
  ) {
    return null;
  }

  return (
    <textarea
      style={{ width: "100%", height: "100%", minHeight: 300 }}
      value={
        sandpack.bundlerState.transpiledModules[sandpack.activePath + ":"]
          .source.compiledCode
      }
      readOnly
    />
  );
};`,
              '/Editor.js': `import { useSandpack } from "@codesandbox/sandpack-react";

export const Editor = () => {
  const { sandpack } = useSandpack();

  return (
    <textarea
      style={{ width: "100%", height: "100%", minHeight: 300 }}
      value={sandpack.files[sandpack.activePath].code}
      onChange={(e) => {
        sandpack.updateCurrentFile(e.target.value);
      }}
    />
  );
};`,
              '/App.js': `import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider
} from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";
import { Editor } from "./Editor";
import { TranspiledCode } from "./TranspiledCode";

const APP_CODE = \`
import { sum } from 'lodash';

export default function App() {
  return <>
    <h1>Hello Sandpack!</h1>
    <h2>{sum([2, 3])}</h2>
  </>
}
\`.trim();

export default function App() {
  return (
    <SandpackProvider
      customSetup={{
        dependencies: {
          lodash: "latest"
        },
        files: {
          "/App.js": {
            code: APP_CODE
          }
        }
      }}
      template="react"
    >
      <SandpackLayout>
        <Editor />
        <TranspiledCode />
        {/* <SandpackPreview /> */}
      </SandpackLayout>
    </SandpackProvider>
  );
}`,
            },
          }}
        />
      );
    },
  },
}).Compiler;

export default ({
  data: {
    blogPost: {
      fields: { authors, date, description, photo, title },
      frontmatter: {
        banner: { publicURL: banner },
      },
      htmlAst,
    },
  },
}) => {
  return (
    <Layout>
      <Article>
        <TitleAndMetaTags
          description={description}
          image={banner}
          title={`${title} - CodeSandbox Blog`}
        />

        <Header>
          <Link to="blog">CodeSandbox Blog</Link>

          <PostTitle>{title}</PostTitle>

          <MetaData>
            {authors.map(author => (
              <AuthorContainer key={author}>
                {authors.length === 1 && (
                  <AuthorImage alt={author} src={photo} />
                )}

                <h4>{author}</h4>
                <date>{format(date, 'MMM / DD / YYYY')}</date>
              </AuthorContainer>
            ))}
          </MetaData>
        </Header>

        <Image alt={title} src={banner} />

        <PageContainer width={768}>
          <PostContainer>{renderAst(htmlAst)}</PostContainer>
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
