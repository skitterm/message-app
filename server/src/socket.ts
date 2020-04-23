import WebSocket from "ws";

class Socket {
  private webSocket?: WebSocket;

  constructor() {}

  public init() {
    const wss = new WebSocket.Server({ port: 3002 });

    wss.on("connection", (webSocket) => {
      this.webSocket = webSocket;
      webSocket.on("message", (message) => {
        this.receiveMessage(message);

        this.sendMessage();
      });
    });
  }

  private receiveMessage = (message: WebSocket.Data) => {
    console.log(message);
  };

  private sendMessage = () => {
    if (this.webSocket) {
      this.webSocket.send("Hi back from the server");
    }
  };
}

export default Socket;
