import axios, { AxiosInstance } from 'axios';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { ChatbotXAppConfig } from '@waha/apps/chatbotx/dto/config.dto';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { isJidGroup } from '@waha/core/utils/jids';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { PinoLogger } from 'nestjs-pino';

interface ChatbotXAttachment {
  url: string;
  fileType: 'image' | 'video' | 'file';
  mimeType?: string;
  name?: string;
}

interface ChatbotXInboundMessage {
  contact: {
    sourceId: string;
  };
  message: {
    sourceId: string;
    text: string | null;
    attachments?: ChatbotXAttachment[];
  };
}

export class ChatbotXListener {
  private readonly client: AxiosInstance;

  constructor(
    private readonly app: App<ChatbotXAppConfig>,
    private readonly session: WhatsappSession,
    private readonly logger: PinoLogger,
  ) {
    this.client = axios.create({
      baseURL: this.app.config.apiUrl.replace(/\/$/, ''),
      headers: {
        Authorization: `Bearer ${this.app.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    });
  }

  attach(): void {
    const messages = this.session.getEventObservable(WAHAEvents.MESSAGE_ANY);
    messages.subscribe((message: WAMessage) => {
      void this.forward(message);
    });
  }

  private async forward(message: WAMessage): Promise<void> {
    if (message.fromMe) {
      return;
    }
    if (!this.app.config.includeGroups && isJidGroup(message.from)) {
      return;
    }

    const body = this.toChatbotXMessage(message);
    try {
      await this.client.post('/v1/channels/api/messages', body);
      this.logger.debug(
        `Forwarded WhatsApp message '${message.id}' to ChatbotX for app '${this.app.id}'.`,
      );
    } catch (error) {
      const reason = axios.isAxiosError(error)
        ? `${error.response?.status || 'network'} ${JSON.stringify(error.response?.data || error.message)}`
        : String(error);
      this.logger.error(
        `Unable to forward WhatsApp message '${message.id}' to ChatbotX for app '${this.app.id}': ${reason}`,
      );
    }
  }

  private toChatbotXMessage(message: WAMessage): ChatbotXInboundMessage {
    const attachment = this.toAttachment(message);
    const body: ChatbotXInboundMessage = {
      contact: {
        sourceId: message.from,
      },
      message: {
        sourceId: message.id,
        text: message.body || null,
      },
    };
    if (attachment) {
      body.message.attachments = [attachment];
    }
    return body;
  }

  private toAttachment(message: WAMessage): ChatbotXAttachment | null {
    if (!message.media?.url) {
      return null;
    }
    const url = this.publicMediaUrl(message.media.url);
    if (!url) {
      this.logger.warn(
        `Skipping media for WhatsApp message '${message.id}': configure mediaBaseUrl with a public WAHA URL.`,
      );
      return null;
    }
    const mimeType = message.media.mimetype;
    let fileType: ChatbotXAttachment['fileType'] = 'file';
    if (mimeType?.startsWith('image/')) {
      fileType = 'image';
    } else if (mimeType?.startsWith('video/')) {
      fileType = 'video';
    }
    return {
      url: url,
      fileType: fileType,
      mimeType: mimeType,
      name: message.media.filename || 'attachment',
    };
  }

  private publicMediaUrl(mediaUrl: string): string | null {
    if (!this.app.config.mediaBaseUrl) {
      return null;
    }
    const baseUrl = this.app.config.mediaBaseUrl.replace(/\/$/, '');
    let pathname = mediaUrl;
    try {
      if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
        pathname = new URL(mediaUrl).pathname;
      }
    } catch {
      // keep relative path
    }
    if (!pathname.startsWith('/')) {
      pathname = '/' + pathname;
    }
    return `${baseUrl}${pathname}`;
  }
}
