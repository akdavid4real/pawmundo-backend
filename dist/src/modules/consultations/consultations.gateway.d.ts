import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConsultationsService } from './consultations.service';
export declare class ConsultationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private consultationsService;
    server: Server;
    private vetConnections;
    constructor(jwtService: JwtService, consultationsService: ConsultationsService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleRegister(client: Socket, data: {
        role: string;
        vetId: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
    handleJoinRoom(client: Socket, data: {
        consultationId: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleAccept(client: Socket, data: {
        consultationId: string;
    }): Promise<{
        success: boolean;
        consultation: import("./schemas/consultation.schema").Consultation;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        consultation?: undefined;
    }>;
    handleRelease(client: Socket, data: {
        consultationId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleTyping(client: Socket, data: {
        consultationId: string;
        isTyping: boolean;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleMarkRead(client: Socket, data: {
        consultationId: string;
        messageIds?: string[];
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    notifyNewConsultation(consultation: any): void;
    notifyConsultationCompleted(consultationId: string): void;
    notifyConsultationUpdated(consultationId: string, updates: any): void;
}
