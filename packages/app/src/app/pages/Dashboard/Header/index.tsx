import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

import { useAppState, useActions } from 'app/overmind';
import {
  Stack,
  Input,
  Button,
  Icon,
  IconButton,
  List,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

interface HeaderProps {
  onSidebarToggle: () => void;
}

/** poor man's feature flag - to ship the unfinished version */
const SHOW_COMMUNITY_SEARCH = localStorage.SHOW_COMMUNITY_SEARCH;

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const { modalOpened } = useActions();
    const {
      activeWorkspaceAuthorization,
      hasLogIn,
      environment,
    } = useAppState();
    const showDiscover = !environment.isOnPrem;

    return (
      <Stack
        as="header"
        justify="space-between"
        align="center"
        paddingX={4}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          padding: '16px',
          color: 'titleBar.activeForeground',
        })}
      >
        <IconButton
          name="menu"
          size={16}
          title="Menu"
          onClick={onSidebarToggle}
          css={css({ display: ['block', 'block', 'none'] })}
        />

        <div>
          <UserMenu
            css={css({
              display: ['none', 'none', 'block'],
            })}
          >
            <Button
              as={UserMenu.Button}
              variant="link"
              css={css({
                marginLeft: '2px',
                transition: 'color .3s',

                '.chevron': {
                  transition: 'transform .3s',
                },

                '&:hover': {
                  '.chevron': {
                    transform: 'translateY(2px)',
                  },
                },
              })}
            >
              <LogoIcon
                width={18}
                height={18}
                css={css({
                  marginRight: '8px',
                })}
              />
              <Icon
                className="chevron"
                name="chevronDown"
                size={6}
                title="User actions"
              />
            </Button>
          </UserMenu>
        </div>

        <SearchInputGroup />

        <Stack align="center" gap={2}>
          <a
            href="https://www.producthunt.com/posts/codesandbox-cde?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-codesandbox&#0045;cde"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="168"
              height="38"
              viewBox="0 0 168 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_60_2)">
                <path
                  d="M160.486 1.29785H7.51398C3.82472 1.29785 0.833984 4.28859 0.833984 7.97785V30.0219C0.833984 33.7111 3.82472 36.7019 7.51398 36.7019H160.486C164.175 36.7019 167.166 33.7111 167.166 30.0219V7.97785C167.166 4.28859 164.175 1.29785 160.486 1.29785Z"
                  fill="#252525"
                  stroke="#252525"
                  strokeWidth="0.668"
                />
                <path
                  d="M39.4294 10.7512H37.26V11.7463H39.1593V12.4978H37.26V14.312H36.3618V9.99089H39.4294V10.7512ZM39.9666 9.98502H40.8649V14.312H39.9666V9.98502ZM45.2095 14.312H44.3053L42.5381 11.2385V14.312H41.6956V9.98502H42.6438L44.367 13.0057V9.98502H45.2095V14.312ZM47.919 14.312H46.0549V9.98502H47.919C48.1871 9.98893 48.4102 10.0202 48.5883 10.079C48.8916 10.1788 49.1373 10.3617 49.3251 10.6279C49.4758 10.8432 49.5786 11.0761 49.6334 11.3266C49.6882 11.5771 49.7156 11.8158 49.7156 12.0428C49.7156 12.6182 49.6001 13.1055 49.3692 13.5047C49.056 14.0429 48.5726 14.312 47.919 14.312ZM48.5912 11.0888C48.4523 10.8539 48.1773 10.7365 47.7664 10.7365H46.9327V13.5605H47.7664C48.193 13.5605 48.4905 13.3501 48.6588 12.9294C48.7507 12.6984 48.7967 12.4235 48.7967 12.1045C48.7967 11.6641 48.7282 11.3256 48.5912 11.0888ZM54.6326 12.6446V9.98502H55.5514V12.6446C55.5514 13.1045 55.48 13.4627 55.3371 13.719C55.071 14.1887 54.5631 14.4236 53.8136 14.4236C53.064 14.4236 52.5552 14.1887 52.2871 13.719C52.1442 13.4627 52.0728 13.1045 52.0728 12.6446V9.98502H52.9916V12.6446C52.9916 12.9421 53.0269 13.1593 53.0973 13.2963C53.2069 13.539 53.4457 13.6603 53.8136 13.6603C54.1795 13.6603 54.4173 13.539 54.5269 13.2963C54.5974 13.1593 54.6326 12.9421 54.6326 12.6446ZM57.9879 13.6867C58.2012 13.6867 58.3744 13.6633 58.5075 13.6163C58.76 13.5263 58.8862 13.3589 58.8862 13.1143C58.8862 12.9714 58.8236 12.8609 58.6983 12.7826C58.5731 12.7063 58.3764 12.6387 58.1083 12.58L57.6503 12.4773C57.2002 12.3755 56.8891 12.265 56.7168 12.1456C56.4252 11.946 56.2794 11.6338 56.2794 11.2091C56.2794 10.8216 56.4203 10.4997 56.7022 10.2433C56.984 9.98697 57.3979 9.85879 57.9439 9.85879C58.3999 9.85879 58.7884 9.98012 59.1093 10.2228C59.4322 10.4635 59.6015 10.8138 59.6172 11.2737H58.7482C58.7326 11.0134 58.6191 10.8285 58.4077 10.7189C58.2668 10.6465 58.0917 10.6103 57.8822 10.6103C57.6494 10.6103 57.4634 10.6573 57.3245 10.7512C57.1855 10.8451 57.1161 10.9763 57.1161 11.1446C57.1161 11.2992 57.1846 11.4146 57.3216 11.491C57.4096 11.5418 57.5975 11.6015 57.8852 11.67L58.6308 11.8491C58.9576 11.9274 59.2042 12.0321 59.3706 12.1632C59.6289 12.3667 59.7581 12.6613 59.7581 13.0468C59.7581 13.4421 59.6064 13.7709 59.3031 14.0331C59.0017 14.2934 58.575 14.4236 58.0232 14.4236C57.4595 14.4236 57.0163 14.2954 56.6934 14.039C56.3704 13.7807 56.209 13.4265 56.209 12.9763H57.072C57.0994 13.174 57.1533 13.3218 57.2335 13.4196C57.3803 13.5977 57.6317 13.6867 57.9879 13.6867ZM64.0146 14.4324C63.3962 14.4324 62.9236 14.2641 62.5967 13.9275C62.1584 13.5145 61.9392 12.9196 61.9392 12.1426C61.9392 11.35 62.1584 10.7551 62.5967 10.3578C62.9236 10.0212 63.3962 9.85292 64.0146 9.85292C64.633 9.85292 65.1056 10.0212 65.4325 10.3578C65.8689 10.7551 66.0871 11.35 66.0871 12.1426C66.0871 12.9196 65.8689 13.5145 65.4325 13.9275C65.1056 14.2641 64.633 14.4324 64.0146 14.4324ZM64.8688 13.2699C65.0783 13.0057 65.183 12.6299 65.183 12.1426C65.183 11.6573 65.0773 11.2825 64.8659 11.0183C64.6565 10.7522 64.3727 10.6191 64.0146 10.6191C63.6565 10.6191 63.3707 10.7512 63.1574 11.0154C62.9441 11.2796 62.8375 11.6553 62.8375 12.1426C62.8375 12.6299 62.9441 13.0057 63.1574 13.2699C63.3707 13.5341 63.6565 13.6662 64.0146 13.6662C64.3727 13.6662 64.6575 13.5341 64.8688 13.2699ZM70.2791 14.312H69.3749L67.6077 11.2385V14.312H66.7652V9.98502H67.7134L69.4366 13.0057V9.98502H70.2791V14.312Z"
                  fill="#F5F5F5"
                />
                <path
                  d="M40.5922 23.0255H38.4483V26.6558H36.3523V16.5594H40.7498C41.7635 16.5594 42.5718 16.8197 43.1745 17.3403C43.7773 17.8609 44.0787 18.6668 44.0787 19.7582C44.0787 20.95 43.7773 21.7925 43.1745 22.2857C42.5718 22.7789 41.711 23.0255 40.5922 23.0255ZM41.5786 20.9226C41.8526 20.6806 41.9896 20.297 41.9896 19.7719C41.9896 19.2468 41.8503 18.8723 41.5717 18.6486C41.2977 18.4248 40.9119 18.3129 40.4141 18.3129H38.4483V21.2857H40.4141C40.9119 21.2857 41.3 21.1647 41.5786 20.9226ZM49.257 20.9911C48.4716 20.9911 47.9441 21.2469 47.6747 21.7583C47.524 22.046 47.4487 22.4889 47.4487 23.0871V26.6558H45.4829V19.1897H47.3459V20.4911C47.6473 19.9934 47.9099 19.6532 48.1337 19.4705C48.499 19.1646 48.9739 19.0116 49.5584 19.0116C49.5949 19.0116 49.6246 19.0139 49.6474 19.0184C49.6748 19.0184 49.7319 19.0207 49.8187 19.0253V21.0254C49.6954 21.0117 49.5858 21.0026 49.4899 20.998C49.394 20.9934 49.3164 20.9911 49.257 20.9911ZM57.1957 20.1349C57.8259 20.9249 58.1409 21.8588 58.1409 22.9364C58.1409 24.0324 57.8259 24.9708 57.1957 25.7516C56.5655 26.5279 55.6089 26.916 54.3257 26.916C53.0425 26.916 52.0859 26.5279 51.4557 25.7516C50.8256 24.9708 50.5105 24.0324 50.5105 22.9364C50.5105 21.8588 50.8256 20.9249 51.4557 20.1349C52.0859 19.3449 53.0425 18.95 54.3257 18.95C55.6089 18.95 56.5655 19.3449 57.1957 20.1349ZM54.3189 20.6007C53.7481 20.6007 53.3074 20.8039 52.9969 21.2103C52.6909 21.6122 52.538 22.1875 52.538 22.9364C52.538 23.6853 52.6909 24.263 52.9969 24.6694C53.3074 25.0758 53.7481 25.279 54.3189 25.279C54.8897 25.279 55.328 25.0758 55.634 24.6694C55.9399 24.263 56.0929 23.6853 56.0929 22.9364C56.0929 22.1875 55.9399 21.6122 55.634 21.2103C55.328 20.8039 54.8897 20.6007 54.3189 20.6007ZM66.3399 16.5731V26.6558H64.4426V25.6215C64.164 26.0644 63.8467 26.3863 63.4905 26.5873C63.1343 26.7882 62.6914 26.8886 62.1617 26.8886C61.2895 26.8886 60.5543 26.537 59.9561 25.8338C59.3624 25.126 59.0656 24.2196 59.0656 23.1145C59.0656 21.8405 59.3579 20.8382 59.9424 20.1075C60.5314 19.3769 61.3169 19.0116 62.2986 19.0116C62.7507 19.0116 63.1526 19.1121 63.5042 19.313C63.8558 19.5093 64.1412 19.7833 64.3604 20.1349V16.5731H66.3399ZM61.0794 22.9707C61.0794 23.6602 61.2164 24.2105 61.4904 24.6214C61.7598 25.037 62.1708 25.2447 62.7233 25.2447C63.2759 25.2447 63.696 25.0393 63.9837 24.6283C64.2713 24.2173 64.4152 23.6853 64.4152 23.0323C64.4152 22.119 64.1846 21.466 63.7234 21.0733C63.4402 20.8359 63.1115 20.7172 62.737 20.7172C62.1662 20.7172 61.7461 20.9341 61.4767 21.3679C61.2118 21.7971 61.0794 22.3314 61.0794 22.9707ZM72.9087 25.6009C72.8904 25.6238 72.8448 25.6923 72.7717 25.8064C72.6986 25.9206 72.6119 26.021 72.5114 26.1078C72.2055 26.3818 71.9086 26.569 71.621 26.6695C71.3378 26.7699 71.0045 26.8202 70.6209 26.8202C69.5159 26.8202 68.7715 26.4229 68.3879 25.6283C68.1733 25.1899 68.066 24.5438 68.066 23.6899V19.1897H70.0661V23.6899C70.0661 24.1146 70.1163 24.4342 70.2168 24.6488C70.3949 25.0278 70.7442 25.2173 71.2648 25.2173C71.9315 25.2173 72.3881 24.9479 72.6347 24.4091C72.7626 24.1168 72.8265 23.731 72.8265 23.2515V19.1897H74.806V26.6558H72.9087V25.6009ZM83.1557 21.8679H81.1556C81.1191 21.5893 81.0255 21.3382 80.8748 21.1144C80.6556 20.813 80.3154 20.6624 79.8542 20.6624C79.1966 20.6624 78.7468 20.9889 78.5048 21.6418C78.377 21.9889 78.313 22.4501 78.313 23.0255C78.313 23.5734 78.377 24.0141 78.5048 24.3474C78.7377 24.9685 79.1761 25.279 79.8199 25.279C80.2766 25.279 80.6008 25.1557 80.7926 24.9091C80.9844 24.6625 81.1008 24.3429 81.1419 23.9502H83.1352C83.0895 24.5438 82.8749 25.1055 82.4913 25.6352C81.8794 26.4891 80.973 26.916 79.772 26.916C78.571 26.916 77.6874 26.5599 77.1212 25.8475C76.555 25.1351 76.2719 24.2105 76.2719 23.0734C76.2719 21.7903 76.5847 20.7925 77.2102 20.0801C77.8358 19.3678 78.6989 19.0116 79.7994 19.0116C80.7355 19.0116 81.5004 19.2217 82.094 19.6418C82.6922 20.0619 83.0461 20.8039 83.1557 21.8679ZM87.923 25.2653V26.7243L86.9983 26.7585C86.0759 26.7905 85.4458 26.6306 85.1078 26.279C84.8887 26.0553 84.7791 25.7105 84.7791 25.2447V20.6487H83.7379V19.2582H84.7791V17.1759H86.7107V19.2582H87.923V20.6487H86.7107V24.594C86.7107 24.9 86.7495 25.0918 86.8271 25.1694C86.9047 25.2425 87.1422 25.279 87.5395 25.279C87.5988 25.279 87.6605 25.279 87.7244 25.279C87.7929 25.2744 87.8591 25.2699 87.923 25.2653ZM99.2591 26.6558V22.1487H95.3138V26.6558H93.2246V16.5594H95.3138V20.4089H99.2591V16.5594H101.355V26.6558H99.2591ZM108.006 25.6009C107.988 25.6238 107.942 25.6923 107.869 25.8064C107.796 25.9206 107.709 26.021 107.609 26.1078C107.303 26.3818 107.006 26.569 106.718 26.6695C106.435 26.7699 106.102 26.8202 105.718 26.8202C104.613 26.8202 103.869 26.4229 103.485 25.6283C103.271 25.1899 103.163 24.5438 103.163 23.6899V19.1897H105.163V23.6899C105.163 24.1146 105.214 24.4342 105.314 24.6488C105.492 25.0278 105.842 25.2173 106.362 25.2173C107.029 25.2173 107.486 24.9479 107.732 24.4091C107.86 24.1168 107.924 23.731 107.924 23.2515V19.1897H109.903V26.6558H108.006V25.6009ZM115.308 20.635C114.646 20.635 114.191 20.9158 113.945 21.4775C113.817 21.7743 113.753 22.1533 113.753 22.6145V26.6558H111.808V19.2034H113.691V20.2925C113.942 19.9089 114.18 19.6326 114.404 19.4637C114.805 19.1623 115.315 19.0116 115.931 19.0116C116.703 19.0116 117.333 19.2148 117.822 19.6212C118.315 20.0231 118.561 20.692 118.561 21.6281V26.6558H116.561V22.1145C116.561 21.7218 116.509 21.4204 116.404 21.2103C116.212 20.8267 115.847 20.635 115.308 20.635ZM123.788 25.2653V26.7243L122.863 26.7585C121.94 26.7905 121.31 26.6306 120.972 26.279C120.753 26.0553 120.644 25.7105 120.644 25.2447V20.6487H119.602V19.2582H120.644V17.1759H122.575V19.2582H123.788V20.6487H122.575V24.594C122.575 24.9 122.614 25.0918 122.692 25.1694C122.769 25.2425 123.007 25.279 123.404 25.279C123.463 25.279 123.525 25.279 123.589 25.279C123.657 25.2744 123.724 25.2699 123.788 25.2653Z"
                  fill="#F5F5F5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M152.138 22.3402H144.788L148.463 15.6602L152.138 22.3402Z"
                  fill="#EDFFA5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.5561 19.334C28.5561 25.0523 23.9205 29.688 18.2021 29.688C12.4838 29.688 7.84814 25.0523 7.84814 19.334C7.84814 13.6156 12.4838 8.97998 18.2021 8.97998C23.9205 8.97998 28.5561 13.6156 28.5561 19.334Z"
                  fill="#F5F5F5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.4934 19.6384L16.5943 19.6385V16.5323H19.4934C20.3411 16.5323 21.0282 17.2276 21.0282 18.0853C21.0282 18.9431 20.3411 19.6384 19.4934 19.6384ZM19.4934 14.4614H14.5479V24.8154H16.5943V21.7093H19.4934C21.4713 21.7093 23.0747 20.0868 23.0747 18.0853C23.0747 16.0839 21.4713 14.4614 19.4934 14.4614Z"
                  fill="#252525"
                />
              </g>
              <defs>
                <clipPath id="clip0_60_2">
                  <rect
                    width="167"
                    height="36.072"
                    fill="white"
                    transform="translate(0.5 0.963867)"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>

          <Button
            variant="ghost"
            css={css({ width: 'auto' })}
            disabled={activeWorkspaceAuthorization === 'READ'}
            onClick={() => {
              modalOpened({ modal: 'genericCreate' });
            }}
          >
            <Icon
              name="plus"
              size={16}
              title="Create new"
              css={{ marginRight: '8px' }}
            />
            Create
          </Button>

          {showDiscover && (
            <Button
              variant="ghost"
              autoWidth
              onClick={() => {
                window.open('http://codesandbox.io/discover', '_blank');
              }}
            >
              <Icon
                name="discover"
                size={16}
                title="New"
                css={{ marginRight: '8px' }}
              />
              Discover
            </Button>
          )}

          {hasLogIn && <Notifications dashboard />}
        </Stack>
      </Stack>
    );
  }
);

const SearchInputGroup = () => {
  const { activeTeam } = useAppState();

  const history = useHistory();
  const location = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get('query') || ''
  );

  const searchType = location.pathname.includes('/discover')
    ? 'COMMUNITY'
    : 'WORKSPACE';

  const search = (queryString: string) => {
    if (searchType === 'COMMUNITY') {
      history.push(dashboardUrls.discoverSearch(queryString, activeTeam));
    } else {
      history.push(dashboardUrls.search(queryString, activeTeam));
    }
  };
  const [debouncedSearch] = useDebouncedCallback(search, 100);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (event.target.value.length >= 1) {
      debouncedSearch(event.target.value);
    }
    if (!event.target.value) {
      history.push(dashboardUrls.sandboxes('/', activeTeam));
    }
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!location.pathname.includes('search')) {
      // navigate from other places on enter
      history.push(dashboardUrls.search(query, activeTeam));
    }
    if (event.which === ENTER) event.currentTarget.blur();
  };

  return (
    <Stack
      align="center"
      css={css({
        width: 320,
        display: ['none', 'none', 'flex'],
        position: 'fixed',
        left: '288px',
      })}
    >
      <Combobox
        openOnFocus
        onSelect={() => {
          // switch to the other search
          if (searchType === 'COMMUNITY') {
            history.push(dashboardUrls.search(query, activeTeam));
          } else {
            history.push(dashboardUrls.discoverSearch(query, activeTeam));
          }
        }}
      >
        <Stack
          align="center"
          css={css({
            position: 'relative',
          })}
        >
          <Icon
            name="search"
            size={16}
            title="Search"
            className="icon"
            css={css({
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#999999',
            })}
          />
          <ComboboxInput
            as={Input}
            value={query}
            onChange={onChange}
            onKeyPress={handleEnter}
            placeholder="Search"
            icon="search"
            css={css({
              background: 'transparent',
              border: 'none',
              paddingLeft: '24px',
              color: '#999999',

              '&::placeholder': {
                color: '#999999',
                transition: 'color .3s',
              },

              '&:hover': {
                '&::placeholder': {
                  color: '#ffffff',
                },
              },

              '&:focus': {
                '&::placeholder': {
                  color: '#717171',
                },
              },
            })}
          />
          {SHOW_COMMUNITY_SEARCH && query.length >= 2 && (
            <ComboboxPopover
              css={css({
                zIndex: 4,
                fontFamily: 'Inter, sans-serif',
                fontSize: 3,
              })}
            >
              <ComboboxList
                as={List}
                css={css({
                  backgroundColor: 'menuList.background',
                  borderRadius: 3,
                  boxShadow: 2,
                  border: '1px solid',
                  borderColor: 'menuList.border',
                })}
              >
                <ComboboxOption
                  value={query}
                  justify="space-between"
                  css={css({
                    outline: 'none',
                    height: 7,
                    paddingX: 2,
                    color: 'list.foreground',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ':hover, &[aria-selected="true"]': {
                      color: 'list.hoverForeground',
                      backgroundColor: 'list.hoverBackground',
                      cursor: 'pointer',
                    },
                  })}
                >
                  <span>{query}</span>
                  <span>
                    {searchType === 'COMMUNITY' ? 'Workspace' : 'Community'} ⏎
                  </span>
                </ComboboxOption>
              </ComboboxList>
              <Text
                size={3}
                variant="muted"
                css={css({
                  position: 'absolute',
                  width: 'fit-content',
                  top: -5,
                  right: 0,
                  paddingX: 2,
                })}
              >
                {searchType === 'COMMUNITY' ? 'in community' : 'in workspace'} ⏎
              </Text>
            </ComboboxPopover>
          )}
        </Stack>
      </Combobox>
    </Stack>
  );
};
