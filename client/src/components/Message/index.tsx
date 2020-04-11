import React from "react";
import styled from "styled-components";

export interface MessageProps {
  name: string;
  time: number;
  thumbnail: string;
  contents: string;
}

const Container = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Thumbnail = styled.img`
  width: 50px;
  height: auto;
  padding-right: 10px;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.h4`
  margin: 0 0 4px;
`;

const Time = styled.span`
  margin-left: 5px;
  font-style: italic;
  font-size: 12px;
`;

const Contents = styled.p`
  margin-top: 0;
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
      <Thumbnail
        src={`/temp_images/${props.thumbnail}`}
        alt={`Thumbnail for ${props.name}`}
      />
      <div>
        <FirstRow>
          <Name>{props.name}</Name>
          <Time>{time}</Time>
        </FirstRow>
        <Contents>Message: {props.contents}</Contents>
      </div>
    </Container>
  );
};

export default Message;
