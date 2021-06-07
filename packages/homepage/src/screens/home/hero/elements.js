import React from 'react';
import styled, { css } from 'styled-components';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

export const HeroWrapper = styled.div`
  padding: 10rem 0 5rem 0;
  margin-bottom: 4rem;

  ${props => props.theme.breakpoints.md} {
    padding-top: 5rem;
  }

  > div {
    text-align: center;
    max-width: 80%;
    width: 100%;
    margin: auto;
  }

  ${props => props.theme.breakpoints.md} {
    > div {
      max-width: 90%;
    }
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  line-height: 57px;
  font-family: ${props => props.theme.homepage.appleFont};

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: 900;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2rem;
  }
`;

export const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.muted};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

export const TemplateList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 850px;

  margin: 0 auto;
  padding: 0;
`;

const TemplateWrapper = styled.li`
  list-style: none;
  text-align: left;

  margin-bottom: 1rem;
  width: 100%;

  @media screen and (min-width: 460px) {
    width: calc(((100% - 1rem) / 2));
  }

  @media screen and (min-width: 650px) {
    width: calc(((100% - 1rem * 3) / 4));
  }

  border-radius: 4px;
  border: 1px solid ${props => props.theme.homepage.grey};

  transition: background 200ms ease;

  &:hover {
    background: #151515;
  }

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 1.1em 1em;
  }
`;

const TemplateTitle = styled.h3`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.homepage.white};

  margin: 0;
  margin-bottom: 0.3em;
`;

const TemplateDescription = styled.p`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 0.8rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #757575;
  margin: 0;
`;

export const TemplateItem = ({
  alias,
  iconUrl,
  title,
  environment,
  ...props
}) => {
  const { UserIcon } = getTemplateIcon(iconUrl, environment);

  return (
    <TemplateWrapper {...props}>
      <a href={`https://codesandbox.io/s/${alias}`}>
        <div css={{ marginRight: '1rem' }}>
          <UserIcon />
        </div>

        <div css={{ width: 'calc(100% - 32px - 1rem)' }}>
          <TemplateTitle>{title}</TemplateTitle>
          <TemplateDescription>{environment}</TemplateDescription>
        </div>
      </a>
    </TemplateWrapper>
  );
};

export const ShowMoreButtonLine = styled.div`
  width: 100%;
  border-top: 1px solid ${props => props.theme.homepage.grey};
  margin-top: 1em;
  text-align: center;
`;

export const ShowMoreButton = styled.button`
  border: 0;
  background-color: ${props => props.theme.homepage.greyDark};
  color: #757575;
  transform: translateY(-1.7em);

  padding: 1em;
  display: inline-flex;
  align-items: center;

  cursor: pointer;
  transition: filter 200ms ease;

  &:hover {
    filter: brightness(1.5);
  }
`;

export const ShowMoreIcon = styled.span`
  width: 21px;
  height: 21px;
  border-radius: 21px;
  display: inline-flex;
  margin-right: 0.6rem;

  transition: all 200ms ease;

  border: 1px solid #343434;
  background-color: #343434;

  color: ${props => props.theme.homepage.greyDark};

  svg {
    margin: auto;
    display: block;
    transition: all 200ms ease;
  }

  ${({ active, theme }) =>
    active &&
    css`
      color: #343434;
      background: ${theme.homepage.greyDark};

      svg {
        transform: rotate(135deg);
      }
    `}
`;
