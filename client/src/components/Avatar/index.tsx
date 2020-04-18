import React, { Component } from "react";
import styled from "styled-components";

const Background = styled.div<{ color: string; size?: string }>`
  width: ${(props) => (props.size === "large" ? "100px" : "50px")};
  height: ${(props) => (props.size === "large" ? "100px" : "50px")};
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
  thumbnail: string;
  size?: "small" | "large";
}

class Avatar extends Component<Props> {
  public static defaultProps: Partial<Props> = {
    size: "small",
  };

  public render() {
    if (!this.props.thumbnail) {
      return null;
    }

    const parts = this.props.thumbnail.split(";");
    const backgroundColor = this.getValue(parts[0]);

    const shapes = parts.slice(1);

    return (
      <Background color={backgroundColor} size={this.props.size}>
        {shapes.map((shape, index) => {
          return this.renderShape(shape, index);
        })}
      </Background>
    );
  }

  private renderShape = (shape: string, index: number) => {
    const parts = shape.split(",");
    const type = this.getValue(parts[0]);
    const color = this.getValue(parts[1]);
    const smallestDimension = this.getValue(parts[2]);
    const startX = this.getValue(parts[3]);
    const startY = this.getValue(parts[4]);
    const orientation = this.getValue(parts[5]);

    const width =
      type !== "rt" || orientation === "v"
        ? smallestDimension
        : `${parseInt(smallestDimension.split("%")[0], 10) * 3}%`;
    const height =
      type !== "rt" || orientation === "h"
        ? smallestDimension
        : `${parseInt(smallestDimension.split("%")[0], 10) * 3}%`;

    return (
      <Shape
        key={index}
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
