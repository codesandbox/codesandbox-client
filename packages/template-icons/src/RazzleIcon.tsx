import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const RazzleIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <mask
        id={`Razzle_Mask0_${id}`}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="0"
        width="26"
        height="32"
      >
        <path
          d="M3 32V0H18.5429C19.2167 0 19.9216 0.111543 20.6585 0.333714C21.3945 0.555886 22.0199 0.853029 22.5346 1.22697C22.712 1.36869 22.9424 1.56526 23.2267 1.81303L24.0514 2.66697L24.8231 3.49349C25.0718 3.76046 25.2665 3.98263 25.4082 4.16C25.7639 4.64 26.0208 5.19954 26.1808 5.84046C26.3399 6.48046 26.4203 7.09303 26.4203 7.68V12.213C26.4203 13.5296 26.0821 14.6843 25.4082 15.68C25.2454 15.9252 25.0632 16.157 24.8633 16.373C24.6238 16.64 24.3623 16.9152 24.0779 17.1995C23.7945 17.4848 23.5111 17.7509 23.2267 17.9995C22.9433 18.2491 22.712 18.4357 22.5346 18.56C22.3216 18.7374 22.1086 18.88 21.8955 18.987L21.2574 19.307L22.2951 21.227L23.4389 23.3335L24.6101 25.44L25.7017 27.467L28.1767 32H20.9374L14.6032 19.787H9.49417V32H3ZM9.49417 13.547H18.5419C18.5785 13.547 18.6581 13.5067 18.7815 13.4263C18.9058 13.3467 19.0393 13.2398 19.181 13.1063C19.3227 12.9737 19.4608 12.8357 19.5934 12.693C19.7269 12.5513 19.8375 12.4096 19.9262 12.267V7.52C19.7515 7.26856 19.5508 7.03626 19.3273 6.82697C19.0943 6.59588 18.8303 6.39833 18.5429 6.24H9.49417V13.547Z"
          fill="white"
        />
      </mask>
      <g mask={`url(#Razzle_Mask0_${id})`}>
        <path
          d="M3 32V0H18.5429C19.2167 0 19.9216 0.111543 20.6585 0.333714C21.3945 0.555886 22.0199 0.853029 22.5346 1.22697C22.712 1.36869 22.9424 1.56526 23.2267 1.81303L24.0514 2.66697L24.8231 3.49349C25.0718 3.76046 25.2665 3.98263 25.4082 4.16C25.7639 4.64 26.0208 5.19954 26.1808 5.84046C26.3399 6.48046 26.4203 7.09303 26.4203 7.68V12.213C26.4203 13.5296 26.0821 14.6843 25.4082 15.68C25.2454 15.9252 25.0632 16.157 24.8633 16.373C24.6238 16.64 24.3623 16.9152 24.0779 17.1995C23.7945 17.4848 23.5111 17.7509 23.2267 17.9995C22.9433 18.2491 22.712 18.4357 22.5346 18.56C22.3216 18.7374 22.1086 18.88 21.8955 18.987L21.2574 19.307L22.2951 21.227L23.4389 23.3335L24.6101 25.44L25.7017 27.467L28.1767 32H20.9374L14.6032 19.787H9.49417V32H3ZM9.49417 13.547H18.5419C18.5785 13.547 18.6581 13.5067 18.7815 13.4263C18.9058 13.3467 19.0393 13.2398 19.181 13.1063C19.3227 12.9737 19.4608 12.8357 19.5934 12.693C19.7269 12.5513 19.8375 12.4096 19.9262 12.267V7.52C19.7515 7.26856 19.5508 7.03626 19.3273 6.82697C19.0943 6.59588 18.8303 6.39833 18.5429 6.24H9.49417V13.547Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-76.6389 -59.8866L205.295 102.887L201 110.327L-80.9342 -52.4471L-76.6389 -59.8866Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-80.9338 -52.4473L201 110.327L196.704 117.767L-85.2291 -45.0076L-80.9338 -52.4473Z"
          fill={`url(#Razzle_Paint0_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-85.2295 -45.0076L196.704 117.766L192.409 125.207L-89.5257 -37.568L-85.2295 -45.0076ZM-93.8201 -30.1294L188.114 132.645L183.818 140.085L-98.1154 -22.6898L-93.8201 -30.1294Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-98.115 -22.6896L183.819 140.085L179.523 147.525L-102.41 -15.2499L-98.115 -22.6896Z"
          fill={`url(#Razzle_Paint1_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-96.9303 -44.9655L185.003 117.809L180.708 125.249L-101.226 -37.5258L-96.9303 -44.9655Z"
          fill={`url(#Razzle_Paint2_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-102.41 -15.2503L179.523 147.525L175.229 154.964L-106.705 -7.81076L-102.41 -15.2503Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.32892 -106.95L288.263 55.8245L283.967 63.264L2.0336 -99.5109L6.32892 -106.95Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.03413 -99.5103L283.968 63.2641L279.672 70.7038L-2.26119 -92.0706L2.03413 -99.5103Z"
          fill={`url(#Razzle_Paint3_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-2.2608 -92.0713L279.672 70.7035L275.378 78.1431L-6.55611 -84.6318L-2.2608 -92.0713Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-10.8514 -77.1922L271.082 85.5826L266.787 93.0222L-15.1467 -69.7518L-10.8514 -77.1922Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-15.1469 -69.7522L266.787 93.0222L262.492 100.461L-19.4418 -62.3133L-15.1469 -69.7522ZM-6.55631 -84.6316L275.377 78.1428L271.082 85.5825L-10.8516 -77.1919L-6.55631 -84.6316Z"
          fill={`url(#Razzle_Paint4_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-19.4421 -62.3131L262.493 100.462L258.197 107.9L-23.7374 -54.8736L-19.4421 -62.3131Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-6.35955 -50.4768L299.556 60.8676L296.618 68.9408L-9.29806 -42.4046L-6.35955 -50.4768Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-9.2978 -42.4038L296.618 68.9404L293.68 77.013L-12.236 -34.3313L-9.2978 -42.4038Z"
          fill={`url(#Razzle_Paint5_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-12.2357 -34.3315L293.679 77.0121L290.741 85.0852L-15.1742 -26.2601L-12.2357 -34.3315Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-18.1118 -18.187L287.804 93.1575L284.865 101.231L-21.0503 -10.1157L-18.1118 -18.187Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-21.0503 -10.1146L284.866 101.23L281.928 109.301L-23.9882 -2.04288L-21.0503 -10.1146ZM-15.174 -26.2597L290.742 85.0846L287.804 93.1571L-18.1121 -18.1871L-15.174 -26.2597Z"
          fill={`url(#Razzle_Paint6_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-23.9879 -2.04251L281.928 109.302L278.989 117.374L-26.9264 6.02972L-23.9879 -2.04251Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-54.2251 86.325L11.6601 -27.7906L16.9392 -24.7424L-48.9461 89.3732L-54.2251 86.325Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-48.9456 89.373L16.9392 -24.7428L22.2181 -21.695L-43.6667 92.4208L-48.9456 89.373Z"
          fill={`url(#Razzle_Paint7_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-43.667 92.4206L22.2174 -21.6951L27.4964 -18.6469L-38.3879 95.4688L-43.667 92.4206Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-36.1131 103.303L35.4873 -20.7104L41.2418 -17.3888L-30.3586 106.626L-36.1131 103.303Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-27.5245 101.718L38.4092 -12.4823L43.7079 -9.42311L-22.2263 104.778L-27.5245 101.718Z"
          fill={`url(#Razzle_Paint8_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-41.6954 100.508L29.9046 -23.5073L35.6593 -20.1848L-35.9407 103.83L-41.6954 100.508Z"
          fill={`url(#Razzle_Paint9_Linear_${id})`}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-22.2251 104.777L43.7067 -9.42081L49.0059 -6.36161L-16.9278 107.838L-22.2251 104.777Z"
          fill="black"
        />
      </g>
      <defs>
        <linearGradient
          id={`Razzle_Paint0_Linear_${id}`}
          x1="-82.3433"
          y1="-48.3261"
          x2="202.41"
          y2="116.076"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint1_Linear_${id}`}
          x1="-99.5245"
          y1="-18.5684"
          x2="185.228"
          y2="145.834"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint2_Linear_${id}`}
          x1="186.413"
          y1="123.558"
          x2="-98.3399"
          y2="-40.8443"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint3_Linear_${id}`}
          x1="0.624596"
          y1="-95.3891"
          x2="285.377"
          y2="69.013"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint4_Linear_${id}`}
          x1="-12.2395"
          y1="-73.1083"
          x2="272.513"
          y2="91.2939"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint5_Linear_${id}`}
          x1="-9.97028"
          y1="-38.1005"
          x2="299.005"
          y2="74.3572"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint6_Linear_${id}`}
          x1="-18.7698"
          y1="-13.9246"
          x2="290.205"
          y2="98.5331"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint7_Linear_${id}`}
          x1="-46.1493"
          y1="90.5949"
          x2="20.3943"
          y2="-24.6621"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint8_Linear_${id}`}
          x1="-24.7187"
          y1="102.946"
          x2="41.8748"
          y2="-12.397"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
        <linearGradient
          id={`Razzle_Paint9_Linear_${id}`}
          x1="-38.6477"
          y1="101.841"
          x2="33.6683"
          y2="-23.4144"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3023AE" />
          <stop offset="0.70741" stopColor="#53A0FD" />
          <stop offset="1" stopColor="#B4EC51" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};
