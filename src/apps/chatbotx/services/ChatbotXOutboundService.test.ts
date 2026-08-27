import { NotFoundException } from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { ChatbotXOutboundService } from '@waha/apps/chatbotx/services/ChatbotXOutboundService';
import { ChatbotXCallbackPayload } from '@waha/apps/chatbotx/dto/callback.dto';
import { PinoLogger } from 'nestjs-pino';

describe('ChatbotXOutboundService', () => {
  let service: ChatbotXOutboundService;
  let manager: jest.Mocked<SessionManager>;
  let session: jest.Mocked<WhatsappSession>;
  let logger: jest.Mocked<PinoLogger>;

  beforeEach(() => {
    session = {
      sendText: jest.fn().mockResolvedValue({ id: 'msg-out-1' }),
      sendImage: jest.fn().mockResolvedValue({ id: 'msg-img-1' }),
      sendVideo: jest.fn().mockResolvedValue({ id: 'msg-vid-1' }),
      sendFile: jest.fn().mockResolvedValue({ id: 'msg-file-1' }),
    } as unknown as jest.Mocked<WhatsappSession>;

    manager = {
      getSession: jest.fn().mockReturnValue(session),
    } as unknown as jest.Mocked<SessionManager>;

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;

    service = new ChatbotXOutboundService(manager, logger);
  });

  it('should throw NotFoundException if session does not exist', async () => {
    manager.getSession.mockReturnValue(null as any);

    const payload: ChatbotXCallbackPayload = {
      session: 'invalid-session',
      to: '123456789@c.us',
      text: 'Hello',
    };

    await expect(service.handleOutboundMessage(payload)).rejects.toThrow(NotFoundException);
  });

  it('should send text message via session.sendText when no attachments', async () => {
    const payload: ChatbotXCallbackPayload = {
      session: 'default',
      to: '123456789@c.us',
      text: 'Response from Bot',
    };

    const res = await service.handleOutboundMessage(payload);

    expect(res.success).toBe(true);
    expect(session.sendText).toHaveBeenCalledWith({
      session: 'default',
      chatId: '123456789@c.us',
      text: 'Response from Bot',
    });
  });

  it('should send image via session.sendImage when attachment mimeType is image/*', async () => {
    const payload: ChatbotXCallbackPayload = {
      session: 'default',
      to: '123456789@c.us',
      text: 'Image caption',
      attachments: [
        {
          url: 'https://example.com/img.jpg',
          mimeType: 'image/jpeg',
          name: 'img.jpg',
        },
      ],
    };

    const res = await service.handleOutboundMessage(payload);

    expect(res.success).toBe(true);
    expect(session.sendImage).toHaveBeenCalledWith({
      session: 'default',
      chatId: '123456789@c.us',
      file: {
        url: 'https://example.com/img.jpg',
        mimetype: 'image/jpeg',
        filename: 'img.jpg',
      },
      caption: 'Image caption',
    });
  });

  it('should send document via session.sendFile when attachment is document', async () => {
    const payload: ChatbotXCallbackPayload = {
      session: 'default',
      to: '123456789@c.us',
      attachments: [
        {
          url: 'https://example.com/doc.pdf',
          mimeType: 'application/pdf',
          name: 'doc.pdf',
        },
      ],
    };

    const res = await service.handleOutboundMessage(payload);

    expect(res.success).toBe(true);
    expect(session.sendFile).toHaveBeenCalledWith({
      session: 'default',
      chatId: '123456789@c.us',
      file: {
        url: 'https://example.com/doc.pdf',
        mimetype: 'application/pdf',
        filename: 'doc.pdf',
      },
      caption: undefined,
    });
  });
});
