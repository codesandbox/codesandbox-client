import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.background2};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  margin-bottom: 1rem;

  .ais-SearchBox-form {
    margin-bottom: 0.5rem;
  }

  .ais-SearchBox-reset {
    top: 0.25rem;
  }

  .ais-SearchBox-input {
    font-size: 0.875rem;
    padding-left: 2.5em;
  }

  @media (max-width: 768px) {
    ${props =>
      !props.open &&
      css`
        height: 30px;
        overflow: hidden;
      `};
  }
`;

export const Title = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  line-height: 25px;
  font-weight: normal;

  svg {
    display: none;
    width: 30px;
    height: 30px;
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

export const Button = styled.button`
  border: none;
  background: inherit;
  color: ${props => props.theme.white};
`;
