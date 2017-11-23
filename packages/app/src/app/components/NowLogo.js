import React from 'react';
import IconBase from 'react-icons/IconBase';

export default ({
  className,
  backgroundColor,
}: {
  className: string,
  backgroundColor: boolean,
}) => (
  <IconBase className={className} viewBox="0 0 128 116">
    <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g
        id="Artboard"
        transform="translate(-207.000000, -165.000000)"
        stroke="#FFFFFF"
      >
        <g id="Now" transform="translate(213.000000, 172.000000)">
          <polygon
            id="Shape"
            strokeWidth="6.5625"
            fill={backgroundColor || 'none'}
            points="57.9945629 0.153039832 115.989126 104.991614 0 104.991614"
          />
          <path
            d="M110.776596,103.653846 L56.0106384,4.03846154"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M113.265957,103.653846 L58.5,4.03846154"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M108.287234,103.653846 L56.0106384,6.73076923"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M105.797872,103.653846 L56.0106384,9.42307692"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M53.5212766,9.42307692 L108.287234,103.653846"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M103.30851,103.653846 L53.5212766,12.1153846"
            id="Shape"
            strokeWidth="5.83333333"
          />
          <path
            d="M93.351064,82.1153845 L73.4361703,47.1153847"
            id="Shape"
            strokeWidth="5.83333333"
          />
        </g>
      </g>
    </g>
  </IconBase>
);
