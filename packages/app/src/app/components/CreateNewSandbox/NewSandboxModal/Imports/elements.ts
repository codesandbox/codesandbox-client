import styled, { css } from 'styled-components';
import Input from '@codesandbox/common/lib/components/Input';

export const Section = styled.section`
  width: 100%;
`;

export const ImportHeader = styled.h2`
  font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  font-size: 1rem;
  color: white;
  font-weight: 500;
`;

export const ImportDescription = styled.p`
  font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;

  line-height: 1.6;
`;

export const GitHubInput = styled(Input)`
  border: 2px solid rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
`;

const linkStyles = css`
  transition: 0.3s ease color;

  display: block;
  margin: 1rem 0.25rem;
  margin-left: 0.5rem;

  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;

  font-weight: 500;
  font-size: 1rem;
`;

export const PlaceHolderLink = styled.span<{ error: string }>`
  ${linkStyles};

  ${props =>
    props.error &&
    css`
      color: ${props.theme.red};
    `}
`;

export const GitHubLink = styled.a`
  ${linkStyles};

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const Buttons = styled.div`
  display: flex;
  float: right;

  a {
    margin: 0 0.25rem;
  }

  a:first-child {
    margin-left: 0;
  }

  a:last-child {
    margin-right: 0;
  }

  button {
    margin: 0 0.25rem;
  }

  button:first-child {
    margin-left: 0;
  }

  button:last-child {
    margin-right: 0;
  }
`;

export const DocsLink = styled.a`
  transition: 0.2s ease color;

  text-decoration: none;
  margin-left: 1rem;

  font-size: 1rem;

  &:hover {
    color: ${props => props.theme.secondary.darken(0.2)};
  }
`;
