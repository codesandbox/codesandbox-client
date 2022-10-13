import React, { useState } from 'react';

import styled from 'styled-components';
import { Caption, Title } from './_elements';

/**
 * DATA
 */
const team_plans = [
  {
    body: [
      {
        title: 'Editors',
        caption: 'Maximum number of editors in a team.',
        team_free: '5',
        team_pro: '20',
        org_custom: 'Unlimited',
      },
      {
        title: 'Sandboxes',
        caption: 'Maximum number of sandboxes a team can create.',
        team_free: '20 (only public)',
        team_pro: 'Unlimited public and<br/>private',
        org_custom: 'Unlimited public and<br/>private',
      },
      {
        title: 'Repositories',
        caption:
          'Maximum number of repos a team can create. Repos allow developing projects connected to Git.',
        team_free: '3 (only public)',
        team_pro: 'Unlimited public and<br/>private',
        org_custom: 'Unlimited public and<br/>private',
      },
      {
        title: 'VM Specs',
        caption: 'The specs of the VM that will run your repositories.',
        team_free: '4GB RAM<br/>2 vCPUs<br/>4GB Disk',
        team_pro: '6GB RAM<br/>4 vCPUs<br/>12GB Disk',
        org_custom: 'Custom',
      },
      {
        title: 'Public NPM packages',
        caption: 'Use any of the 1M+ public packages on npm in your sandboxes',
        team_free: true,
        team_pro: true,
        org_custom: true,
      },
      {
        title: 'Private NPM packages',
        caption: 'Use private npm packages from your own custom registry',
        team_free: false,
        team_pro: true,
        org_custom: true,
      },
      //      {
      //        title: 'Password-protected<br />previews',
      //        caption:
      //          'Protect who can view your dev server preview and give users outside your team access with a password.',
      //        team_free: false,
      //        team_pro: { value: true, label: '(Coming soon)' },
      //        org_custom: { value: true, label: '(Coming soon)' },
      //      },
      {
        title: 'Static file hosting',
        caption: 'All static files served via CDN.',
        team_free: '20MB total,<br/> 7MB upload',
        team_pro: '500MB/user,<br/> 30MB upload',
        org_custom: 'Custom',
      },
    ],
  },
];

const personal_plans = [
  {
    body: [
      {
        title: 'Users',
        caption: 'All Personal plans are limited to 1 user.',
        personal_free: '1',
        personal_pro: '1',
      },
      {
        title: 'Unlimited Sandboxes',
        caption:
          'Create as many sandboxes as you like and manage their permissions.',
        personal_free: 'Only public',
        personal_pro: 'Public and private',
      },
      {
        title: 'Unlimited Repositories',
        caption:
          'Import as many repos as you like. Repos allow developing projects connected to Git.',
        personal_free: 'Only public',
        personal_pro: 'Public and private',
      },
      {
        title: 'VM Specs',
        caption: 'The specs of the VM that will run your repositories.',
        personal_free: '4GB RAM<br/>2 vCPUs<br/>4GB Disk',
        personal_pro: '6GB RAM<br/>4 vCPUs<br/>12GB Disk',
      },
      {
        title: 'Public NPM packages',
        caption: 'Use any of the 1M+ public packages on npm in your sandboxes',
        personal_free: true,
        personal_pro: true,
      },
      {
        title: 'Private NPM packages',
        caption: 'Use private npm packages from your own custom registry',
        personal_free: false,
        personal_pro: false,
      },
      {
        title: 'Static file hosting',
        caption: 'All static files served via CDN.',
        personal_free: '20MB total,<br/> 7MB upload',
        personal_pro: '500MB/user,<br/> 30MB upload',
      },
    ],
  },
];

const featureList = [
  {
    title: 'CodeSandbox CI',
    caption: 'A GitHub integration that auto-builds from pull requests',
  },
  {
    title: 'VS Code powered editor',
    caption: 'Leverage the power and familiarity of VS Code',
  },
  {
    title: 'Hot module reloading',
    caption: 'See changes as you make them',
  },
  {
    title: 'Keybindings & quick actions',
    caption: 'Perform common tasks speedily',
  },
  {
    title: 'Console',
    caption:
      'View logging and console output to see loading progress and debug issues',
  },
  {
    title: 'Presentation mode',
    caption: 'Hide distracting editor elements for demos and screenshots',
  },
  {
    title: 'Custom themes',
    caption: 'Tweak theme styles with support for all VS Code themes',
  },
  {
    title: 'Type acquisition',
    caption: 'Typings automatically downloaded for every dependency',
  },
  {
    title: 'Vim mode',
    caption: 'Vim emulation in the editor, powered by the VSCodeVim extension',
  },
  {
    title: 'External resources',
    caption: 'Automatically include external resources, like CSS or JS files',
  },
  {
    title: 'Session Restore',
    caption: 'Recover un-saved changes between sessions',
  },
  {
    title: 'Prettier',
    caption: 'Code gets prettified on save according to preferences',
  },
  {
    title: 'ESLint',
    caption: 'Code is linted automatically',
  },

  {
    title: 'Emmet',
    caption:
      ' Expand abbreviations with Emmet.io in all JS, HTML, and CSS files',
  },
  {
    title: 'Configuration UI',
    caption:
      ' Expand abbreviations with Emmet.io in aEdit config files for npm, Prettier, Netlify, Vercel, TypeScript, and JavaScriptll JS, HTML, and CSS files',
  },
  {
    title: 'Export Zip',
    caption: ' Download your sandbox as a zip',
  },
  {
    title: 'Server control panel',
    caption: ' Restart the sandbox or server',
  },
  {
    title: 'Multiple ports',
    caption: ' Container apps can listen on one or more ports simultaneously',
  },
  {
    title: 'Secrets',
    caption:
      ' Hide sensitive information in your app and access them via environment variables',
  },
  {
    title: 'Test viewer',
    caption: ' Showing test results alongside your code',
  },
  {
    title: 'Problem viewer',
    caption: ' See errors clearly with our user-friendly overlay',
  },
  {
    title: 'React DevTools',
    caption: ' Integration of React’s own DevTools into the editor',
  },
  {
    title: 'Terminal',
    caption: ' Run scripts and commands from a terminal',
  },
  {
    title: 'GitHub import & export',
    caption:
      ' Import and sync public repos, export, create commits, and open PRs',
  },
  {
    title: 'Vercel and Netlify deploy',
    caption:
      ' Deploy a production version of your sandbox to Vercel or Netlify',
  },
  {
    title: 'Define API',
    caption: ' Programmatically create sandboxes via an API',
  },
];

/**
 * Main component
 */
export const Plans = () => {
  const [mobileTeamPlan, setMobileTeamPlan] = useState('team-pro');
  const [mobilePersonalPlan, setMobilePersonalPlan] = useState('personal-pro');

  return (
    <>
      <Caption
        css={{
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        Compare plans
      </Caption>
      <Title
        css={{
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto 80px',
          '@media (min-width: 1441px)': {
            margin: '0 auto 120px',
          },
        }}
      >
        Choose the right plan for you.
      </Title>

      <TableSection id="team-plans">
        <TableTitle>Team and Business Plans</TableTitle>
        <Table>
          {team_plans.map(({ section, body }, index) => {
            return (
              <React.Fragment key={section}>
                <tr>
                  <th
                    className={`table__feature-header ${
                      index === 0
                        ? 'table__feature-header--first'
                        : 'table__feature-header--body'
                    }`}
                    colSpan={index === 0 ? 1 : 4}
                  >
                    <span>{section}</span>
                  </th>

                  {index === 0 && (
                    <>
                      <th className="column__desktop plan__team-free">
                        <p>Free</p>
                      </th>
                      <th className="column__desktop plan__team-pro">
                        <p>Team Pro</p>
                        <a href="/pro?type=team">Upgrade</a>
                      </th>
                      <th className="column__desktop plan__org-custom">
                        <p>Organization</p>
                        <a
                          href="mailto:support@codesandbox.io?subject=Organization plan"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Contact us
                        </a>
                      </th>

                      <th
                        className={`column__mobile plan__${mobileTeamPlan}`}
                        colSpan={3}
                      >
                        <div className="plan-selector">
                          <select
                            onChange={({ target }) =>
                              setMobileTeamPlan(target.value)
                            }
                            value={mobileTeamPlan}
                          >
                            <option value="team-free">Free</option>
                            <option value="team-pro">Team</option>
                            <option value="org-custom">Organization</option>
                          </select>
                        </div>
                      </th>
                    </>
                  )}
                </tr>

                {body.map(item => {
                  return (
                    <tr>
                      <td>
                        <h3
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />
                        <p
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.caption }}
                        />
                      </td>

                      <td className="plan__team-free column__desktop">
                        <CheckOrNot option={item.team_free} />
                      </td>
                      <td className="plan__team-pro column__desktop">
                        <CheckOrNot option={item.team_pro} />
                      </td>
                      <td className="plan__org-custom column__desktop">
                        <CheckOrNot option={item.org_custom} />
                      </td>

                      <td
                        className={`column__mobile plan__${mobileTeamPlan}`}
                        colSpan={3}
                      >
                        <CheckOrNot
                          option={item[mobileTeamPlan.replace('-', '_')]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Table>
      </TableSection>

      <TableSection id="personal-plans">
        <TableTitle>Personal Plans</TableTitle>
        <Table>
          {personal_plans.map(({ section, body }, index) => {
            return (
              <React.Fragment key={section}>
                <tr>
                  <th
                    className={`table__feature-header ${
                      index === 0
                        ? 'table__feature-header--first'
                        : 'table__feature-header--body'
                    }`}
                    colSpan={index === 0 ? 1 : 4}
                  >
                    <span>{section}</span>
                  </th>

                  {index === 0 && (
                    <>
                      <th className="column__desktop plan__personal-free">
                        <p>Free</p>
                      </th>
                      <th className="column__desktop plan__personal-pro">
                        <p>Personal Pro</p>
                        <a href="/pro?type=personal">Upgrade</a>
                      </th>

                      <th
                        className={`column__mobile plan__${mobilePersonalPlan}`}
                        colSpan={3}
                      >
                        <div className="plan-selector">
                          <select
                            onChange={({ target }) =>
                              setMobilePersonalPlan(target.value)
                            }
                            value={mobilePersonalPlan}
                          >
                            <option value="personal-free">Free</option>
                            <option value="personal-pro">Personal Pro</option>
                          </select>
                        </div>
                      </th>
                    </>
                  )}
                </tr>

                {body.map(item => {
                  return (
                    <tr>
                      <td>
                        <h3
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />
                        <p
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.caption }}
                        />
                      </td>

                      <td className="plan__personal-free column__desktop">
                        <CheckOrNot option={item.personal_free} />
                      </td>
                      <td className="plan__personal-pro column__desktop">
                        <CheckOrNot option={item.personal_pro} />
                      </td>

                      <td
                        className={`column__mobile plan__${mobilePersonalPlan}`}
                        colSpan={3}
                      >
                        <CheckOrNot
                          option={item[mobilePersonalPlan.replace('-', '_')]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Table>
      </TableSection>

      <FeatureListTitle css={{ color: '#E5E5E5', fontSize: 24 }}>
        plus all our standard platform features
      </FeatureListTitle>

      <FeatureList>
        {featureList.map(({ title, caption }) => {
          return (
            <FeatureListItem key={title}>
              <h2 className="feature-item__title">{title}</h2>
              <p className="feature-item__caption">{caption}</p>
            </FeatureListItem>
          );
        })}
      </FeatureList>
    </>
  );
};

/**
 * Elements
 */
const CheckOrNot = ({ option }) => {
  if (option === true) {
    return (
      <svg width="23" height="17" viewBox="0 0 23 17">
        <path
          d="M0.860795 8.5L8.58807 16.1818L22.7699 2.04545L20.9972 0.272726L8.58807 12.6364L2.58807 6.72727L0.860795 8.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (typeof option === 'string') {
    return (
      <span
        className="checked__text"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: option }}
      />
    );
  }

  if (typeof option === 'object') {
    return (
      <TDWithDetails>
        {option.value === true ? (
          <svg width="23" height="17" viewBox="0 0 23 17">
            <path
              d="M0.860795 8.5L8.58807 16.1818L22.7699 2.04545L20.9972 0.272726L8.58807 12.6364L2.58807 6.72727L0.860795 8.5Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <span className="checked__no-check">&times;</span>
        )}
        <span
          className="checked__text"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: option.label }}
        />
      </TDWithDetails>
    );
  }

  return <span className="checked__no-check">&times;</span>;
};

const FeatureListTitle = styled.h3`
  font-size: 18px;
  font-family: 'TWKEverett', sans-serif;
  font-weight: normal;
  color: #fff;
  margin: 60px 0 40px;

  @media (min-width: 769px) {
    margin: 120px 0 48px;
    font-size: 32px;
  }
`;

const FeatureList = styled.ul`
  @media (min-width: 769px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const FeatureListItem = styled.li`
  margin-bottom: 32px;
  padding-left: 12px;

  @media (min-width: 769px) {
    width: calc(100% / 2 - 3em);
  }

  .feature-item__title {
    font-family: 'TWKEverett', sans-serif;
    font-weight: 500;

    color: #c5c5c5;
    margin: 0;
    list-style-color: #c5c5c5;

    font-size: 18px;
    line-height: 24px;
    transition: all 0.3s ease;
    margin-bottom: 4px;

    @media (min-width: 769px) {
      margin-bottom: 8px;
      font-size: 24px;
      line-height: 28px;
    }
  }

  .feature-item__caption {
    transition: all 0.3s ease;
    font-size: 16px;
    line-height: 24px;
    color: #808080;
    margin: 0;
  }
`;

const TableSection = styled.section`
  margin-bottom: 160px;
  position: relative;
`;

const TableTitle = styled.h3`
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
  font-size: 32px;
  line-height: 42px;
  letter-spacing: -0.01em;
`;

const Table = styled.table`
  @media (min-width: 769px) {
    table-layout: fixed;
  }

  td,
  th {
    text-align: center;
    border-bottom: 1px solid #373737;
    padding: 24px 0;

    @media (min-width: 769px) {
      padding: 32px 0;
    }
  }

  td:first-child {
    text-align: left;
    width: 50%;

    @media (min-width: 769px) {
      max-width: 0;
    }

    p {
      margin: 0;
      font-size: 13px;
      line-height: 18px;
      color: #999999;

      @media (min-width: 769px) {
        font-size: 16px;
        line-height: 24px;
      }
    }

    h3 {
      font-family: 'TWKEverett', sans-serif;
      font-style: normal;
      font-weight: 500;
      color: #fff;

      font-size: 16px;
      line-height: 20px;
      margin-bottom: 5px;

      @media (min-width: 769px) {
        line-height: 32px;
        font-size: 24px;
      }
    }
  }

  th {
    white-space: nowrap;
    padding-left: 12px;
    padding-right: 12px;
    position: sticky;
    top: 0px;
    background: #030303;

    &:first-child {
      text-align: left;
      padding-left: 0;
    }

    p {
      font-family: 'TWKEverett', sans-serif;
      font-weight: normal;
      font-size: 24px;
      color: var(--plan, #808080);
      margin-bottom: 12px;

      &:only-child {
        margin: 0;
      }
    }

    a {
      border-radius: 4px;
      font-size: 16px;
      height: 40px;
      padding: 0 16px;
      line-height: 37px;
      white-space: nowrap;
      text-decoration: none;
      text-align: center;
      display: inline-block;

      background: #191919;
      border: 1px solid #373737;

      color: var(--plan, #c5c5c5);

      &:hover {
        background-color: #2a2a2a;
      }
    }
  }

  .table__feature-header {
    font-size: 18px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: normal;
    color: #fff;
    pointer-events: none;

    @media (min-width: 769px) {
      font-size: 32px;
    }
  }

  .table__feature-header--first {
  }

  .table__feature-header--body {
    background: none;
    padding-top: 60px;
    top: -37px;

    @media (min-width: 769px) {
      padding-top: 120px;
      padding-bottom: 47px;
      top: -62px;
    }

    span {
      background: linear-gradient(
        180deg,
        rgba(9, 9, 9, 0.1) 0%,
        rgba(9, 9, 9, 1) 5%
      );
      width: 50%;
      display: block;
      pointer-events: none;

      padding: 10px 0;
      margin-top: -10px;

      @media (min-width: 769px) {
        width: 32%;
        padding: 10px 0;
        margin-top: -10px;
      }
    }
  }

  .checked__no-check {
    color: #373737;
    font-size: 32px;
  }

  .checked__text {
    font-size: 13px;
    line-height: 18px;

    @media (min-width: 769px) {
      font-size: 16px;
      line-height: 24px;
    }
  }

  .column__desktop {
    display: none;

    @media (min-width: 650px) {
      display: table-cell;
    }
  }

  .column__mobile {
    display: table-cell;

    @media (min-width: 650px) {
      display: none;
    }
  }

  .plan-selector {
    padding-right: 1em;
    display: flex;
    align-items: center;
    outline: 0;
    position: relative;

    &:after {
      content: '';
      display: inline-block;

      margin-left: 1em;

      width: 0;
      height: 0;
      border: 3px solid transparent;
      border-top: 5px solid var(--plan, #fff);
      position: absolute;
      top: 10px;
      right: 0;
    }

    select {
      appearance: none;
      background: none;
      outline: none;
      border: 0;
      color: inherit;
      text-align: center;
      margin: auto;

      font-family: 'TWKEverett', sans-serif;
    }
  }

  .plan__team-free,
  .plan__personal-free {
    --plan: #808080;

    color: var(--plan);
  }

  .plan__team-pro {
    --plan: #edffa5;

    color: var(--plan);
  }

  .plan__org-custom {
    --plan: #ffffff;

    color: var(--plan);
  }

  .plan__personal-pro {
    --plan: #ac9cff;

    color: var(--plan);
  }
`;

const TDWithDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;
