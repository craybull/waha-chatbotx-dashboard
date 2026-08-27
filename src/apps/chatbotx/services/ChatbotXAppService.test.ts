import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { ChatbotXAppConfig } from '@waha/apps/chatbotx/dto/config.dto';
import { ChatbotXAppService } from '@waha/apps/chatbotx/services/ChatbotXAppService';
import { ChatbotXListener } from '@waha/apps/chatbotx/services/ChatbotXListener';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { PinoLogger } from 'nestjs-pino';

jest.mock('@waha/apps/chatbotx/services/ChatbotXListener');

describe('ChatbotXAppService', () => {
  let service: ChatbotXAppService;
  let logger: jest.Mocked<PinoLogger>;
  let app: App<ChatbotXAppConfig>;
  let session: jest.Mocked<WhatsappSession>;

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;

    service = new ChatbotXAppService(logger);

    app = {
      id: 'app-cbx',
      app: 'chatbotx' as any,
      session: 'default',
      enabled: true,
      config: {
        apiUrl: 'https://app.chatbotx.io/api',
        apiToken: 'token-123',
      },
    };

    session = {} as jest.Mocked<WhatsappSession>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should instantiate and attach ChatbotXListener on beforeSessionStart', () => {
    const attachSpy = jest.fn();
    (ChatbotXListener as jest.Mock).mockImplementation(() => ({
      attach: attachSpy,
    }));

    service.beforeSessionStart(app, session);

    expect(ChatbotXListener).toHaveBeenCalledWith(app, session, logger);
    expect(attachSpy).toHaveBeenCalled();
  });
});
