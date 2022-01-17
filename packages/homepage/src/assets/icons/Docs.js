import React from "react";
// eslint-disable-next-line import/no-cycle
import { useTheme } from "../../components/layout";

const Docs = (props) => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 16H31.1504L41 25.6602V54H11V16ZM15 20V50H37V27.3398L29.5163 20H15Z"
        fill="url(#paint0_linear_20_19)"
      />
      <path d="M21 10H37.6667L46 18.5V44H21V10Z" fill="#151515" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19 8V46H48V17.6831L38.5067 8H19ZM34 12H23V42H44V22H34V12ZM42.709 18H38V13.1969L42.709 18Z"
        fill={white}
      />
      <defs>
        <linearGradient
          id="paint0_linear_20_19"
          x1="19"
          y1="46.5"
          x2="41"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={white} />
          <stop offset="1" stop-color={white} stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Docs;
