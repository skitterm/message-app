import React from "react";

export interface MessageProps {
  name: string;
  time: number;
  thumbnail: string;
  contents: string;
}

export const Message = (props: MessageProps) => {
  const time = new Date(props.time).toLocaleString();

  const styles = {
    container: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "20px"
    },
    thumbnail: {
      width: "50px",
      height: "auto",
      paddingRight: "10px"
    },
    firstRow: {
      display: "flex",
      alignItems: "center"
    },
    name: {
      margin: "0 0 4px"
    },
    time: {
      marginLeft: "5px",
      fontStyle: "italic",
      fontSize: "12px"
    },
    contents: {
      marginTop: "0"
    }
  };

  return (
    <li style={styles.container}>
      <img
        src={`/temp_images/${props.thumbnail}`}
        alt={`Thumbnail for ${props.name}`}
        style={styles.thumbnail}
      />
      <div>
        <div style={styles.firstRow}>
          <h4 style={styles.name}>{props.name}</h4>
          <span style={styles.time}>{time}</span>
        </div>
        <p style={styles.contents}>Message: {props.contents}</p>
      </div>
    </li>
  );
};

export default Message;
