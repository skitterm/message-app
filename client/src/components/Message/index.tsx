import React from "react";
import styled from "styled-components";
import Avatar from "../Avatar";
import Alert from "../Alert";
import variables from "../../styles/variables";

export interface MessageProps {
  name: string;
  time: number;
  thumbnail: string;
  contents: string;
  isUnread?: boolean;
}

const Container = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 12px;
  margin-bottom: 20px;
  position: relative;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.h4`
  margin: 0 0 4px;
  font-size: ${variables.fontSize.md};
`;

const Time = styled.span`
  margin-left: 5px;
  font-style: italic;
  font-size: ${variables.fontSize.sm};
`;

const Contents = styled.p`
  margin-top: 0;
  font-size: ${variables.fontSize.md};
`;

export const Message = (props: MessageProps) => {
  const date = new Date(props.time);
  const time = date.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Container>
      {props.isUnread && <Alert size="normal" />}
      <Avatar thumbnail={props.thumbnail} />
      <div>
        <FirstRow>
          <Name>{props.name}</Name>
          <Time>{time}</Time>
        </FirstRow>
        <Contents>{props.contents}</Contents>
      </div>
    </Container>
  );
};

export default Message;
