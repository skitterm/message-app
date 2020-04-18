import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import ContentContainer from "../ContentContainer";
import variables from "../../styles/variables";

interface HeaderLink {
  path: string;
  label: string;
}

interface Props {
  links: HeaderLink[];
}

const StyledLink = styled(Link)`
  text-align: end;
  text-decoration: none;
  font-size: ${variables.fontSize.md};
`;

const HeaderContainer = styled.header`
  padding: 20px 0;
  border-bottom: 2px solid ${variables.color.offWhite};
`;

const EndAligner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: 1fr;
  justify-content: end;
  grid-column-gap: 60px;
`;

class Header extends Component<Props> {
  public render() {
    return (
      <HeaderContainer>
        <ContentContainer>
          <Container>
            <Row justify="end">
              <Col sm={12}>
                <EndAligner>
                  {this.props.links.map((link: HeaderLink) => {
                    return (
                      <StyledLink key={link.path} to={link.path}>
                        {link.label}
                      </StyledLink>
                    );
                  })}
                </EndAligner>
              </Col>
            </Row>
          </Container>
        </ContentContainer>
      </HeaderContainer>
    );
  }
}

export default Header;
