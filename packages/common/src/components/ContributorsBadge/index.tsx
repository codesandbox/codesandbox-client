import React from 'react';
import IconBase from 'react-icons/lib/IconBase';
import Tooltip from '../../components/Tooltip';

import { isContributor } from './is-contributor';

type Props = {
  className?: string;
  username: string;
};

type State = {
  isContributor: boolean;
};

export default class ContributorsBadge extends React.Component<Props, State> {
  state: State = {
    isContributor: false,
  };

  updateContributorStatus(props = this.props) {
    isContributor(props.username).then(contributor => {
      this.setState({ isContributor: contributor });
    });
  }

  componentDidMount() {
    this.updateContributorStatus();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateContributorStatus(nextProps);
  }

  render() {
    const { className, username } = this.props;
    if (!this.state.isContributor) {
      return false;
    }

    return (
      <a
        target="_blank"
        rel="noreferrer noopener"
        onClick={e => e.stopPropagation()}
        href={`https://github.com/codesandbox/codesandbox-client/commits?author=${username}`}
      >
        <Tooltip
          style={{ display: 'flex' }}
          content="Open Source Contributor to CodeSandbox"
        >
          <IconBase
            className={className}
            width="1em"
            height="0.67em"
            viewBox="0 0 284 192"
            fill="none"
          >
            <path
              d="M276 30.9916C229.5 58.0917 180.5 77.5917 130 79.5917C59.1265 79.5917 0 61.5917 0 34.0917C0 15.5917 41 -0.408325 114.803 2.99163C185.677 2.99163 314.5 -13.5084 276 30.9916Z"
              transform="translate(0 112.408)"
              fill="#C5A56B"
            />
            <path
              d="M270.493 40.3281C255 56.5 184.008 89 125.796 89C55.5 89 2.78651e-06 72.0001 0 44.0001C-1.84109e-06 25.5001 72.3769 0 137.189 0C202.002 0 284.165 22.25 270.493 40.3281Z"
              transform="translate(0 99.9999)"
              fill="#EAC17A"
            />
            <path
              d="M256.656 123.303C256.656 143.23 211.803 163.158 127.082 164.404C48.5987 165.557 0 143.23 0 123.303C0 64.8345 43.6066 0 133.311 0C223.016 0 256.656 64.8345 256.656 123.303Z"
              transform="translate(26.3443 2.85638)"
              fill="#E1BD7B"
            />
            <path
              d="M166.951 122.057C100.918 140.739 25.3333 134.097 0 127.039C89.7049 119.566 115.356 113.806 153.246 93.4111C201.836 67.256 181.902 24.9096 166.951 0C186.885 18.6822 204.328 43.5918 204.328 95.9021C203.082 102.129 194.361 114.302 166.951 122.057Z"
              transform="translate(78.6721 32.7479)"
              fill="#CFAE72"
            />
            <path
              d="M30.5 175.564C11.5 169.564 3.50001 163.464 0 159.564C-2.68221e-06 158.351 0 158.064 0 157.351C14.9649 150.535 24.6407 147.961 34.7869 144.58C50.9836 12.5587 118.262 5.0858 138.197 1.34936C152.558 -1.34245 178.066 0.420214 190.525 2.91111V5.30307C183.049 6.54874 166.852 10.0704 153.148 15.2671C95.3377 37.1876 72.5793 119.156 69.6721 157.351C54.7213 165.239 37.5 173.564 30.5 175.564Z"
              transform="translate(9 2.43616)"
              fill="#AD915F"
            />
            <path
              d="M14.2869 164.285C-4.40165 159.303 7.47541 161.512 0 155.285C13.7049 149.057 2.32624 148.394 14.2869 144.409C30.4836 12.3875 97.7623 4.91469 117.697 1.17824C133.644 -1.81091 158.811 1.39569 170.025 5.13196C162.549 6.37762 146.352 9.89933 132.648 15.096C74.8377 37.0165 51.1656 110.998 47.4279 158.326C32.477 166.214 21.7623 163.039 14.2869 164.285Z"
              transform="translate(29.5 0.21521)"
              fill="#CFAE72"
            />
            <path
              d="M67.9279 13.7003C52.977 10.7111 39.3552 3.32128 34.7869 0C28.5574 1.24548 6.22951 11.2222 0 14.9587C7 23.1587 24.5 30.1587 30.5 31.6587C38 29.1587 53.1432 21.1732 67.9279 13.7003Z"
              transform="translate(9.00001 144.841)"
              fill="#E1BD7B"
            />
            <path
              d="M0 3.73644C22.9246 3.73644 43.6066 1.24548 51.082 0C51.082 0.2764 52.3279 0.949887 52.3279 1.24548C52.3279 9.8297 51.082 25.7564 51.082 28.6461C40.3189 30.6023 14.0129 33.1877 1.2459 33.628C1.00761 33.6362 0.228282 32.3749 0 32.3825V3.73644Z"
              transform="translate(154.672 134.877)"
              fill="#AD915F"
            />
            <path
              d="M51.082 28.6461C40.118 30.6388 12.459 31.9674 0 32.3825V3.73644C22.9246 3.73644 43.6066 1.24548 51.082 0V28.6461Z"
              transform="translate(155.918 136.123)"
              fill="#C5A56B"
            />
            <path
              d="M2.49181 7.47289C10.4656 6.4765 19.1038 2.0758 22.4262 0L23.2984 0.373644L24.1705 0.747289C25.9146 7.88228 27.4098 21.2484 27.4098 24.9096C18.1916 31.3602 8.08792 37.0438 2.4918 38.6099L0 37.7381C0.415301 29.0197 1.49509 10.462 2.49181 7.47289Z"
              transform="translate(245 117.4)"
              fill="#AD915F"
            />
            <path
              d="M27.4098 25.4077C17.4426 32.3824 4.98361 36.617 0 37.8625C0.415301 29.1441 1.49508 10.9601 2.4918 7.97096C10.4656 6.97457 18.3563 2.0758 21.6787 0C23.3399 6.64257 27.4098 21.4222 27.4098 25.4077Z"
              transform="translate(247.492 118.148)"
              fill="#C5A56B"
            />
            <path
              d="M0.2748 36.6952C-1.46234 18.9764 5.45728 6.8743 9.22109 3.25526C30.7616 -3.34589 59.5983 1.51809 71.2371 5.3398C70.8897 5.42666 66.2863 6.29523 51.3468 9.76952C24.4211 16.2838 8.35253 28.8781 0.2748 36.6952Z"
              transform="translate(128.293)"
              fill="#E1BD7B"
            />
            <path
              d="M38.2685 0C19.5942 10.4229 9.98857 14.5613 0 18.9042C6 20.4042 11 21.4042 15.2086 22.2042C20.42 19.5985 39.5713 9.9451 54.337 2.56224C49.9943 1.91083 49.9942 1.91081 38.2692 0.000126629L38.2685 0Z"
              transform="translate(48 161.596)"
              fill="#FCF7DE"
            />
            <path
              d="M59.1142 3.12681L19 22.9042C22.5 23.4042 22.5 23.4042 26.5 24.0042C33.4486 20.0956 50.5732 11.4651 64.7599 3.64796C59.1142 3.12681 64.7599 3.5611 59.1142 3.12681Z"
              transform="translate(48 161.596)"
              fill="#FCF7DE"
            />
            <path
              d="M5.71143 19.8105C15.2114 16.3105 24.2114 10.8105 41.6486 1.73714L36.4371 0C23.9297 6.60114 11.7257 13.6648 0 17.5733L5.71143 19.8105Z"
              transform="translate(30.2886 155.69)"
              fill="#FCF7DE"
            />
          </IconBase>
        </Tooltip>
      </a>
    );
  }
}
