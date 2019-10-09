import styled from 'styled-components';

export const Features = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.6rem;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 6rem;
  margin-bottom: 4rem;
  padding: 0 1.5rem;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const FeatureName = styled.h3`
  font-family: Roboto;
  font-weight: bold;
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  padding: 0;
  margin: 0;
  margin-top: 2rem;
  color: #ffffff;
`;

export const FeatureText = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  margin-top: 0.5rem;
  text-align: center;
  color: #757575;
`;

export const CreateButton = styled.button`
  background: #0a84ff;
  border-radius: 2px;
  border: none;
  padding: 8px 62px;
  text-align: center;
  font-size: 10px;
  line-height: 19px;
  color: #ffffff;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3.25rem;
`;
