export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    sendResetPassword(email: string, token: string): Promise<any>;
}
