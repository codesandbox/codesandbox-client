import Slider from 'rc-slider/lib/Slider';
import React from 'react';

import 'rc-slider/assets/index.css';

const Range = props => (
  <Slider
    railStyle={{ background: 'rgba(0, 0, 0, 0.3)', height: 12 }}
    trackStyle={{
      background: props.color,
      height: 12,
      transition: '0.3s ease background-color',
    }}
    handleStyle={{
      background: '#FFFFFF',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
      height: 20,
      width: 20,
    }}
    {...props}
  />
);

export default Range;
