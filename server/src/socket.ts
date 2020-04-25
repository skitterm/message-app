import WebSocket from "ws";

interface UserClient {
  socket: WebSocket;
  rooms: string[];
}

class Socket {
  private webSocketServer?: WebSocket.Server;
  private clients: UserClient[];

  constructor() {
    this.clients = [];
  }

  public init() {
    this.webSocketServer = new WebSocket.Server({ port: 3002 });

    this.webSocketServer.on("connection", (webSocket) => {
      this.clients.push({
        socket: webSocket,
        rooms: [],
      });

      webSocket.on("message", (rawMessage) => {
        if (typeof rawMessage !== "string") {
          return;
        }
        const message = JSON.parse(rawMessage);
        // @ts-ignore
        if (!message || !message.type) {
          return;
        }

        // @ts-ignore
        switch (message.type) {
          case "register":
            return;
          case "message":
            // @ts-ignore
            if (message.data) {
              // @ts-ignore
              this.sendMessage(message.data);
            }
            return;
          default:
            return;
        }
        this.receiveMessage(message);
      });

      webSocket.on("close", () => {
        // remove the now-closed client from our clients
        const newClients = this.clients.filter((client: UserClient) => {
          return client.socket !== webSocket;
        });

        this.clients = newClients;
      });
    });
  }

  private receiveMessage = (message: WebSocket.Data) => {};

  private sendMessage = (data: any) => {
    this.clients.forEach((client: UserClient) => {
      if (!client.socket) {
        return;
      }
      if (client.socket.readyState === WebSocket.OPEN) {
        // @ts-ignore
        client.socket.send(JSON.stringify(data));
      }
    });
  };
}

export default Socket;
