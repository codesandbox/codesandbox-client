import styled from 'styled-components';

export const Folder = styled.div`
  min-width: 235px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 30px;
  padding: 0 11px;

  background: #25282a;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const Create = styled.button`
  transition: 0.3s ease background-color;
  display: flex;
  width: 235px;
  height: 40px;
  align-items: center;
  margin-right: 30px;
  justify-content: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  font-size: 1.125rem;
  border-radius: 4px;
  border: 2px solid rgba(64, 169, 243, 0.8);
  background-color: rgba(64, 169, 243, 0.1);
  border-style: dashed;
  overflow: hidden;
  outline: none;
  cursor: pointer;

  user-select: none;

  text-decoration: none;

  &:hover {
    background-color: rgba(64, 169, 243, 0.2);
  }
`;
