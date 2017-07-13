import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Input from 'app/components/Input';
import Centered from 'app/components/flex/Centered';
import Relative from 'app/components/Relative';
import SignInButton from 'app/containers/SignInButton';

import {
  currentUserSelector,
  loggedInSelector,
} from 'app/store/user/selectors';

import Range from './Range';
import SubscribeForm from './SubscribeForm';

import Title from '../Title';
import badges from '../Badge/badge-info';

const Container = styled.div`padding: 1rem 0;`;

const PriceInput = styled(Input)`
  font-size: 1.5rem;
  padding-left: 2rem;
  padding-right: 1rem;
  width: 6rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Month = styled.span`
  position: absolute;
  margin-left: 0.5rem;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 1);
  left: 100%;
  font-weight: 300;
  bottom: 1.75rem;
`;

const Currency = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 1.5rem;
  font-weight: 300;
  padding-top: 8px;
  color: rgba(255, 255, 255, 0.5);
`;

const RangeContainer = styled.div`width: 300px;`;

const StyledSignInButton = styled(SignInButton)`
  display: block;
  margin-top: 2rem;
  width: 300px;
`;

type Props = {
  price: number,
  setPrice: (price: number) => void,
  badge: string,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
  loggedIn: loggedInSelector(state),
});
class PricingChoice extends React.PureComponent {
  props: Props;

  handleEventChange = e => {
    this.props.setPrice(+e.target.value);
  };

  handleRangeChange = value => {
    this.props.setPrice(value);
  };

  render() {
    const { price, badge, loggedIn, user } = this.props;

    return (
      <Container>
        <Centered horizontal vertical={false}>
          <Title>Pay what you want</Title>

          <Relative>
            <Currency>$</Currency>
            <PriceInput
              onChange={this.handleEventChange}
              value={price}
              type="number"
            />
            <Month>/month</Month>
          </Relative>
          <RangeContainer>
            <Range
              onChange={this.handleRangeChange}
              min={5}
              max={50}
              step={1}
              value={price}
              color={badges[badge].color}
            />
          </RangeContainer>
          {loggedIn
            ? <SubscribeForm name={user.name} />
            : <StyledSignInButton />}
        </Centered>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(PricingChoice);
