import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import {
  unstable_FormMessage as FormMessage,
  unstable_FormRemoveButton as FormRemoveButton,
  unstable_FormPushButton as FormPushButton,
  unstable_FormSubmitButton as FormSubmitButton,
} from 'reakit/Form';
import {
  Button as BaseButton,
  FormInput,
} from '@codesandbox/common/lib/components';

export const Container = styled.div`
  grid-area: userinfo;
  align-self: start;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #151515;
  border: 1px #242424 solid;
  border-radius: 4px;
`;

export const AboutUser = styled.div`
  display: grid;
  grid-template-areas:
    'avatar name'
    'avatar username'
    'bio bio';
  grid-template-columns: min-content;
  padding: 1rem;

  &:not(:last-child) {
    border-bottom: 1px #242424 solid;
  }
`;

export const ProfilePicture = styled.div`
  position: relative;
  grid-area: avatar;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68px;
  height: 68px;
`;

const rollover = css`
  transition: filter 0.1s linear;

  &:hover {
    filter: brightness(120%);
  }
`;

export const Avatar = styled.img`
  ${rollover}
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  border: 1px #242424 solid;
  border-radius: 4px;
`;

const badge = css`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 14px;
  border-radius: 1px;
  font-family: Inter;
  font-weight: bold;
  user-select: none;

  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 34px;
    height: 14px;
    border: 1px #151515 solid;
    border-radius: 1px;
  }
`;

export const ProBadge = styled.span`
  ${badge}
  background-color: #535BCF;
  color: #fff;
  font-size: 11px;
`;

export const TeamBadge = styled.span`
  ${badge}
  background-color: #BF5AF2;
  color: #000;
  font-size: 9px;
`;

export const Name = styled.h1`
  display: inline-flex;
  align-items: center;
  grid-area: name;
  margin: 0;
  margin-top: 0.5rem;
  padding-left: 1rem;
  color: #fff;
  font-family: Inter;
  font-size: 19px;
  font-weight: 700;
`;

export const Username = styled.h2`
  display: inline-flex;
  align-items: center;
  grid-area: username;
  margin: 0;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  color: #757575;
  font-family: Inter;
  font-size: 13px;
  font-weight: 500;
`;

export const BioInput = styled(FormInput).attrs({
  forwardedAs: TextareaAutosize,
  rows: 3,
  maxLength: 280,
  async: true,
})`
  resize: none;
`;

export const InputCounter = styled.div<{ valid: boolean }>`
  ${({ valid }) => css`
    width: 100%;
    color: ${valid ? css`#757575` : css`#e1270e`};
    text-align: right;
  `}
`;

export const Bio = styled.div`
  grid-area: bio;
  margin-top: 1rem;
  color: #999999;
  font-family: Inter;
  font-size: 13px;
`;

export const Associations = styled.div`
  padding: 1rem;

  &:not(:last-child) {
    border-bottom: 1px #242424 solid;
  }
`;

export const SubHeader = styled.h3`
  margin: 0;
  margin-bottom: 1rem;
  font-family: Inter;
  font-size: 12px;
  font-weight: 700;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 32px);
  grid-gap: 13px 8px;
`;

export const Thumbnail = styled.img`
  ${rollover}
  width: 2rem;
  height: 2rem;
  border: 1px #242424 solid;
  border-radius: 4px;
`;

export const SocialMedia = styled.div`
  padding: 1rem;
`;

export const Places = styled.ul`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;

    ${theme.media.greaterThan(theme.sizes.medium)} {
      flex-direction: column;
    }
  `}
`;

export const LinkInput = styled(FormInput).attrs({
  type: 'url',
})`
  position: relative;
  padding: 2px 32px 2px 8px;
`;

export const RemoveLink = styled(FormRemoveButton)`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  width: 25px;
  height: 25px;
  padding: 0;
  border-radius: 0px 4px 0px 0px;
  border: none;
  background: none;
  color: #999999;
  font-size: 16px;
  line-height: 25px;
  user-select: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    color: #fff;
  }
`;

export const InputError = styled(FormMessage)`
  margin-top: 0.5rem;
  color: #e1270e;
`;

export const SocialLink = styled.li`
  ${({ theme }) => css`
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    color: #757575;
    font-family: Inter;
    font-size: 13px;
    font-weight: 500;

    ${theme.media.lessThan(theme.sizes.medium)} {
      flex: 0 0 25%;
      min-width: 160px;
    }

    a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      transition: color 0.1s linear;
      white-space: nowrap;

      &:visited,
      &:active {
        color: #757575;
      }

      &:hover,
      &:focus {
        color: #fff;
      }

      svg {
        color: #fff;
        font-size: 16px;
        padding-right: 0.5rem;
      }
    }
  `}
`;

const button = css`
  align-self: center;
  width: 85%;
  padding: 4px 8px;
  border: none;
  border-radius: 2px;
  font-family: Inter;
  font-size: 14px;
`;

export const Edit = styled(BaseButton)`
  ${button}
  margin-bottom: 1.25rem;
  background-color: #242424;
  color: #fff;

  &:disabled {
    opacity: 40%;
    cursor: initial;
  }

  &:hover,
  &:focus {
    background-color: #575757;
    transform: scale(1.02);
  }
`;

export const Save = styled(FormSubmitButton)`
  ${button}
  margin-bottom: 0.5rem;
  background-color: #0971f1;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  cursor: pointer;

  &:disabled {
    box-shadow: none;
    opacity: 40%;
    cursor: initial;
  }

  &:hover,
  &:focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1.02);
  }
`;

export const Cancel = styled(BaseButton).attrs({
  type: 'reset',
})`
  ${button}
  margin-bottom: 1.25rem;
  background-color: transparent;
  color: #757575;

  &:hover,
  &:focus {
    background-color: transparent;
    color: #999999;
  }
`;

export const AddSite = styled(FormPushButton)`
  ${button}
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  margin-bottom: 1.25rem;
  background-color: transparent;
  color: #757575;
  text-align: inherit;
  cursor: pointer;

  svg {
    padding-right: 4px;
    font-size: 16px;
  }

  &:hover,
  &:focus {
    background-color: transparent;
    color: #999999;
  }
`;
