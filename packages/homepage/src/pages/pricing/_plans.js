import React, { useState } from 'react';

import styled from 'styled-components';
import { Title } from './_elements';

const plans = [
  {
    section: 'Prototyping',
    body: [
      {
        title: 'Unlimited Sandboxes',
        caption:
          "Create as many sandboxes as you'd like and manage their permissions",
        free: 'Only public',
        personal: 'Public and private',
        team: 'Public and private',
      },
      {
        title: 'Public NPM packages',
        caption: 'Use any of the 1M+ public packages on npm in your sandboxes',
        free: true,
        personal: true,
        team: true,
      },
      {
        title: 'Private NPM packages',
        caption: 'Use private npm packages from your own custom registry',
        free: false,
        personal: true,
        team: true,
      },
      {
        title: 'Private GitHub repositories',
        caption: 'Import and sync private repositories from Github',
        free: false,
        personal: true,
        team: true,
      },
      {
        title: 'Static file hosting',
        caption: 'All static files served via CDN',
        free: '20MB total,<br/> 7MB upload',
        personal: '500MB/user,<br/> 30MB upload',
        team: '500MB/user,<br/> 30MB upload',
      },
    ],
  },
  {
    section: 'Privacy',
    body: [
      {
        title: 'Private NPMs',
        caption:
          'Everyone in a single account for easier team management & billing',
        free: false,
        personal: false,
        team: true,
      },
      {
        title: 'Sandbox-level permissions',
        caption: 'Disable the ability to fork or download a shared sandbox',
        free: false,
        personal: true,
        team: true,
      },
    ],
  },
  {
    section: 'Features',
    body: [
      {
        title: 'Dashboard',
        caption:
          'Organize sandboxes and templates. Search, sort, or modify sandboxes at once',
        free: true,
        personal: true,
        team: true,
      },
      {
        title: 'Centralized Billing',
        caption:
          'Everyone in a single account for easier team management & billing',
        free: false,
        personal: false,
        team: true,
      },
    ],
  },
];

export const Plans = () => {
  const [mobilePlan, setMobilePlan] = useState('team');

  return (
    <>
      <Title
        css={{
          textAlign: 'center',
          maxWidth: 600,
          margin: 'auto',
          '@media (min-width: 1441px)': {
            margin: '0 auto 20px',
          },
        }}
      >
        Compare our plans and features
      </Title>

      <Table>
        {plans.map(({ section, body }, index) => {
          return (
            <React.Fragment key={section}>
              <tr>
                <th className="feature" colSpan={index === 0 ? 1 : 4}>
                  {section}
                </th>
                {index === 0 && (
                  <>
                    <th className="desktop free-header">
                      <p>Free</p>
                    </th>
                    <th className="desktop personal">
                      <p>Personal Pro</p>
                      <a href="#upgrade">Upgrade</a>
                    </th>
                    <th className="desktop team">
                      <p>Team Pro</p>
                      <a href="#upgrade">Upgrade</a>
                    </th>

                    <th className={`mobile ${mobilePlan}`} colSpan={3}>
                      <div className="select">
                        <select
                          onChange={({ target }) => setMobilePlan(target.value)}
                          value={mobilePlan}
                        >
                          <option value="free">Free</option>
                          <option value="personal">Personal Pro</option>
                          <option value="team">Team Pro</option>
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
                      <h3>{item.title}</h3>
                      <p>{item.caption}</p>
                    </td>
                    <td className="free desktop">
                      <CheckOrNot checked={item.free} />
                    </td>
                    <td className="personal desktop">
                      <CheckOrNot checked={item.personal} />
                    </td>
                    <td className="team desktop">
                      <CheckOrNot checked={item.team} />
                    </td>

                    <td className={`mobile ${mobilePlan}`} colSpan={3}>
                      <CheckOrNot checked={item[mobilePlan]} />
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </Table>
    </>
  );
};

/**
 * Elements
 */
const CheckOrNot = ({ checked }) => {
  if (checked === true) {
    return (
      <svg width="23" height="17" viewBox="0 0 23 17">
        <path
          d="M0.860795 8.5L8.58807 16.1818L22.7699 2.04545L20.9972 0.272726L8.58807 12.6364L2.58807 6.72727L0.860795 8.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (typeof checked === 'string') {
    return (
      // eslint-disable-next-line react/no-danger
      <span className="text" dangerouslySetInnerHTML={{ __html: checked }} />
    );
  }

  return <span className="no-check">&times;</span>;
};

const Table = styled.table`
  @media (min-width: 769px) {
    table-layout: initial;
  }

  td,
  th {
    text-align: center;
    border-bottom: 1px solid #373737;
    padding: 24px 0;

    @media (min-width: 769px) {
      padding: 32px 0;
      min-width: 200px;
    }
  }

  td:first-child {
    text-align: left;

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

      @media (min-width: 769px) {
        line-height: 32px;
        font-size: 24px;
      }
    }
  }

  th {
    white-space: nowrap;
    padding-top: 100px;
    padding-left: 12px;
    padding-right: 12px;

    &:first-child {
      text-align: left;
      padding-left: 0;
    }

    p {
      font-family: 'TWKEverett', sans-serif;
      font-weight: normal;
      font-size: 24px;
      color: var(--plan, #808080);
    }

    a {
      border-radius: 4px;
      font-size: 16px;
      height: 40px;
      padding: 0 16px;
      line-height: 40px;
      white-space: nowrap;
      text-decoration: none;
      text-align: center;
      display: inline-block;

      background: #191919;
      border: 1px solid #373737;

      color: var(--plan, #c5c5c5);
    }
  }
  .feature {
    color: #c5c5c5;
    font-size: 18px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: normal;
    color: #fff;

    @media (min-width: 769px) {
      font-size: 32px;
    }
  }

  .no-check {
    color: #2a2a2a;
    font-size: 32px;
  }

  .text {
    font-size: 13px;
    line-height: 18px;

    @media (min-width: 769px) {
      font-size: 20px;
      line-height: 28px;
    }
  }

  .desktop {
    display: none;

    @media (min-width: 650px) {
      display: table-cell;
    }
  }

  .mobile {
    display: table-cell;

    @media (min-width: 650px) {
      display: none;
    }
  }

  .select {
    padding-right: 2em;
    display: flex;
    align-items: center;

    &:after {
      content: '';
      display: inline-block;

      margin-left: 1em;

      width: 0;
      height: 0;
      border: 3px solid transparent;
      border-top: 5px solid var(--plan, #fff);
    }

    select {
      appearance: none;
      background: none;
      border: 0;
      color: inherit;
      text-align: right;
    }
  }

  .free {
    color: #c5c5c5;
  }

  .personal {
    --plan: #ac9cff;

    color: var(--plan);
  }

  .team {
    --plan: #edffa5;

    color: var(--plan);
  }
`;
