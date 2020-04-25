import styled from "styled-components";
import variables from "../../styles/variables";

const Alert = styled.span<{ size: "small" | "normal" }>`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  transform: translate(-50%, -50%);
  height: ${(props) => (props.size === "small" ? "10px" : "20px")};
  width: ${(props) => (props.size === "small" ? "10px" : "20px")};
  border-radius: 50%;
  background-color: ${variables.color.danger};
`;

export default Alert;
