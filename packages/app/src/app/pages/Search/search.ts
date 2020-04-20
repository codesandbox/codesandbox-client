import { createGlobalStyle, css } from 'styled-components';

const styles = css`
  ${({ theme }) => css`
    body {
      .ais-SearchBox-form {
        position: relative;
        margin-bottom: 24px;
      }

      .ais-RefinementList-searchBox .ais-SearchBox-input {
        background: ${theme.background5};
        width: 100%;
      }

      .ais-RefinementList-searchBox .ais-SearchBox-form .ais-SearchBox-submit {
        height: 33px;
      }

      .ais-SearchBox-input {
        transition: 0.3s ease border-color;
        position: relative;
        background: ${theme.background2};
        border: 2px solid ${theme.background2};
        border-radius: 4px;
        outline: none;
        color: white;
        padding: 0.5em;
        padding-left: 2em;
        width: inherit;
        box-sizing: border-box;
        font-size: 1.125em;
        font-weight: 500;
        width: calc(100% - 170px);
      }

      .ais-SearchBox-input::placeholder {
        display: flex;
        align-items: center;
        color: ${theme.placeholder};
      }

      .ais-SearchBox-input:focus {
        border-color: rgba(108, 174, 221, 0.5);
      }

      .ais-SearchBox-form .ais-SearchBox-submit {
        position: absolute;
        height: 42px;
        top: auto;
        bottom: 0;
        right: inherit;
        left: 0;
        margin: 0;
        border: 0;
        border-radius: 3px 0 0 3px;
        background-color: rgba(255, 255, 255, 0);
        padding: 0;
        width: 32px;
        vertical-align: middle;
        text-align: center;
        font-size: inherit;
        user-select: none;
        padding-left: 4px;
        padding-bottom: 2px;

        svg {
          margin: 6px;
          width: 14px;
          height: 14px;
          vertical-align: middle;
          fill: rgba(255, 255, 255, 0.5);
        }

        &::before {
          display: inline-block;
          margin-right: -4px;
          height: 100%;
          vertical-align: middle;
          content: '' 2;
        }

        &:focus {
          outline: 0;
        }
      }

      .ais-SearchBox-submit .ais-SearchBox-submit:hover,
      .ais-SearchBox-submit:active {
        cursor: pointer;
      }

      .ais-SearchBox-reset {
        display: none;
      }

      .ais-Highlight-highlighted {
        color: #ffd399;
        font-style: normal;
      }

      .ais-RefinementList-item {
        color: rgba(255, 255, 255, 0.8);
        margin-top: 6px;

        .ais-RefinementList-checkbox {
          display: inline-block;
          border-radius: 3.5px;
          width: 16px;
          height: 16px;
          background: rgba(0, 0, 0, 0.3);
          outline: none;
          vertical-align: middle;
          margin-right: 8px;
          transition: all 0.15s ease;
        }
      }

      .ais-RefinementList-item input[type='checkbox']:checked {
        background-color: ${theme.secondary};
        /* background-image: url("data:image/svg+xml,%0A%3Csvg width='11px' height='8px' viewBox='0 0 11 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.200000003' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg id='SVG-Layer' transform='translate(1.500000, 0.500000)' fill='%23FFFFFF' stroke='%231C2022' stroke-width='1.6'%3E%3Cpolyline id='Path' points='0 3.88 2.378 6.315 8.046 0.6'%3E%3C/polyline%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); */
        background-position: 50% 4px;
        background-repeat: no-repeat;
        border-color: ${theme.secondary};
        box-shadow: none;
      }

      .ais-RefinementList-item:hover .ais-RefinementList-checkbox {
        box-shadow: inset 0 0 0 1px rgba(108, 174, 221, 0.3);
      }

      .ais-RefinementList-label {
        cursor: pointer;
        font-weight: 300;
      }

      .ais-RefinementList-item--selected .ais-RefinementList-label {
        cursor: pointer;
        font-weight: 500;
      }

      .ais-RefinementList-item--selected .ais-RefinementList-count {
        font-weight: 600;
        color: white;
      }

      .ais-RefinementList-item--selected .ais-RefinementList-count {
        background-color: ${theme.secondary};
      }

      .ais-RefinementList-count {
        border-radius: 2px;
        background-color: rgba(0, 0, 0, 0.2);
        float: right;
        color: rgba(255, 255, 255, 0.2);
        font-weight: 500;
        font-size: 12px;
        padding: 3px 10px;
      }

      .ais-RefinementList-showMore {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 1rem;
        font-weight: normal;
      }

      .ais-RefinementList__showMoreDisabled[disabled],
      .ais-RefinementList__showMoreDisabled:disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .ais-ClearRefinements .ais-ClearRefinements-button {
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        border: none;
        font-size: 12px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        color: white;
        background: ${theme.secondary};

        &:disabled[disabled],
        &:disabled:disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }

      .ais-PoweredBy {
        padding: 0;
        display: flex;
        float: right;
        border-radius: 2px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 8px;
        padding: 5px 7px;
        padding-right: 0;
        margin-right: -4px;

        .ais-PoweredBy-link {
          padding: 0 5px;
          svg {
            height: 1.2em;
            vertical-align: bottom;
            fill: rgba(255, 255, 255, 0.8);

            path:nth-child(4) {
              fill: rgba(255, 255, 255, 0.8);
            }
          }
        }
      }

      .ais-Pagination {
        width: auto;
        margin: 0 auto;
        box-sizing: border-box;
        display: inline-block;
        border-radius: 4px;
        padding: 8px 16px;

        .ais-Pagination-item {
          transition: 0.3s ease all;
          display: inline-block;
          padding: 3px;
          width: 28px;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
        }

        .ais-Pagination-item:hover {
          background: rgba(108, 174, 221, 0.2);
        }

        .ais-Pagination-item.ais-Pagination-item--selected.ais-Pagination-item--page:hover {
          background: ${theme.secondary};
        }

        .ais-Pagination-item.ais-Pagination-item--selected.ais-Pagination-item--page:hover
          .ais-Pagination-link.ais-Pagination__itemLinkSelected {
          color: white;
        }

        .ais-Pagination__item:hover .ais-Pagination-link {
          color: ${theme.secondary};
        }

        .ais-Pagination-item--selected {
          color: ${theme.white};
          background: ${theme.secondary};
        }

        .ais-Pagination-item--selected .ais-Pagination-link {
          color: currentColor;
        }

        .ais-Pagination-item--disabled {
          visibility: visible;
          color: #bbbbbb;
        }

        .ais-Pagination-item--disabled[disabled],
        .ais-Pagination-item--disabled:disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .ais-Pagination-item--disabled:hover {
          cursor: default;
          text-decoration: none;
        }

        .ais-Pagination-link {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .ais-Stats {
        display: inline-block;

        .ais-Stats-text {
          color: ${theme.placeholder};
        }
      }

      [type='checkbox'],
      [type='radio'] {
        appearance: none;
        outline-offset: -2px;
      }

      .ais-SortBy-select {
        transition: 0.3s ease border-color;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNC45NSAxMCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xLjQxIDQuNjdsMS4wNy0xLjQ5IDEuMDYgMS40OUgxLjQxek0zLjU0IDUuMzNMMi40OCA2LjgyIDEuNDEgNS4zM2gyLjEzeiI+PC9wYXRoPjwvc3ZnPg==);
        background-color: rgba(0, 0, 0, 0.3);
        background-position: right;
        background-repeat: no-repeat;
        width: 100%;
        color: white;
        border: none;
        outline: none;
        border-radius: 4px;
        padding: 0.2em 1em 0.2em 0.2em;
        box-sizing: border-box;
        font-weight: 400;
        height: 1.75em;
        appearance: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .ais-Hits .ais-Hits-list {
        display: grid;
        grid-gap: 2rem;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 2rem;
        margin-left: -0.5rem;
        margin-right: 0.5rem;

        @media screen and (max-width: 1100px) {
          grid-template-columns: 1fr 1fr;
        }

        @media screen and (max-width: 900px) {
          grid-template-columns: 1fr;
        }
      }

      @media screen and (min-width: 1100px) {
        .ais-Hits-item {
          > div {
            > img {
              height: 147px !important;
            }
          }
        }
      }
    }
  `};
`;

export default createGlobalStyle`
  ${styles}
`;
