export declare class MailService {
    sendMail(mailOptions: {
        to: string;
        subject: string;
        text: string;
    }): Promise<void>;
}
