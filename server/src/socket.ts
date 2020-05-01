import WebSocket from "ws";

interface UserClient {
  socket: WebSocket;
  id: string;
  type: "message" | "room" | "user";
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
      webSocket.on("message", (rawMessage) => {
        if (typeof rawMessage !== "string") {
          return;
        }
        const message = JSON.parse(rawMessage);
        // @ts-ignore
        if (!message || !message.clientType || !message.type || !message.data) {
          return;
        }

        // @ts-ignore
        switch (message.type) {
          case "register":
            if (message.clientType === "user") {
              if (message.data.isCurrentUser) {
                this.sendUserMessage(message.data.id, true);
              } else {
                // see if online, if so, send message back.
                const userSocket = this.clients.find(
                  (client) => client.id === message.data.id
                );

                if (userSocket) {
                  webSocket.send(
                    JSON.stringify({ id: message.data.id, isActive: true })
                  );
                }
              }
            }

            this.clients.push({
              socket: webSocket,
              id: message.data.id,
              type: message.clientType,
            });
            return;
          case "message":
            // @ts-ignore
            this.sendMessage(message.data);
            return;
          default:
            return;
        }
      });

      webSocket.on("close", () => {
        const client = this.clients.find((clientItem) => {
          return clientItem.socket === webSocket;
        });
        if (client && client.type === "user") {
          this.sendUserMessage(client.id, false);
        }

        // remove the now-closed client from our clients
        const newClients = this.clients.filter((client: UserClient) => {
          return client.socket !== webSocket;
        });

        this.clients = newClients;
      });
    });
  }

  private sendMessage = (data: any) => {
    const roomId = data.message.room;

    this.clients.forEach((client: UserClient) => {
      if (!client.socket || client.type === "user") {
        return;
      }

      // only send the message to clients who are in this room
      if (client.id !== roomId) {
        return;
      }

      if (client.socket.readyState === WebSocket.OPEN) {
        // @ts-ignore
        client.socket.send(JSON.stringify(data));
      }
    });
  };

  private sendUserMessage = (id: string, isActive: boolean) => {
    this.clients.forEach((client) => {
      if (client.id === id) {
        client.socket.send(JSON.stringify({ id: client.id, isActive }));
      }
    });
  };
}

export default Socket;
