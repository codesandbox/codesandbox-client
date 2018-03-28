import styled from 'app/styled-components';

export const Container = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.3);

  .carbon-text {
    text-decoration: none !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }

  .carbon-wrap {
    font-size: 0.875rem;

    img {
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  .carbon-poweredby {
    display: block;
    margin-top: 0.5rem;

    font-size: 0.75rem;
    text-decoration: none !important;
    color: rgba(255, 255, 255, 0.6) !important;
  }
`;
