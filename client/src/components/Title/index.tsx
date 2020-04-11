import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledTitle = styled.h1`
  text-align: start;
`;

const Title = (props: { children: ReactNode }) => {
  return <StyledTitle>{props.children}</StyledTitle>;
};

export default Title;
