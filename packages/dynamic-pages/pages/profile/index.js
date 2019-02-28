import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import Link from 'next/link';
import Slider from 'react-slick';
import Right from 'react-icons/lib/fa/angle-right';
import Left from 'react-icons/lib/fa/angle-left';
import FeaturedSandbox from 'common/components/FeaturedSandbox';
import { sandboxUrl } from 'common/utils/url-generator';
import WideSandbox from 'common/components/WideSandbox';
import Sidebar from '../../screens/Profile/sidebar';
import fetch from '../../utils/fetch';
import PageContainer from '../../components/PageContainer';

const SlideStyles = createGlobalStyle`
  .slick-slide {
    padding-left: 12px;
    padding-right: 12px;

    &:first-child {
         padding-left: 0;
    }
  }

  .slick-track {
    margin-left: -0.5rem;
    margin-right: -0.5rem;

    position: relative;
  }

  .slick-slider {
    position: relative;
        margin-bottom: 2rem;
  }
`;

const Grid = styled.main`
  display: grid;
  grid-gap: 60px;
  grid-template-columns: 400px 1fr;
`;

const Title = styled.h3`
  font-family: Poppins, arial;
  font-weight: 300;
  font-size: 24px;
  color: #f2f2f2;
`;

const More = styled.div`
  transition: all 200ms ease;
  background-color: #1c2022;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
  display: flex !important;
  align-items: center;
  justify-content: center;

  a {
    font-family: 'Poppins';
    font-size: 1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
  }

  &:hover {
    background-color: #212629;
    transform: translateY(-5px);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.3);
  }
`;

const ArrowContainer = styled.div`
  background: #1c2022;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -15px;
  z-index: 12;
  padding: 10px 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);

  ${props =>
    props.next &&
    css`
      left: auto;
      right: 0px;
    `};
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  appearance: none;

  svg {
    fill: #f2f2f2;
    width: 28px;
    height: auto;
  }
`;

const settings = {
  dots: false,
  infinite: false,
  autoplay: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  nextArrow: <Arrow next />,
  prevArrow: <Arrow prev />,
};

function Arrow(props) {
  const { onClick, next } = props;
  return (
    <ArrowContainer next={next}>
      <ArrowButton onClick={onClick}>{next ? <Right /> : <Left />}</ArrowButton>
    </ArrowContainer>
  );
}

const Profile = ({ profile, liked }) => {
  const openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  return (
    <PageContainer>
      <Grid>
        <Sidebar {...profile} />
        <main
          css={`
            // chromebug
            display: block;
            min-height: 0;
            min-width: 0;
          `}
        >
          <div style={{ marginBottom: 30 }}>
            <FeaturedSandbox sandboxId={profile.showcased_sandbox_shortid} />
          </div>
          <SlideStyles />
          <Title>User sandboxes</Title>
          <Slider {...settings}>
            {profile.top_sandboxes.map(sandbox => (
              <WideSandbox
                small
                key={sandbox.id}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={sandbox}
              />
            ))}
            <More>
              <Link
                href={{
                  pathname: `/profile/${profile.username}/sandboxes`,
                }}
              >
                <a>See all sandboxes</a>
              </Link>
            </More>
          </Slider>

          <Title>Liked sandboxes</Title>
          <Slider {...settings}>
            {liked[1]
              .slice(0, 5)
              .map(sandbox => (
                <WideSandbox
                  small
                  key={sandbox.id}
                  pickSandbox={({ id }) => openSandbox(id)}
                  sandbox={sandbox}
                />
              ))}
            <More>
              <Link
                href={{
                  pathname: `/profile/${profile.username}/liked`,
                }}
              >
                See all liked sandboxes
              </Link>
            </More>
          </Slider>
        </main>
      </Grid>
    </PageContainer>
  );
};

Profile.getInitialProps = async ({ query: { username } }) => {
  const profile = await fetch(`/api/v1/users/${username}`);
  const sandboxes = await fetch(`/api/v1/users/${username}/sandboxes`);
  const liked = await fetch(`/api/v1/users/${username}/sandboxes/liked?page=1`);
  return { profile: profile.data, sandboxes, liked };
};

export default Profile;
