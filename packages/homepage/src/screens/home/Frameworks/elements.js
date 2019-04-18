import styled, { css } from 'styled-components';

import media from '../../../utils/media';

export const Title = styled.h3`
  font-family: Poppins;
  font-weight: bold;
  font-size: 50px;
  color: white;

  ${media.phone`
    font-size: 34px;
  `};

  span {
    color: ${props => props.theme.secondary};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 270px;
  grid-gap: 32px;
  margin-top: 2rem;
`;

export const TemplateTitle = styled.h5`
  font-family: Poppins;
  font-weight: normal;
  font-size: 30px;
  margin-bottom: 2rem;

  color: ${props => props.theme.lightText};
`;

export const Icons = styled.div`
  background: ${props => props.theme.background2};
  box-shadow: 8px 8px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px 4px 0px 0px;
  padding: 16px 24px;

  ${media.phone`
    margin: 2rem 0;
    width: 100%;
  `};
`;

export const TagLine = styled.h4`
  margin: 24px 0;
  font-family: Open Sans;
  font-weight: normal;
  font-size: 28px;
  max-width: 600px;
  line-height: 1.5;

  color: ${props => props.theme.lightText};

  span {
    font-weight: bold;
  }
`;

export const TemplateName = styled.span`
  margin-left: 16px;
  font-family: Poppins;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: ${props => props.theme.lightText};

  ${({ selected }) =>
    selected &&
    css`
      font-weight: bold;
    `};
`;

export const IconContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;

  svg {
    transition: 0.3s ease filter;
    filter: grayscale(1);

    ${({ selected }) =>
      selected &&
      css`
        filter: grayscale(0);
      `};
  }

  ${media.phone`
    flex-shrink: 0;
  `};

  border-radius: 2px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
