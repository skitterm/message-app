import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import variables from "../../styles/variables";
import { signOutUser } from "../../utils/userHelper";
import { injectUserContext, UserContextProps } from "../../context/UserContext";
import ContentContainer from "../ContentContainer";

interface HeaderLink {
  path: string;
  label: string;
}

interface Props extends UserContextProps {
  links: HeaderLink[];
}

const styles = `
  text-align: end;
  text-decoration: none;
  font-size: ${variables.fontSize.md};
`;

const StyledLink = styled(Link)`
  ${styles}
`;
const StyledButton = styled.button`
  ${styles}
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: none;
  padding: 0;
  font-family: "Lato", sans-serif;
  cursor: pointer;
`;

const HeaderContainer = styled.header`
  padding: 20px 0;
  border-bottom: 2px solid ${variables.color.offWhite};
`;

const EndAligner = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
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
                  <>
                    {this.props.links.map((link: HeaderLink) => {
                      return (
                        <StyledLink key={link.path} to={link.path}>
                          {link.label}
                        </StyledLink>
                      );
                    })}
                    {this.props.user && (
                      <StyledButton onClick={signOutUser}>
                        Sign Out
                      </StyledButton>
                    )}
                  </>
                </EndAligner>
              </Col>
            </Row>
          </Container>
        </ContentContainer>
      </HeaderContainer>
    );
  }
}

export default injectUserContext(Header);
