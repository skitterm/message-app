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

        this.sendMessage(message);
      });
    });
  }

  private receiveMessage = (message: WebSocket.Data) => {
    //
  };

  private sendMessage = (message: WebSocket.Data) => {
    if (this.webSocket) {
      this.webSocket.send(message);
    }
  };
}

export default Socket;
