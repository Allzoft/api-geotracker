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
@WebSocketGateway({
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
    const logMessage = (message: string) => {
      console.log(message); // Imprime en la consola del servidor
      this.server.to(socketId).emit('log', message); // Envía al cliente conectado
    };

    logMessage('Received runTracker event');
    logMessage('Received option: ' + option);
    logMessage('Received socket ID: ' + socketId);

    if (!option || !socketId) {
      const errorMessage = 'Option or socketId is missing';
      console.error(errorMessage);
      this.server.to(socketId).emit('error', errorMessage);
      return;
    }

    const command = 'cd /var/www/seeker && python3 seeker.py';
    logMessage('Command to be executed: ' + command);

    // Start the Python process
    const pythonProcess = spawn(command, [], { shell: true });
    const executionId = uuidv4(); // Generate a unique ID for this execution
    logMessage('Generated execution ID: ' + executionId);

    this.runningProcesses.set(executionId, {
      process: pythonProcess,
      socketId,
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      logMessage('Python stdout data: ' + data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      logMessage('Python stderr data: ' + data.toString());
    });

    pythonProcess.stdin.write(option + '\n');
    pythonProcess.stdin.end();
    logMessage('Sent option to Python process');

    pythonProcess.on('close', (code) => {
      logMessage('Python process closed with code: ' + code);
      this.runningProcesses.delete(executionId); // Remove the record after the process closes

      if (code === 0) {
        logMessage('Python process succeeded');
        this.server
          .to(socketId)
          .emit('output', { executionId, success: true, output });
      } else {
        logMessage('Python process failed');
        this.server
          .to(socketId)
          .emit('output', { executionId, success: false, error: errorOutput });
      }
    });
  }

  @SubscribeMessage('getLink')
  handleRunTrackerLink(
    @MessageBody() { socketId }: { socketId: string },
  ): void {
    const logMessage = (message: string) => {
      console.log(message); // Imprime en la consola del servidor
      this.server.to(socketId).emit('log', message); // Envía al cliente conectado
    };

    logMessage('Received runTracker event');
    logMessage('Received socket ID: ' + socketId);

    const command = 'ssh -R 80:localhost:8080 nokey@localhost.run';
    logMessage('Command to be executed: ' + command);

    // Start the Python process
    const pythonProcess = spawn(command, [], { shell: true });
    const executionId = uuidv4(); // Generate a unique ID for this execution
    logMessage('Generated execution ID: ' + executionId);

    this.runningProcesses.set(executionId, {
      process: pythonProcess,
      socketId,
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      logMessage('Python stdout data: ' + data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      logMessage('Python stderr data: ' + data.toString());
    });

    pythonProcess.on('close', (code) => {
      logMessage('Python process closed with code: ' + code);
      this.runningProcesses.delete(executionId); // Remove the record after the process closes

      if (code === 0) {
        logMessage('Python process succeeded');
        this.server
          .to(socketId)
          .emit('output', { executionId, success: true, output });
      } else {
        logMessage('Python process failed');
        this.server
          .to(socketId)
          .emit('output', { executionId, success: false, error: errorOutput });
      }
    });
  }
}
