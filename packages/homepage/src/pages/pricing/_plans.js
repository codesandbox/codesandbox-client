import React from 'react';
import styled from 'styled-components';
import { Title } from './_elements';

const plans = [
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
  return (
    <>
      <Title
        css={{
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto 160px',
          left: 170,
          position: 'relative',
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
                    <th className="free-header">
                      <p>Free</p>
                    </th>
                    <th className="personal">
                      <p>Personal Pro</p>
                      <a href="#upgrade">Upgrade</a>
                    </th>
                    <th className="team">
                      <p>Team Pro</p>
                      <a href="#upgrade">Upgrade</a>
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
                    <td className="free">
                      <CheckOrNot checked={item.free} />
                    </td>
                    <td className="personal">
                      <CheckOrNot checked={item.personal} />
                    </td>
                    <td className="team">
                      <CheckOrNot checked={item.team} />
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
  if (checked) {
    return (
      <svg width="23" height="17" viewBox="0 0 23 17">
        <path
          d="M0.860795 8.5L8.58807 16.1818L22.7699 2.04545L20.9972 0.272726L8.58807 12.6364L2.58807 6.72727L0.860795 8.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return <span className="no-check">&times;</span>;
};

const Table = styled.table`
  td,
  th {
    text-align: center;
    border-bottom: 1px solid #373737;
    padding: 32px 0;
    min-width: 223px;
  }

  th {
    padding: 48px 0;
  }

  td:first-child {
    text-align: left;
    color: #e5e5e5;

    p {
      font-size: 16px;
      line-height: 24px;
      margin: 0;
    }

    h3 {
      font-family: 'TWKEverett', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }
  }

  th {
    white-space: nowrap;
    padding-top: 64px;
    padding-left: 12px;
    padding-right: 12px;

    &:first-child {
      text-align: left;
      padding-left: 0;
      padding-top: 100px;
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
    font-size: 32px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: normal;
  }

  .no-check {
    color: #2a2a2a;
    font-size: 32px;
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
