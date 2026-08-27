import { Injectable } from '@nestjs/common';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { ChatbotXAppConfig } from '@waha/apps/chatbotx/dto/config.dto';
import { ChatbotXListener } from '@waha/apps/chatbotx/services/ChatbotXListener';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ChatbotXAppService implements IAppService {
  constructor(
    @InjectPinoLogger('ChatbotXAppService')
    private readonly logger: PinoLogger,
  ) {}

  validate(app: App<ChatbotXAppConfig>): void {
    void app;
  }

  async beforeCreated(app: App<ChatbotXAppConfig>): Promise<void> {
    void app;
  }

  async afterCreated(
    manager: SessionManager,
    app: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async beforeEnabled(
    manager: SessionManager,
    savedApp: App<ChatbotXAppConfig>,
    newApp: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDisabled(
    manager: SessionManager,
    savedApp: App<ChatbotXAppConfig>,
    newApp: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeUpdated(
    manager: SessionManager,
    savedApp: App<ChatbotXAppConfig>,
    newApp: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDeleted(
    manager: SessionManager,
    app: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async beforeSessionDeleted(
    manager: SessionManager,
    app: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async enrich(
    manager: SessionManager,
    app: App<ChatbotXAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  beforeSessionStart(
    app: App<ChatbotXAppConfig>,
    session: WhatsappSession,
  ): void {
    const listener = new ChatbotXListener(app, session, this.logger);
    listener.attach();
  }

  afterSessionStart(
    app: App<ChatbotXAppConfig>,
    session: WhatsappSession,
  ): void {
    void app;
    void session;
  }
}
