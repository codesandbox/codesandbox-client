import React from 'react';
import IconBase from 'react-icons/lib/IconBase';
import Tooltip from 'common/components/Tooltip';
import getIcon from 'common/templates/icons';
import getDefinition from 'common/templates/';
import Color from 'color';

export default ({ style, sandboxesNumber, template }) => {
  const templateInfo = getDefinition(template);
  const color = templateInfo.color();
  const lighter = Color(color)
    .lighten(0.2)
    .rgb();

  return sandboxesNumber >= 50 ? (
    <Tooltip
      style={{ display: 'flex', position: 'relative' }}
      title={`${sandboxesNumber < 100 ? 'Silver' : 'Gold'} medal for ${
        templateInfo.niceName
      }`}
    >
      <IconBase
        style={style}
        width="1em"
        height="0.67em"
        viewBox="0 0 204 320"
        fill="none"
      >
        <path d="M162.478 320V182H102v104.895L162.478 320z" fill={color} />
        <path
          d="M41.522 319.628V182H102v105.639l-60.478 31.989z"
          fill={`rgb(${lighter.r},${lighter.g},${lighter.b})`}
        />
        <circle
          cx={102}
          cy="102.355"
          r={102}
          transform="rotate(180 102 102.355)"
          fill={sandboxesNumber < 100 ? '#EBEBEB' : '#EAC17A'}
        />
        <circle
          cx={102}
          cy="102.355"
          r="92.7273"
          transform="rotate(180 102 102.355)"
          fill={sandboxesNumber < 100 ? '#C8C8C8' : '#CFAE72'}
        />
      </IconBase>
      <div
        css={`
          max-width: 30%;
          left: 50%;
          position: absolute;
          top: 6px;
          transform: translateX(-50%);

          svg,
          img {
            max-width: 100%;
            filter: grayscale(0.7);
            height: auto;
          }
        `}
      >
        {getIcon(template)({})}
      </div>
    </Tooltip>
  ) : null;
};
