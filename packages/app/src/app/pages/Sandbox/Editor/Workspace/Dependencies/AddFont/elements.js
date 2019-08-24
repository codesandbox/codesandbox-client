import styled, { createGlobalStyle } from 'styled-components';

export const ButtonContainer = styled.div`
  margin: 0.5rem 1rem;
`;

export const FontPickerStyles = createGlobalStyle`
    #font-picker {
      width: 100%;

      li,
      button {
        color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
      }

      .dropdown-icon.finished::before {
        border-top: 6px solid
          ${props => props.theme['sideBar.foreground'] || 'inherit'};
          margin-right: 6px;
      }

      .expanded ul {
        max-height: 130px;
      }

      button {
        margin: 0;
        padding: 0;
        background-color: ${props => props.theme['sideBar.background']};
        width: 100%;
        padding-left: 0.25rem;
        border: 1px solid rgba(0, 0, 0, 0.1);

        &:focus {
          border-color: ${props => props.theme.secondary.clearer(0.6)};
        }
      }
    }
  `;
