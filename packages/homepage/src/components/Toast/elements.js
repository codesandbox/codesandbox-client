import styled from 'styled-components';

export const Toastcontainer = styled.div`
  text-align: center;
  line-height: 2rem;
  padding: 0.25rem 0 0.25rem 2rem;
  display: block;
  background: #151515;
  border: 1px solid #242424;
  position: fixed;
  z-index: 99999999;
  bottom: 2rem;
  left: 50%;
  border-radius: 0.25rem;
  transform: translateX(-50%);
  /* background:green; */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24);

  a {
    text-decoration: none;
    color: #0971f1;
    border-bottom: 1px solid transparant;
    transform: all 100ms ease-out;
  }

  a:hover {
    border-bottom: 1px solid;
  }

  span {
    overflow: hidden;
    text-indent: 99px;
    float: right;
    display: block;
    width: 2em;
    height: 2rem;
    margin: 0 0.25rem;
    /* background:red; */
    background-position: center;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='32' viewBox='0 0 24 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 11.9091L16.0909 11L12 15.0909L7.90909 11L7 11.9091L11.0909 16L7 20.0909L7.90909 21L12 16.9091L16.0909 21L17 20.0909L12.9091 16L17 11.9091Z' fill='%23999999'/%3E%3C/svg%3E%0A");
  }
`;
