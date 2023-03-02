import React from 'react';
import { format } from 'date-fns';
import semver from 'semver';
import { StaticQuery, graphql, Link } from 'gatsby';
import { Content } from './_elements';
import Wrapper from './_wrapper';
import { H3 } from '../../components/Typography';

const PRIVACY = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/legal/privacy/" } }
    ) {
      edges {
        node {
          id
          html
          frontmatter {
            version
            lastEdited
          }
        }
      }
    }
  }
`;

export default () => (
  <Wrapper>
    <StaticQuery
      query={PRIVACY}
      render={({ allMarkdownRemark: { edges } }) => {
        const versions = edges.map(edge => edge.node.frontmatter.version);
        const all = versions.sort(semver.rcompare);
        const latestVersion = edges.find(
          edge => edge.node.frontmatter.version === all[0]
        );
        const olderVersions = edges.filter(
          edge => edge.node.frontmatter.version !== all[0]
        );

        return (
          <>
            <h1>Privacy Policy</h1>
            Version {latestVersion.node.frontmatter.version} (
            {format(latestVersion.node.frontmatter.lastEdited, 'MM/DD/YYYY')}).
            <a
              css={`
                display: block;
                margin-top: 8px;
              `}
              href="#previous-versions"
            >
              Click here for previous versions of our Privacy Policy.
            </a>
            <Content
              dangerouslySetInnerHTML={{ __html: latestVersion.node.html }}
            />
            {olderVersions.length ? (
              <>
                <H3 id="previous-versions">
                  Previous versions of our Privacy Policy
                </H3>
                <ul
                  css={`
                    margin-top: 16px;
                  `}
                >
                  {olderVersions.map(version => (
                    <li>
                      Version {version.node.frontmatter.version} (
                      {format(
                        version.node.frontmatter.lastEdited,
                        'MM/DD/YYYY'
                      )}
                      ){' '}
                      <Link
                        to={`legal/privacy/version/${version.node.frontmatter.version}`}
                      >
                        (Website)
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        );
      }}
    />
  </Wrapper>
);
