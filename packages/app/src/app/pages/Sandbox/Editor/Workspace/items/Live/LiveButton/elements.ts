import styled, { css } from 'styled-components';
import { HTMLAttributes } from 'react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

const styles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  padding: 0.5rem;
  background-color: #fd2439b8;
  width: 100%;
  color: white;
  border-radius: 4px;
  font-weight: 800;
  border: 2px solid #fd2439b8;
`;

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disable?: boolean;
}
export const Button = styled.button<ButtonProps>`
  ${({ disable }) => css`
    transition: 0.3s ease all;
    ${styles};
    cursor: pointer;

    svg {
      margin-right: 0.25rem;
    }

    ${disable
      ? css`
          pointer-events: none;
          background-color: rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 0, 0, 0.2);
          color: rgba(255, 255, 255, 0.7);
        `
      : css`
          &:hover {
            background-color: #fd2439fa;
          }
        `};
  `}
`;

export const LoadingDiv = styled.div`
  ${styles};
`;

export const AnimatedRecordIcon = styled(RecordIcon)`
  ${({ opacity = 1 }) => css`
    opacity: ${opacity};
    transition: 0.3s ease opacity;
  `}
`;
