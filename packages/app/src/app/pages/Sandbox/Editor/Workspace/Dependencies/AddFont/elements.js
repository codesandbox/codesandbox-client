import styled, { createGlobalStyle } from 'styled-components';

export const Container = styled.div`
  margin: 0.5rem 1rem;
`;

export const FontPickerStyles = createGlobalStyle`
    #font-picker {
      width: 100%;

      .dropdown-icon.finished::before {
        border-top: 6px solid
          ${props => props.theme['sideBar.foreground'] || 'inherit'};
          margin-right: 6px;
      }

      .expanded ul {
        max-height: 130px;
      }
    }
  `;
