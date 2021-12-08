import React from "react";
import styled from "styled-components";

import { Title } from "./LayoutComponents";
import { Description } from "./Typography";
import Button from "./Button";

const CTA = styled.div`
  text-align: center;
  margin: 16rem auto;
`;

export default ({ link, title, subtitle, cta }) => (
  <CTA>
    <Title as="h2">{title}</Title>
    <Description
      as="h3"
      css={`
        margin-bottom: 30px;
      `}
    >
      {subtitle}
    </Description>
    <Button big title={cta} href={link}>
      {cta}
    </Button>
  </CTA>
);
