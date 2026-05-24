import { ConsultationsService } from './consultations.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConsultationsGateway } from './consultations.gateway';
import { Socket } from 'socket.io';

describe('ConsultationsGateway', () => {
  let gateway: ConsultationsGateway;
  let jwtService: JwtService;
  let consoleErrorSpy: jest.SpyInstance;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockSocket = {
    id: 'socket123',
    data: {},
    handshake: {
      auth: { token: 'valid-token' },
      headers: {},
    },
    disconnect: jest.fn(),
    emit: jest.fn(),
  } as unknown as Socket;

  const mockServer = {
    emit: jest.fn(),
    to: jest.fn().mockReturnValue({ emit: jest.fn() }),
  };

  const mockConsultationsService = {
    getVetQueue: jest.fn(),
    acceptConsultation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationsGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConsultationsService, // Injecting by type or token as appropriate
          useValue: mockConsultationsService,
        }
      ],
    }).compile();

    gateway = module.get<ConsultationsGateway>(ConsultationsGateway);
    jwtService = module.get<JwtService>(JwtService);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    gateway.server = mockServer as any;

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('handleConnection', () => {
    it('should authenticate and connect valid vet user', async () => {
      const payload = { sub: 'vet123', role: 'vet' };
      // ConsultationsGateway uses jwtService.verify not verifyAsync
      mockJwtService.verify = jest.fn().mockReturnValue(payload);

      await gateway.handleConnection(mockSocket);

      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(mockSocket.data.userId).toBe('vet123');
      expect(mockSocket.data.role).toBe('vet');
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should authenticate and connect valid user', async () => {
      const payload = { sub: 'user123', role: 'user' };
      mockJwtService.verify = jest.fn().mockReturnValue(payload);

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.data.userId).toBe('user123');
      expect(mockSocket.data.role).toBe('user');
    });

    it('should disconnect if no token provided', async () => {
      const socketNoToken = {
        ...mockSocket,
        handshake: { auth: {}, headers: {} },
        disconnect: jest.fn(),
      } as unknown as Socket;

      await gateway.handleConnection(socketNoToken);

      expect(socketNoToken.disconnect).toHaveBeenCalled();
    });

    it('should disconnect if token is invalid', async () => {
      mockJwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should extract token from authorization header', async () => {
      const socketWithHeader = {
        ...mockSocket,
        handshake: {
          auth: {},
          headers: { authorization: 'Bearer header-token' },
        },
      } as unknown as Socket;

      const payload = { sub: 'user123', role: 'user' };
      mockJwtService.verify = jest.fn().mockReturnValue(payload);

      await gateway.handleConnection(socketWithHeader);

      expect(jwtService.verify).toHaveBeenCalledWith('header-token');
    });
  });

  describe('handleRegister', () => {
    it('should register a vet when the client role and payload role are aligned', async () => {
      mockSocket.data = { userId: 'vet123', role: 'vet' };

      const result = await gateway.handleRegister(mockSocket, { role: 'vet', vetId: 'vet123' });

      expect(result).toEqual({ success: true, message: 'Registered as available vet' });
    });

    it('should also accept the legacy veterinarian payload role', async () => {
      mockSocket.data = { userId: 'vet123', role: 'vet' };

      const result = await gateway.handleRegister(mockSocket, { role: 'veterinarian', vetId: 'vet123' });

      expect(result).toEqual({ success: true, message: 'Registered as available vet' });
    });

    it('should reject non-vet clients trying to register as available vets', async () => {
      mockSocket.data = { userId: 'user123', role: 'user' };

      const result = await gateway.handleRegister(mockSocket, { role: 'vet', vetId: 'user123' });

      expect(result).toEqual({ success: false, error: 'Invalid role' });
    });
  });
});
