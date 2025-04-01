import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        path: "/socket.io/",
        transports: ["websocket", "polling"],
        auth: {
          token,
        },
        withCredentials: true,
      }
    );

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Socket event methods
  public on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  public emit(event: string, ...args: any[]): void {
    this.socket?.emit(event, ...args);
  }
}

export default SocketService;
