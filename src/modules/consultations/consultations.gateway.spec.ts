import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConsultationsGateway } from './consultations.gateway';
import { ConsultationsService } from './consultations.service';
import { Socket } from 'socket.io';
import { Types } from 'mongoose';

describe('ConsultationsGateway', () => {
  let gateway: ConsultationsGateway;
  let jwtService: JwtService;
  let consultationsService: ConsultationsService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConsultationsService = {
    acceptConsultation: jest.fn(),
    releaseConsultation: jest.fn(),
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
          provide: ConsultationsService,
          useValue: mockConsultationsService,
        },
      ],
    }).compile();

    gateway = module.get<ConsultationsGateway>(ConsultationsGateway);
    jwtService = module.get<JwtService>(JwtService);
    consultationsService = module.get<ConsultationsService>(ConsultationsService);

    gateway.server = mockServer as any;

    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should authenticate and connect valid vet user', async () => {
      const payload = { sub: 'vet123', role: 'vet' };
      mockJwtService.verify.mockReturnValue(payload);

      await gateway.handleConnection(mockSocket);

      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(mockSocket.data.userId).toBe('vet123');
      expect(mockSocket.data.role).toBe('vet');
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should authenticate and connect valid user', async () => {
      const payload = { sub: 'user123', role: 'user' };
      mockJwtService.verify.mockReturnValue(payload);

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.data.userId).toBe('user123');
      expect(mockSocket.data.role).toBe('user');
    });

    it('should disconnect if no token provided', async () => {
      const socketNoToken = {
        ...mockSocket,
        handshake: { auth: {}, headers: {} },
      } as unknown as Socket;

      await gateway.handleConnection(socketNoToken);

      expect(socketNoToken.disconnect).toHaveBeenCalled();
    });

    it('should disconnect if token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
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
      mockJwtService.verify.mockReturnValue(payload);

      await gateway.handleConnection(socketWithHeader);

      expect(jwtService.verify).toHaveBeenCalledWith('header-token');
    });
  });

  describe('handleRegister', () => {
    it('should register vet as available', async () => {
      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';

      const result = await gateway.handleRegister(mockSocket, {
        role: 'veterinarian',
        vetId: 'vet123',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registered as available vet');
    });

    it('should reject registration for non-vet role', async () => {
      mockSocket.data.role = 'user';

      const result = await gateway.handleRegister(mockSocket, {
        role: 'veterinarian',
        vetId: 'user123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid role');
    });
  });

  describe('handleAccept', () => {
    it('should accept consultation for vet', async () => {
      const consultationId = new Types.ObjectId().toString();
      const mockConsultation = {
        _id: consultationId,
        status: 'assigned',
        veterinarianName: 'Dr. Smith',
      };

      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';
      mockConsultationsService.acceptConsultation.mockResolvedValue(mockConsultation);

      const result = await gateway.handleAccept(mockSocket, { consultationId });

      expect(consultationsService.acceptConsultation).toHaveBeenCalledWith(
        consultationId,
        'vet123',
      );
      expect(result.success).toBe(true);
      expect(result.consultation).toEqual(mockConsultation);
      expect(mockServer.emit).toHaveBeenCalledWith('consultation:claimed', {
        consultationId,
        vetId: 'vet123',
        vetName: 'Dr. Smith',
      });
    });

    it('should reject accept for non-vet', async () => {
      mockSocket.data.role = 'user';

      const result = await gateway.handleAccept(mockSocket, {
        consultationId: 'consultation123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Only vets can accept consultations');
    });

    it('should handle accept errors', async () => {
      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';
      mockConsultationsService.acceptConsultation.mockRejectedValue(
        new Error('Already assigned'),
      );

      const result = await gateway.handleAccept(mockSocket, {
        consultationId: 'consultation123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already assigned');
    });
  });

  describe('handleRelease', () => {
    it('should release consultation for vet', async () => {
      const consultationId = new Types.ObjectId().toString();

      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';
      mockConsultationsService.releaseConsultation.mockResolvedValue({});

      const result = await gateway.handleRelease(mockSocket, { consultationId });

      expect(consultationsService.releaseConsultation).toHaveBeenCalledWith(
        consultationId,
        'vet123',
      );
      expect(result.success).toBe(true);
      expect(mockServer.emit).toHaveBeenCalledWith('consultation:released', {
        consultationId,
      });
    });

    it('should reject release for non-vet', async () => {
      mockSocket.data.role = 'user';

      const result = await gateway.handleRelease(mockSocket, {
        consultationId: 'consultation123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Only vets can release consultations');
    });

    it('should handle release errors', async () => {
      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';
      mockConsultationsService.releaseConsultation.mockRejectedValue(
        new Error('Not assigned to you'),
      );

      const result = await gateway.handleRelease(mockSocket, {
        consultationId: 'consultation123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not assigned to you');
    });
  });

  describe('notifyNewConsultation', () => {
    it('should broadcast new consultation', () => {
      const consultation = { _id: 'consultation123', status: 'pending' };

      gateway.notifyNewConsultation(consultation);

      expect(mockServer.emit).toHaveBeenCalledWith('consultation:incoming', consultation);
    });
  });

  describe('notifyConsultationCompleted', () => {
    it('should broadcast consultation completed', () => {
      const consultationId = 'consultation123';

      gateway.notifyConsultationCompleted(consultationId);

      expect(mockServer.emit).toHaveBeenCalledWith('consultation:completed', {
        consultationId,
      });
    });
  });

  describe('notifyConsultationUpdated', () => {
    it('should broadcast consultation updated', () => {
      const consultationId = 'consultation123';
      const updates = { unreadCount: 5 };

      gateway.notifyConsultationUpdated(consultationId, updates);

      expect(mockServer.emit).toHaveBeenCalledWith('consultation:updated', {
        consultationId,
        ...updates,
      });
    });
  });

  describe('handleDisconnect', () => {
    it('should handle vet disconnect', () => {
      mockSocket.data.role = 'vet';
      mockSocket.data.userId = 'vet123';

      gateway.handleDisconnect(mockSocket);

      // Should not throw error
      expect(true).toBe(true);
    });

    it('should handle user disconnect', () => {
      mockSocket.data.role = 'user';
      mockSocket.data.userId = 'user123';

      gateway.handleDisconnect(mockSocket);

      // Should not throw error
      expect(true).toBe(true);
    });
  });
});
