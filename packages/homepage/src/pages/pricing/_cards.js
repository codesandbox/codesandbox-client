import React from 'react';
import {
  Card,
  CardTitle,
  Price,
  PriceSubText,
  List,
  Button,
  CardContainer,
} from './_elements';

// you're going to need this for the link on homepage, there are 3 flags
// v=2
// type=PERSONAL_PRO | TEAM_PRO
// interval=MONTHLY | YEARLY
// /pro?v=2&type=PERSONAL_PRO&interval=MONTHLY
// /pro?v=2&type=TEAM_PRO&interval=YEARLY (edited)

const makeLink = (product, mode) => {
  let link = 'pro?v=2';
  if (product === 'personal') {
    link += '&type=PERSONAL_PRO';
  } else {
    link += '&type=TEAM_PRO';
  }

  if (mode === 'monthly') {
    link += '&interval=MONTHLY';
  } else {
    link += '&interval=YEARLY';
  }

  return link;
};

export const TeamCards = ({ mode }) => (
  <CardContainer teams>
    <Card
      css={`
        background: #5962df;
      `}
    >
      <div>
        <div
          css={`
            height: 155px;
          `}
        >
          <CardTitle>Team Pro Workspace</CardTitle>
          <Price>${mode === 'monthly' ? 30 : 24}</Price>
          <PriceSubText>
            per editor/workspace/billed{' '}
            {mode === 'monthly' ? 'monthly' : 'annually'} <br />
            or ${mode === 'annually' ? 30 : 24} per month billed{' '}
            {mode === 'annually' ? 'monthly' : 'annually'}
          </PriceSubText>
        </div>
        <List>
          <li
            css={`
              font-weight: bold;
            `}
          >
            Collaborate with your team
          </li>
          <li>Private sandboxes</li>
          <li>Private GitHub repos</li>
          <li>Private NPM packages</li>
          <li>Advanced permissions</li>
          <li>Unlimited viewers</li>
          <li>Centralized billing</li>
        </List>
      </div>
      <Button
        css={`
          color: #5962df;
          background: ${props => props.theme.homepage.white};
        `}
        href={makeLink('team', mode)}
      >
        Subscribe to Pro
      </Button>
    </Card>
    <Card
      css={`
        background: #f7a239;
      `}
    >
      <div>
        <div
          css={`
            height: 155px;
          `}
        >
          <CardTitle>Organization</CardTitle>
          <Price>Join the waitlist</Price>
        </div>
        <List>
          <li
            css={`
              font-weight: bold;
            `}
          >
            For large or multiple teams
          </li>
          <li>All in Team Pro Workspace, plus:</li>
          <li>SSO</li>
          <li>Multiple workspaces</li>
          <li>Workspace secrets</li>
          <li>Analytics</li>
          <li>Priority support</li>
        </List>
      </div>
      <Button
        css={`
          color: #f7a239;
          background: ${props => props.theme.homepage.white};
        `}
        href="mailto:hello@codesandbox.io"
      >
        Get early access
      </Button>
    </Card>
    <Card>
      <div>
        <div
          css={`
            height: 155px;
          `}
        >
          <CardTitle>Enterprise</CardTitle>
          <Price>Contact us</Price>
        </div>
        <List>
          <li
            css={`
              font-weight: bold;
            `}
          >
            Custom deploy options & support
          </li>
          <li>All in Organization, plus:</li>
          <li>On-premise or private cloud</li>
          <li>Custom contract</li>
          <li>Dedicated account manager</li>
        </List>
      </div>
      <Button
        css={`
          color: ${props => props.theme.homepage.blue};
          background: ${props => props.theme.homepage.white};
        `}
        href="mailto:hello@codesandbox.io"
      >
        Contact us
      </Button>
    </Card>
  </CardContainer>
);

export const PersonalCards = ({ mode }) => (
  <CardContainer>
    <Card dark>
      <div>
        <div
          css={`
            height: 155px;
          `}
        >
          <CardTitle>Personal</CardTitle>
          <Price
            css={`
              min-height: 72px;
            `}
          >
            $0
          </Price>
        </div>
        <List>
          <li
            css={`
              font-weight: bold;
            `}
          >
            For learning & experimenting
          </li>
          <li>Free for individuals</li>
          <li>All Platform features</li>
          <li>Public sandboxes</li>
          <li>Templates </li>
          <li>Dashboard</li>
        </List>
      </div>
      <Button href="/s">Get started, it’s free </Button>
    </Card>
    <Card>
      <div>
        <div
          css={`
            height: 155px;
          `}
        >
          <CardTitle>Personal Pro Workspace</CardTitle>
          <Price>${mode === 'monthly' ? 9 : 7}</Price>
          <PriceSubText>
            billed {mode === 'monthly' ? 'monthly' : 'annually'} <br />
            or ${mode === 'annually' ? 9 : 7} per month billed{' '}
            {mode === 'annually' ? 'month-to-month' : 'annually'}
          </PriceSubText>
        </div>
        <List>
          <li
            css={`
              font-weight: bold;
            `}
          >
            For power-users & freelancers
          </li>
          <li>All in Personal, plus:</li>
          <li>Private sandboxes</li>
          <li>Private GitHub repos</li>
          <li>More storage space</li>
          <li>Higher upload limits</li>
          <li>Stricter sandbox permissions</li>
        </List>
      </div>
      <Button
        css={`
          color: ${props => props.theme.homepage.blue};
          background: ${props => props.theme.homepage.white};
        `}
        href={makeLink('team', mode)}
      >
        Subscribe to Pro
      </Button>
    </Card>
  </CardContainer>
);

const Cards = ({ team, mode }) => (
  <>
    {team ? <TeamCards mode={mode} /> : <PersonalCards mode={mode} />}
    <p
      css={`
        color: ${props => props.theme.homepage.muted};
        text-align: center;
        font-size: 13px;
        margin-top: 16px;
      `}
    >
      Prices listed in USD. Taxes may apply. By using CodeSandbox you agree to
      our terms and policies.
    </p>
  </>
);

export default Cards;
