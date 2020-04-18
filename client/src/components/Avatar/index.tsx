import React, { Component } from "react";
import styled from "styled-components";

const Background = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;
  background-color: ${(props) => props.color};
`;

const Shape = styled.div<{
  color: string;
  startX: string;
  startY: string;
  shapeWidth: string;
  shapeHeight: string;
  isCircle: boolean;
}>`
  position: absolute;
  top: ${(props) => props.startY};
  left: ${(props) => props.startX};
  height: ${(props) => props.shapeHeight};
  width: ${(props) => props.shapeWidth};
  background-color: ${(props) => props.color};
  border-radius: ${(props) => (props.isCircle ? "50%" : "none")};
`;

interface Props {
  // thumbnail?: string;
}

class Avatar extends Component<Props> {
  public render() {
    const thumbnail =
      "bc=#00FF00;st=sq,sbc=#FF0000,sld=30%,ssx=10%,ssy=10%,or=v;" +
      "st=rt,sbc=#0F0000,sld=60%,ssx=30%,ssy=60%,or=h;" +
      "st=cr,sbc=#0000FF,sld=30%,ssx=70%,ssy=20%,or=h";

    const parts = thumbnail.split(";");
    const backgroundColor = this.getValue(parts[0]);

    const shapes = parts.slice(1);

    return (
      <Background color={backgroundColor}>
        {shapes.map((shape) => {
          return this.renderShape(shape);
        })}
      </Background>
    );
  }

  private renderShape = (shape: string) => {
    const parts = shape.split(",");
    const type = this.getValue(parts[0]);
    const color = this.getValue(parts[1]);
    const largestDimension = this.getValue(parts[2]);
    const startX = this.getValue(parts[3]);
    const startY = this.getValue(parts[4]);
    const orientation = this.getValue(parts[5]);

    const width =
      type !== "rt" || orientation === "h"
        ? largestDimension
        : `${parseInt(largestDimension.split("%")[0], 10) / 3}%`;
    const height =
      type !== "rt" || orientation === "v"
        ? largestDimension
        : `${parseInt(largestDimension.split("%")[0], 10) / 3}%`;

    return (
      <Shape
        color={color}
        startX={startX}
        startY={startY}
        shapeWidth={width}
        shapeHeight={height}
        isCircle={type === "cr"}
      />
    );
  };

  private getValue = (entry: string) => {
    return entry.split("=")[1];
  };
}

export default Avatar;
