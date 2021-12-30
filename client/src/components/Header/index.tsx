import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import variables from "../../styles/variables";
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

const Header: FC<Props> = (props) => {
  const history = useHistory();

  return (
    <HeaderContainer>
      <ContentContainer>
        <Container>
          <Row justify="end">
            <Col sm={12}>
              <EndAligner>
                <>
                  {props.links.map((link: HeaderLink) => {
                    return (
                      <LinkWrapper
                        key={link.path}
                        isSelected={link.path === window.location.pathname}
                      >
                        <StyledLink to={link.path}>{link.label}</StyledLink>
                      </LinkWrapper>
                    );
                  })}
                  {props.user && (
                    <Dropdown
                      target={
                        <Avatar
                          size="extra-small"
                          thumbnail={props.user.thumbnail}
                        />
                      }
                      items={[
                        {
                          id: 'about-user',
                          label: `${props.user.name.first} ${props.user.name.last}`,
                          onClick: () => {
                            history.push(`/profiles/${props.user?._id || ""}`)
                          }
                        },
                        {
                          id: 'sign-out',
                          label: 'Sign Out',
                          onClick: () => {
                            window.location.href = window.location.origin;
                          }
                      }]}
                    />
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

export default injectUserContext(Header);
