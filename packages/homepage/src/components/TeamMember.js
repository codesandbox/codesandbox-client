import React from 'react';
import { shuffle } from 'lodash-es';
import styled, { css } from 'styled-components';
import ives from '../assets/images/people/ives.png';
import bas from '../assets/images/people/bas.png';
import bogdan from '../assets/images/people/bogdan.png';
import oskar from '../assets/images/people/oskar.png';
import sara from '../assets/images/people/sara.png';
import danny from '../assets/images/people/danny.png';
import gareth from '../assets/images/people/gareth.png';
import sid from '../assets/images/people/sid.jpg';
import christian from '../assets/images/people/christian.png';
import sanne from '../assets/images/people/sanne.png';
import andras from '../assets/images/people/andras.png';

const people = [
  {
    name: 'Ives van Hoorne',
    pic: ives,
    color: '#F24E62',
    team: 'Founder',
  },
  {
    name: 'Bas Buursma',
    pic: bas,
    color: '#76D0FB',
    team: 'Founder',
  },
  {
    name: 'Oskar van Eeden',
    pic: oskar,
    color: '#76D0FB',
    team: 'Operations',
  },
  {
    name: 'Bogdan Luca',
    pic: bogdan,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Sara Vieira',
    pic: sara,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Danny Rutchie',
    pic: danny,
    color: '#B567EB',
    team: 'Design',
  },
  {
    name: 'Gareth Wilson',
    pic: gareth,
    color: '#F7A239',
    team: 'Growth',
  },
  {
    name: 'Siddharth Kshetrapal',
    pic: sid,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Christian Alfoni',
    pic: christian,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Sanne Kalkman',
    pic: sanne,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'András Bácsai',
    pic: andras,
    color: '#F24E62',
    team: 'Engineering',
  },
];

const Peep = styled.img`
  width: 80px;
  height: 80px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.24), 0px 8px 4px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

  ${props => {
    if (props.border) {
      return `border: 4px solid ${props.color || '#343434'};`;
    }

    return `
      border: 2px solid #343434;
      transition: all 200ms ease;
      &:hover {
        border: 4px solid ${props.color};
      }
      `;
  }}
`;

const beforeAndAfterStyles = css`
  font-size: 19px;
  line-height: 23px;
  text-align: center;
  position: absolute;
  z-index: 10;
  opacity: 0;
  display: none;
  transition: opacity 200ms ease;
  transform: translateX(-50%);
  left: 50%;
`;

const PersonWrapper = styled.div`
  position: relative;
  &:after {
    content: '${props => props.team}';
    ${beforeAndAfterStyles}
    color: #757575;
    top: calc(100% + 54px);
  }

  &:before {
    content: '${props => props.personName}';
    ${beforeAndAfterStyles}

    font-weight: bold;
    top: calc(100% + 8px);
    width: 208px;
    height: 88px;
    padding: 16px 4px;
    background: #151515;
    border: 1px solid #343434;

    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.24),
      0px 8px 4px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    color: #fff;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  :hover {
    :before,
    :after {
      display: block;
      opacity: 1;
    }
  }
`;

const TeamMember = ({ name, border, noHover, ...props }) => {
  // András, thank you
  const noAccentsName = str =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const person = people.find(p =>
    noAccentsName(p.name.toLocaleLowerCase()).includes(name.toLocaleLowerCase())
  );

  const Wrapper = ({ children }) =>
    noHover ? (
      children
    ) : (
      <PersonWrapper personName={person.name} team={person.team}>
        {children}
      </PersonWrapper>
    );

  if (person) {
    return (
      <Wrapper>
        <Peep
          border={border}
          color={person.color}
          src={person.pic}
          alt={person.name}
          {...props}
        />
      </Wrapper>
    );
  }

  return null;
};

export const getRandomTeamMembers = number =>
  shuffle(people).splice(0, number + 2);

export default TeamMember;
