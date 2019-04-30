import styled from 'styled-components';

export const Container = styled.div`
  flex: 2;
  border-top: 1px solid #828282;
  padding-top: 1rem;

  color: rgba(255, 255, 255, 0.6);

  @media (max-width: 768px) {
    margin-right: 0;
    order: 1;

    width: 100%;
  }
`;
