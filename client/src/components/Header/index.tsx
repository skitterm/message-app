import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import variables from "../../styles/variables";
import { signOutUser } from "../../utils/userHelper";
import { injectUserContext, UserContextProps } from "../../context/UserContext";
import ContentContainer from "../ContentContainer";
import Avatar from "../Avatar";
import Dropdown from "../Dropdown";

interface HeaderLink {
  path: string;
  label: string;
}

interface Props extends UserContextProps {
  links: HeaderLink[];
}

const LinkWrapper = styled.div<{ isSelected: boolean }>`
  padding: 5px 0;
  border-bottom: 2px solid transparent;
  border-bottom-color: ${(props) =>
    props.isSelected ? variables.color.accent : "transparent"};
`;

const styles = `
  text-align: end;
  text-decoration: none;
  font-size: ${variables.fontSize.md};  
`;

const StyledLink = styled(Link)`
  ${styles}
`;
const StyledButton = styled.button`
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: none;
  padding: 0;
  font-family: "Lato", sans-serif;
  cursor: pointer;
  ${styles}
`;

const HeaderContainer = styled.header`
  padding: 15px 0;
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
                        <LinkWrapper
                          key={link.path}
                          isSelected={link.path === window.location.pathname}
                        >
                          <StyledLink to={link.path}>{link.label}</StyledLink>
                        </LinkWrapper>
                      );
                    })}
                    {this.props.user && (
                      <>
                        <Dropdown
                          target={
                            <Avatar
                              size="extra-small"
                              thumbnail={this.props.user.thumbnail}
                            />
                          }
                        />
                        <LinkWrapper isSelected={false}>
                          <StyledButton onClick={signOutUser}>
                            Sign Out
                          </StyledButton>
                        </LinkWrapper>
                      </>
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
