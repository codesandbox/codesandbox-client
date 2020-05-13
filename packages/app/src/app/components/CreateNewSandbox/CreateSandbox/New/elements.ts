import styled from 'styled-components';

export const ListWrapper = styled.div`
  > ul,
  ol {
    padding: 0;
    margin: 1rem 0 3rem 0;
  }

  > ul li,
  ol li {
    list-style: none;
    line-height: 2rem;
    padding: 0px 0px 0px 2rem;
    position: relative;
  }

  > ul li:before {
    content: ' ';
    background-image: url("data:image/svg+xml;utf8,<svg width='15' height='11' viewBox='0 0 15 11' xmlns='http://www.w3.org/2000/svg'><path id='mask' d='M2 6l3.5 3.5L13 2' stroke-width='2' stroke='%236cc7f6'  fill='none' stroke-linecap='round'/></svg>");
    height: 11px;
    width: 15px;
    left: 2px;
    top: 10px;
    position: absolute;
  }

  > ol li:before {
    content: '+ ';
    font-weight: 600;
    color: #5bc266;
    font-size: 19px;
    width: 10px;
    height: 10px;
    top: -1px;
    left: 5px;

    position: absolute;
  }

  > ul li a,
  ol li a {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0);
    transition: all 100ms ease-in;
  }

  > ul li a:hover,
  ol li a:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 1);
  }
`;
