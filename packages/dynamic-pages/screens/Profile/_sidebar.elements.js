import styled from 'styled-components';

export const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 8px;
  margin-right: 32px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

export const Aside = styled.div`
  background: #1c2022;
  border-radius: 8px;
  padding: 32px;
`;

export const Stats = styled.div`
  margin: 32px 0;
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-gap: 35px;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

export const Social = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 0;
  padding: 0;
  margin-left: -8px;

  span {
    color: #b8b9ba;
    margin-left: 8px;
  }

  a {
    color: #66b9f4;
    margin-left: 8px;
    text-decoration: none;
  }
`;

export const BadgeWrapper = styled.ul`
  margin: 0;
  padding: 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > * {
    margin-right: 10px;
  }
`;

export const Title = styled.h3`
  font-family: Poppins, arial;
  font-weight: 300;
  font-size: 24px;
  margin-bottom: 30px;
  color: #f2f2f2;
`;
