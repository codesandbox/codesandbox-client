import React from 'react';
import { useTheme } from '../../components/layout';

const ProjectView = props => {
  const { white, grey, whiteDark, greyLight } = useTheme().homepage;

  const getFill = () => {
    if (props.light) {
      return props.active ? greyLight : whiteDark;
    }
    return props.active ? white : grey;
  };

  return (
    <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
      <mask
        id="mask0"
        width={32}
        height={32}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
      >
        <rect width={32} height={32} fill={whiteDark} rx={4} />
      </mask>
      <g mask="url(#mask0)">
        <rect width={32} height={32} fill={getFill(props)} rx={4} />
        <mask id="path-3-inside-1" fill={white}>
          <path
            fillRule="evenodd"
            d="M17.621 7h-5.848a.773.773 0 00-.773.773v15.454c0 .427.346.773.773.773h10.303a.773.773 0 00.773-.773V12.532L17.62 7zm-.697.988l5.41 5.41h-5.41v-5.41z"
            clipRule="evenodd"
          />
        </mask>
        <path
          fill={props.light && props.active ? white : greyLight}
          fillRule="evenodd"
          d="M17.621 7h-5.848a.773.773 0 00-.773.773v15.454c0 .427.346.773.773.773h10.303a.773.773 0 00.773-.773V12.532L17.62 7zm-.697.988l5.41 5.41h-5.41v-5.41z"
          clipRule="evenodd"
        />
        <path
          fill={props.light && props.active ? white : greyLight}
          d="M17.621 7l.562-.53-.229-.243h-.333V7zm5.228 5.532h.772v-.308l-.21-.223-.563.53zm-.516.865v.773H24.2l-1.32-1.319-.546.546zm-5.409-5.409l.547-.546-1.32-1.32v1.866h.773zm0 5.41h-.773v.772h.773v-.773zm-5.151-5.625h5.848V6.227h-5.848v1.546zm0 0V6.227c-.854 0-1.546.692-1.546 1.546h1.546zm0 15.454V7.773h-1.546v15.454h1.546zm0 0h-1.546c0 .854.692 1.546 1.546 1.546v-1.546zm10.303 0H11.773v1.546h10.303v-1.546zm0 0v1.546c.853 0 1.545-.692 1.545-1.546h-1.545zm0-10.695v10.695h1.545V12.532h-1.545zM17.06 7.53l5.227 5.532L23.41 12l-5.227-5.532-1.123 1.062zm5.82 5.32l-5.41-5.41-1.092 1.094 5.409 5.409 1.093-1.093zm-5.956 1.32h5.41v-1.546h-5.41v1.545zm-.773-6.183v5.41h1.546v-5.41H16.15z"
          mask="url(#path-3-inside-1)"
        />
      </g>
    </svg>
  );
};

export default ProjectView;
