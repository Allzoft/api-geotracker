import { ApiTags } from '@nestjs/swagger';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  //   UseGuards,
} from '@nestjs/websockets';
import { spawn } from 'child_process';
import { Server, Socket } from 'socket.io';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

@ApiTags('trackers')
@WebSocketGateway(4500, {
  namespace: 'ws',
  cors: {
    origin: '*',
  },
})
export class TrackersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private runningProcesses = new Map<
    string,
    { process: any; socketId: string }
  >();

  afterInit(server: Server) {
    console.log('Soy el server:', server);

    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('runTracker')
  handleRunTracker(
    @MessageBody() { option, socketId }: { option: string; socketId: string },
  ): void {
    console.log('Received option:', option, 'from socket ID:', socketId);

    const command = 'cd /var/www/seeker && python3 seeker.py';
    const pythonProcess = spawn(command, [], { shell: true });
    const executionId = uuidv4(); // Genera un ID único para esta ejecución

    this.runningProcesses.set(executionId, {
      process: pythonProcess,
      socketId,
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.stdin.write(option + '\n');
    pythonProcess.stdin.end();

    pythonProcess.on('close', (code) => {
      this.runningProcesses.delete(executionId); // Elimina el registro después de que el proceso se cierre
      if (code === 0) {
        this.server
          .to(socketId)
          .emit('output', { executionId, success: true, output });
      } else {
        this.server
          .to(socketId)
          .emit('output', { executionId, success: false, error: errorOutput });
      }
    });
  }
}
