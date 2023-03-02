import React from 'react';
import { shuffle } from 'lodash-es';
import styled, { css } from 'styled-components';
import ives from '../assets/images/people/ives.png';
import bas from '../assets/images/people/bas.png';
import bogdan from '../assets/images/people/bogdan.png';
import oskar from '../assets/images/people/oskar.png';
import christian from '../assets/images/people/christian.png';
import sanne from '../assets/images/people/sanne.png';
import alex from '../assets/images/people/alex.jpg';
import zeh from '../assets/images/people/zeh.png';
import danilowoz from '../assets/images/people/danilowoz.jpg';
import tamas from '../assets/images/people/tamas.png';
import jasper from '../assets/images/people/jasper.jpg';
import joana from '../assets/images/people/joana.jpg';
import marco from '../assets/images/people/marco.jpg';
import neco from '../assets/images/people/neco.png';
import roman from '../assets/images/people/roman.jpg';
import james from '../assets/images/people/james.jpg';
import gianmarco from '../assets/images/people/gsimone.jpeg';
import ace from '../assets/images/people/ace.jpg';
import maria from '../assets/images/people/maria.png';
import lena from '../assets/images/people/lena.png';
import ioana from '../assets/images/people/ioana.jpg';
import artem from '../assets/images/people/artem.png';
import aj from '../assets/images/people/aj.jpg';
import joji from '../assets/images/people/joji.png';
import tristan from '../assets/images/people/tristan.jpg';
import david from '../assets/images/people/david.jpg';
import farrell from '../assets/images/people/farrellt.jpg';
import mihai from '../assets/images/people/mihai.jpg';
import filipe from '../assets/images/people/filipe.jpg';
import jk from '../assets/images/people/jk.jpeg';

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
    name: 'Alex Moldovan',
    pic: alex,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Zeh Fernandes',
    pic: zeh,
    color: '#B567EB',
    team: 'Design',
  },
  {
    name: 'Marco Vincit',
    pic: marco,
    color: '#B567EB',
    team: 'Design',
  },
  {
    name: 'Danilo Woznica',
    pic: danilowoz,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Tamas Szuromi',
    pic: tamas,
    color: '#F7A239',
    team: 'Data',
  },
  {
    name: 'Jasper De Moor',
    pic: jasper,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Joana Telker',
    pic: joana,
    color: '#76D0FB',
    team: 'Operations',
  },
  {
    name: 'Roman Kuba',
    pic: roman,
    color: '#B567EB',
    team: 'Engineering',
  },
  {
    name: 'James Amey',
    pic: james,
    color: '#6200ff',
    team: 'Support',
  },
  {
    name: 'Gianmarco Simone',
    pic: gianmarco,
    color: '#ddaa00',
    team: 'Engineering',
  },
  {
    name: 'Adewale Abati',
    pic: ace,
    color: '#008753',
    team: 'DevRel',
  },
  {
    name: 'Maria Clara',
    pic: maria,
    color: '#272b8c',
    team: 'Engineering',
  },
  {
    name: 'Lena Sotto Mayor',
    pic: lena,
    color: '#B567EB',
    team: 'Design',
  },
  {
    name: 'Necoline Hubner',
    pic: neco,
    color: '#F24E62',
    team: 'Product',
  },
  {
    name: 'Stefania Ioana Chiorean',
    pic: ioana,
    color: '#799900',
    team: 'Engineering',
  },
  {
    name: 'Artem Zakharchenko',
    pic: artem,
    color: '#FF6A33',
    team: 'Engineering',
  },
  {
    name: 'AJ Foster',
    pic: aj,
    color: '#8c50b5',
    team: 'Engineering',
  },
  {
    name: 'Joji Augustine',
    pic: joji,
    color: '#008900',
    team: 'Engineering',
  },
  {
    name: 'Tristan Dubbeld',
    pic: tristan,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'David Hollins',
    pic: david,
    color: '#F24E62',
    team: 'Engineering',
  },
  {
    name: 'Farrell Tatam',
    pic: farrell,
    color: '#2986CC',
    team: 'Operations',
  },
  {
    name: 'Mihai Popa',
    pic: mihai,
    color: '#16bf97',
    team: 'Engineering',
  },
  {
    name: 'Filipe Lima',
    pic: filipe,
    color: '#24be9d',
    team: 'Marketing',
  },
  {
    name: 'Jaya Krishna Namburu',
    pic: jk,
    color: '#F24E62',
    team: 'Engineering',
  },
];

const Peep = styled.img`
  width: 80px;
  height: 80px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.24), 0px 8px 4px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  object-fit: cover;

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
