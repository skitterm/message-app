import React, { ReactNode } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";

const StyledTitle = styled.h1`
  text-align: start;
  font-size: ${variables.fontSize.display};
`;

const Title = (props: { children: ReactNode }) => {
  return <StyledTitle>{props.children}</StyledTitle>;
};

export default Title;
