import styled from 'styled-components';
import Padding from 'common/lib/components/spacing/Padding';
import Margin from 'common/lib/components/spacing/Margin';

export const Top = styled.div`
  display: flex;
  background-image: linear-gradient(-180deg, #121415 0%, #1f2224 100%);
  box-shadow: inset 0 -3px 4px 0 rgba(0, 0, 0, 0.5);

  width: 100%;
  justify-content: center;
`;

export const FullWidthPadding = styled(Padding)`
  width: 100%;
`;

export const FullWidthMargin = styled(Margin)`
  width: 100%;
`;
