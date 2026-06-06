export interface ISendEmailRequest {
  to: string;
  subject: string;
  body: string;
  template?: string;
  templateData?: Record<string, string>;
}

export interface ISendEmailResponse {
  success: boolean;
  messageId?: string;
  emailId?: number;
  error?: string;
}
