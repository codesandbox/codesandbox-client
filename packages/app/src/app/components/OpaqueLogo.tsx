import React from 'react';

interface IOpagueLogoProps extends React.SVGAttributes<SVGElement> {
  width: number;
  height: number;
}

export const OpaqueLogo: React.FC<IOpagueLogoProps> = ({
  width = 35,
  height = 35,
  ...props
}) => (
  <svg
    x="0px"
    y="0px"
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 747 833"
    {...props}
  >
    <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g id="Artboard">
        <g id="Logo" transform="translate(40.000000, 46.000000)">
          <g id="Layer_1">
            <polygon
              id="Shape"
              stroke="#FFFFFF"
              strokeWidth={80}
              fill="#24282A"
              points="0 556.355883 333.160828 740.381929 666.463493 555.739612 666.463493 185.703126 333.231747 0 0 186.524821"
            />
            <polyline
              id="Shape"
              fill="#FFFFFF"
              fillRule="nonzero"
              points="515.246464 648.658551 515.246464 475.155956 671.608198 388.018462 671.608198 561.778247 515.246464 648.658551"
            />
            <polyline
              id="Shape"
              fill="#FFFFFF"
              fillRule="nonzero"
              points="159.72664 477.832217 6 392.126938 6 563.537497 159.72664 649.677453 159.72664 477.832217"
            />
            <polyline
              id="Shape"
              fill="#FFFFFF"
              fillRule="nonzero"
              points="338.843831 175.85264 495.169679 88.6198293 338.910477 1 182.014717 88.9107094 338.843831 175.85264"
            />
          </g>
          <g
            id="Layer_2"
            transform="translate(1.000000, 185.000000)"
            strokeWidth={80}
            stroke="#FFFFFF"
          >
            <polyline
              id="Shape"
              points="663.754613 0.703126 330.522866 185.72178 330.522866 555.484641"
            />
            <path d="M0.70888075,1.524821 L333.370716,185.584557" id="Shape" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
