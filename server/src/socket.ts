import WebSocket from "ws";

interface UserClient {
  socket: WebSocket;
  id: string;
  isSourceUser?: boolean;
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
              this.registerUserClient(webSocket, message.data);
            }

            this.clients.push({
              socket: webSocket,
              id: message.data.id,
              type: message.clientType,
              isSourceUser: message.data.isCurrentUser,
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

        // remove the now-closed client from our clients
        const newClients = this.clients.filter((client: UserClient) => {
          return client.socket !== webSocket;
        });

        this.clients = newClients;

        if (client && client.type === "user") {
          // let all concerned sockets know that this has closed
          // but only if the user's presence isn't also elsewhere
          const otherUserSocket = this.clients.find((otherClientItem) => {
            return (
              otherClientItem.type === "user" &&
              otherClientItem.id === client.id &&
              otherClientItem.isSourceUser
            );
          });

          if (!otherUserSocket) {
            this.sendUserMessage(client.id, false);
          }
        }
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
        const dateToSend =
          typeof data.message.dateToSend === "number"
            ? data.message.dateToSend
            : Date.now();
        const difference = dateToSend - Date.now();

        setTimeout(() => {
          client.socket.send(JSON.stringify(data));
        }, difference);
      }
    });
  };

  private registerUserClient = (socket: WebSocket, data: any) => {
    if (data.isCurrentUser) {
      this.sendUserMessage(data.id, true);
    } else {
      // see if online, if so, send message back.
      const userSocket = this.clients.find(
        (client) => client.id === data.id && client.isSourceUser
      );

      if (userSocket) {
        socket.send(JSON.stringify({ id: data.id, isActive: true }));
      }
    }
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
