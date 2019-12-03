import styled from 'styled-components';

export const Container = styled.div`
  font-family: Inter;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;

  margin-top: 0;
  margin-bottom: 0.125rem;
  color: ${props =>
    props.theme.vscodeTheme.type === 'light' ? 'black' : 'white'};
`;

export const Environment = styled.div`
  font-size: 11px;
  color: ${props => props.theme['editor.foreground']};
`;

export const Description = styled.p`
  font-weight: 300;
  font-size: 13px;
  color: ${props => props.theme['editor.foreground']};
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const TemplateIconContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-right: 1rem;
`;
