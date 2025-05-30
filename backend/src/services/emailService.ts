import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Verificar configurações
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('Configurações SMTP não encontradas no .env');
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${options.to}:`, result.messageId);
    } catch (error) {
      console.error('Erro detalhado ao enviar email:', error);
      
      if (error instanceof Error) {
        // Tratar erros específicos
        if (error.message.includes('authentication') || error.message.includes('Invalid login')) {
          throw new Error('Erro de autenticação SMTP - verifique as credenciais do Gmail');
        } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
          throw new Error('Erro de conexão SMTP - verifique o host e porta');
        } else if (error.message.includes('timeout')) {
          throw new Error('Timeout na conexão SMTP');
        } else {
          throw new Error(`Falha ao enviar email: ${error.message}`);
        }
      }
      
      throw new Error('Falha ao enviar email');
    }
  }
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha/${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f27911;">Recuperação de Senha - FeraApp</h2>
        <p>Você solicitou uma recuperação de senha para sua conta.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #f27911; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Redefinir Senha
          </a>
        </div>
        <p><strong>Este link expira em 1 hora.</strong></p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Se o botão não funcionar, copie e cole este link no seu navegador:<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Recuperação de Senha - FeraApp',
      html
    });
  }

  // Método de teste para verificar configurações
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Conexão SMTP funcionando corretamente' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, message: `Erro na conexão SMTP: ${errorMessage}` };
    }
  }
}

export default new EmailService();
