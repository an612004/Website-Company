declare module '@sendgrid/mail' {
  interface MailDataRequired {
    to: string | string[];
    from: string;
    subject?: string;
    text?: string;
    html?: string;
  }

  export function setApiKey(key: string): void;
  export function send(msg: MailDataRequired | MailDataRequired[]): Promise<any>;
  const mail: {
    setApiKey: typeof setApiKey;
    send: typeof send;
  };

  export default mail;
}
