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

        this.sendMessage(wss, message);
      });
    });
  }

  private receiveMessage = (message: WebSocket.Data) => {
    //
  };

  private sendMessage = (wss: WebSocket.Server, message: WebSocket.Data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };
}

export default Socket;
