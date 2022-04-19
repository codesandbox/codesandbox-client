import React, { FunctionComponent, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const AmexIcon: FunctionComponent<IconProps> = props => (
  <svg width={58} height={38} fill="none" viewBox="0 0 58 38" {...props}>
    <filter
      id="a"
      width={58}
      height={40}
      x={0}
      y={0}
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={2} />
      <feGaussianBlur stdDeviation={2} />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
    <clipPath id="b">
      <path d="M0 0h58v38H0z" />
    </clipPath>
    <g
      fillRule="evenodd"
      clipPath="url(#b)"
      clipRule="evenodd"
      filter="url(#a)"
    >
      <path
        fill="#6cc7f6"
        d="M8 2a4 4 0 00-4 4v24a4 4 0 004 4h42a4 4 0 004-4V6a4 4 0 00-4-4z"
      />
      <path
        fill="#fff"
        d="M19.452 23.115h-2.07l-.822-2.271h-3.765l-.777 2.271H10l3.669-10h2.011zM15.95 19.16l-1.298-3.71-1.272 3.71zm4.485 3.956v-10h2.846l1.71 6.822 1.69-6.822h2.852v10h-1.767v-7.871l-1.87 7.871h-1.83l-1.864-7.871v7.871zm10.987 0v-10h6.985v1.692h-5.083v2.217h4.73v1.685h-4.73v2.721h5.263v1.685zm7.82 0l3.22-5.218-2.918-4.782h2.223l1.89 3.213 1.85-3.213h2.204l-2.93 4.857L48 23.115h-2.294l-2.088-3.458-2.095 3.458z"
      />
    </g>
  </svg>
);

export const MasterCardIcon: FunctionComponent<IconProps> = props => (
  <svg width={58} height={38} fill="none" viewBox="0 0 58 38" {...props}>
    <filter
      id="a"
      width={58}
      height={40}
      x={0}
      y={0}
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={2} />
      <feGaussianBlur stdDeviation={2} />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
    <clipPath id="b">
      <path d="M0 0h58v38H0z" />
    </clipPath>
    <g
      fillRule="evenodd"
      clipPath="url(#b)"
      clipRule="evenodd"
      filter="url(#a)"
    >
      <path
        fill="#535bcf"
        d="M8 2a4 4 0 00-4 4v24a4 4 0 004 4h42a4 4 0 004-4V6a4 4 0 00-4-4z"
      />
      <path
        fill="#eb455a"
        d="M22 28c5.523 0 10-4.477 10-10S27.523 8 22 8s-10 4.477-10 10 4.477 10 10 10z"
      />
      <path
        fill="#f69935"
        d="M36 28c5.523 0 10-4.477 10-10S41.523 8 36 8s-10 4.477-10 10 4.477 10 10 10z"
      />
      <path
        fill="#ff8150"
        d="M29 10.859c-1.851 1.814-3 4.344-3 7.141s1.149 5.327 3 7.141c1.851-1.814 3-4.344 3-7.141s-1.149-5.327-3-7.141z"
      />
    </g>
  </svg>
);

export const VisaIcon: FunctionComponent<IconProps> = props => (
  <svg width={58} height={38} fill="none" viewBox="0 0 58 38" {...props}>
    <filter
      id="a"
      width={60}
      height={42}
      x={-1}
      y={-1}
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={2} />
      <feGaussianBlur stdDeviation={2.5} />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
    <clipPath id="b">
      <path d="M0 0h58v38H0z" />
    </clipPath>
    <g
      fillRule="evenodd"
      clipPath="url(#b)"
      clipRule="evenodd"
      filter="url(#a)"
    >
      <path
        fill="#f7f7f7"
        d="M8 2a4 4 0 00-4 4v24a4 4 0 004 4h42a4 4 0 004-4V6a4 4 0 00-4-4z"
      />
      <path fill="#535bcf" d="M8 2a4 4 0 00-4 4v2h50V6a4 4 0 00-4-4z" />
      <path fill="#f69935" d="M4 28v2a4 4 0 004 4h42a4 4 0 004-4v-2z" />
      <g fill="#535bcf">
        <path d="M18.314 21.373c.343-.933.583-1.531.725-1.794L21.887 14h2.084l-4.932 9.269h-2.202L16 14h1.945l.336 5.58c.017.189.026.471.026.842-.01.436-.022.753-.04.951zM23.596 23.269L25.653 14h2.012l-2.058 9.269zM33.782 20.664c0 .885-.326 1.582-.975 2.095-.651.514-1.533.77-2.644.77-.973 0-1.754-.19-2.348-.57v-1.737c.848.456 1.636.684 2.361.684.491 0 .877-.088 1.154-.269.277-.18.415-.424.415-.738 0-.181-.03-.341-.089-.48a1.396 1.396 0 00-.254-.383c-.11-.119-.382-.333-.818-.647-.606-.42-1.033-.832-1.279-1.243a2.518 2.518 0 01-.37-1.325c0-.546.135-1.032.409-1.462.272-.428.659-.762 1.164-1.001.503-.239 1.08-.358 1.737-.358.953 0 1.827.21 2.618.627l-.719 1.477c-.685-.312-1.318-.469-1.899-.469-.366 0-.664.095-.896.286a.924.924 0 00-.35.754c0 .259.073.484.218.676.146.192.47.447.976.763.53.339.93.712 1.193 1.12.264.41.396.885.396 1.43zM40.086 21.1h-3.118l-1.135 2.207h-2.11L38.774 14h2.46l.969 9.307h-1.958zm-.1-1.648l-.17-2.218a19.925 19.925 0 01-.067-1.604v-.228a17.417 17.417 0 01-.719 1.61l-1.24 2.44z" />
      </g>
    </g>
  </svg>
);

export const BlankIcon: FunctionComponent<IconProps> = props => (
  <svg width={58} height={38} fill="none" viewBox="0 0 58 38" {...props}>
    <filter
      id="a"
      width={58}
      height={40}
      x={0}
      y={0}
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={2} />
      <feGaussianBlur stdDeviation={2} />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
    <clipPath id="b">
      <path d="M0 0h58v38H0z" />
    </clipPath>
    <g clipPath="url(#b)" filter="url(#a)">
      <path
        fill="#e6e6e6"
        fillRule="evenodd"
        d="M8 2a4 4 0 00-4 4v24a4 4 0 004 4h42a4 4 0 004-4V6a4 4 0 00-4-4z"
        clipRule="evenodd"
      />
      <path
        fill="#999"
        fillRule="evenodd"
        d="M4 10v6h50v-6z"
        clipRule="evenodd"
      />
      <path
        stroke="#999"
        strokeLinecap="square"
        strokeWidth={2}
        d="M11 23h14M11 27h8"
      />
      <path
        fill="#999"
        fillRule="evenodd"
        d="M40 22v6h8v-6z"
        clipRule="evenodd"
      />
    </g>
  </svg>
);

export const DiscoverIcon: FunctionComponent<IconProps> = props => (
  <svg width={58} height={38} fill="none" viewBox="0 0 58 38" {...props}>
    <filter
      id="a"
      width={58}
      height={41.684}
      x={0}
      y={0}
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={2} />
      <feGaussianBlur stdDeviation={2} />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
    <clipPath id="b">
      <path d="M0 0h58v38H0z" />
    </clipPath>
    <g
      fillRule="evenodd"
      clipPath="url(#b)"
      clipRule="evenodd"
      filter="url(#a)"
    >
      <path
        fill="#fff0c5"
        d="M8 2C5.79 2 4 3.885 4 6.21v25.264c0 2.325 1.79 4.21 4 4.21h42c2.21 0 4-1.885 4-4.21V6.21C54 3.885 52.21 2 50 2z"
      />
      <path
        fill="#f69935"
        d="M26.785 35.684H50c2.21 0 4-1.885 4-4.21V17.597c-4.105 8.22-14.2 14.867-27.215 18.087zM29 25.158c3.866 0 7-3.3 7-7.369s-3.134-7.368-7-7.368-7 3.299-7 7.368c0 4.07 3.134 7.369 7 7.369z"
      />
      <path
        fill="#fa9a06"
        d="M33.576 12.213c-1.227-1.116-2.827-1.792-4.576-1.792-3.866 0-7 3.299-7 7.368 0 2.322 1.02 4.393 2.614 5.743 1.31-4.985 4.62-9.096 8.962-11.319z"
      />
    </g>
  </svg>
);
