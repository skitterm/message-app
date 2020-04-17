import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import ContentContainer from "../ContentContainer";
import variables from "../../styles/variables";

interface Props {
  path: string;
  label: string;
}

const StyledLink = styled(Link)`
  display: block;
  text-align: end;
  text-decoration: none;
  font-size: ${variables.fontSize.md};
`;

const HeaderContainer = styled.header`
  padding: 20px 0;
  border-bottom: 2px solid ${variables.color.offWhite};
`;

class Header extends Component<Props> {
  public render() {
    return (
      <HeaderContainer>
        <ContentContainer>
          <Container>
            <Row justify="end">
              <Col sm={4}>
                <StyledLink to={this.props.path}>{this.props.label}</StyledLink>
              </Col>
            </Row>
          </Container>
        </ContentContainer>
      </HeaderContainer>
    );
  }
}

export default Header;
