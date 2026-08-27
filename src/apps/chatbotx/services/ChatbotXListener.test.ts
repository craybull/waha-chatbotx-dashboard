import { Subject } from 'rxjs';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { ChatbotXAppConfig } from '@waha/apps/chatbotx/dto/config.dto';
import { ChatbotXListener } from '@waha/apps/chatbotx/services/ChatbotXListener';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { PinoLogger } from 'nestjs-pino';

describe('ChatbotXListener', () => {
  let app: App<ChatbotXAppConfig>;
  let session: jest.Mocked<WhatsappSession>;
  let logger: jest.Mocked<PinoLogger>;
  let messageSubject: Subject<WAMessage>;
  let postSpy: jest.Mock;

  beforeEach(() => {
    messageSubject = new Subject<WAMessage>();

    app = {
      id: 'app-chatbotx-1',
      app: 'chatbotx' as any,
      session: 'default',
      enabled: true,
      config: {
        apiUrl: 'https://app.chatbotx.io/api/',
        apiToken: 'test-token-123',
        mediaBaseUrl: 'https://waha.example.com',
        includeGroups: false,
      },
    };

    session = {
      getEventObservable: jest.fn().mockImplementation((event) => {
        if (event === WAHAEvents.MESSAGE_ANY) {
          return messageSubject.asObservable();
        }
        return new Subject().asObservable();
      }),
    } as unknown as jest.Mocked<WhatsappSession>;

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;

    postSpy = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });

    // Mock axios instance created inside listener
    const axios = require('axios');
    jest.spyOn(axios, 'create').mockReturnValue({
      post: postSpy,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attach to MESSAGE_ANY observable and forward valid text messages', async () => {
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    expect(session.getEventObservable).toHaveBeenCalledWith(WAHAEvents.MESSAGE_ANY);

    const msg: WAMessage = {
      id: 'msg-001',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: false,
      body: 'Hello ChatbotX!',
    } as WAMessage;

    messageSubject.next(msg);

    // Give microtask queue time to process async forward
    await Promise.resolve();

    expect(postSpy).toHaveBeenCalledWith('/v1/channels/api/messages', {
      contact: {
        sourceId: '123456789@c.us',
      },
      message: {
        sourceId: 'msg-001',
        text: 'Hello ChatbotX!',
      },
    });
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining("Forwarded WhatsApp message 'msg-001'"),
    );
  });

  it('should skip messages sent from self (fromMe = true)', async () => {
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-self',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: true,
      body: 'Outgoing message',
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('should skip group messages if includeGroups is false', async () => {
    app.config.includeGroups = false;
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-group',
      timestamp: 123456789,
      from: '123456789@g.us',
      fromMe: false,
      body: 'Group message',
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('should forward group messages if includeGroups is true', async () => {
    app.config.includeGroups = true;
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-group-allowed',
      timestamp: 123456789,
      from: '123456789@g.us',
      fromMe: false,
      body: 'Group message allowed',
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(postSpy).toHaveBeenCalledWith('/v1/channels/api/messages', {
      contact: {
        sourceId: '123456789@g.us',
      },
      message: {
        sourceId: 'msg-group-allowed',
        text: 'Group message allowed',
      },
    });
  });

  it('should format image attachments correctly with publicMediaUrl', async () => {
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-img',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: false,
      body: 'Here is an image',
      media: {
        url: 'http://localhost:3000/api/files/image.jpg',
        mimetype: 'image/jpeg',
        filename: 'photo.jpg',
      },
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(postSpy).toHaveBeenCalledWith('/v1/channels/api/messages', {
      contact: {
        sourceId: '123456789@c.us',
      },
      message: {
        sourceId: 'msg-img',
        text: 'Here is an image',
        attachments: [
          {
            url: 'https://waha.example.com/api/files/image.jpg',
            fileType: 'image',
            mimeType: 'image/jpeg',
            name: 'photo.jpg',
          },
        ],
      },
    });
  });

  it('should format video and file attachments correctly', async () => {
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msgVideo: WAMessage = {
      id: 'msg-vid',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: false,
      body: 'Video clip',
      media: {
        url: 'http://localhost:3000/api/files/video.mp4',
        mimetype: 'video/mp4',
        filename: 'clip.mp4',
      },
    } as WAMessage;

    messageSubject.next(msgVideo);
    await Promise.resolve();

    expect(postSpy).toHaveBeenCalledWith('/v1/channels/api/messages', expect.objectContaining({
      message: expect.objectContaining({
        attachments: [
          expect.objectContaining({
            fileType: 'video',
            mimeType: 'video/mp4',
          }),
        ],
      }),
    }));
  });

  it('should warn and skip attachment if mediaBaseUrl is not configured', async () => {
    app.config.mediaBaseUrl = undefined;
    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-no-base',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: false,
      body: 'Image without base URL',
      media: {
        url: 'http://localhost:3000/api/files/image.jpg',
        mimetype: 'image/jpeg',
      },
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipping media for WhatsApp message 'msg-no-base'"),
    );
    expect(postSpy).toHaveBeenCalledWith('/v1/channels/api/messages', {
      contact: {
        sourceId: '123456789@c.us',
      },
      message: {
        sourceId: 'msg-no-base',
        text: 'Image without base URL',
      },
    });
  });

  it('should handle API errors gracefully and log them', async () => {
    postSpy.mockRejectedValue(new Error('Network connection timeout'));

    const listener = new ChatbotXListener(app, session, logger);
    listener.attach();

    const msg: WAMessage = {
      id: 'msg-err',
      timestamp: 123456789,
      from: '123456789@c.us',
      fromMe: false,
      body: 'Failing message',
    } as WAMessage;

    messageSubject.next(msg);
    await Promise.resolve();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Unable to forward WhatsApp message 'msg-err'"),
    );
  });
});
