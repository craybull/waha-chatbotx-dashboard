import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ChatbotXOutboundService {
  constructor(
    private readonly manager: SessionManager,
    private readonly logger: PinoLogger,
  ) {}

  async handleOutboundMessage(payload: any): Promise<{ success: boolean; result?: any }> {
    this.logger.info(`[ChatbotX] Received outbound webhook payload: ${JSON.stringify(payload)}`);

    // Ignore inbound echoes if ChatbotX broadcasts incoming messages
    if (
      payload.message_type === 'incoming' ||
      payload.message_type === 0 ||
      payload.message?.messageType === 'incoming' ||
      payload.message?.message_type === 'incoming'
    ) {
      this.logger.debug('[ChatbotX] Skipping incoming message echo');
      return { success: true, result: 'ignored_incoming' };
    }

    // Resolve target session dynamically (prevent defaulting to 'default' if session is in payload)
    let sessionName =
      payload.session ||
      payload.sessionName ||
      payload.session_name ||
      payload.data?.session;

    // If session is still not explicitly provided, try to match by available sessions
    if (!sessionName) {
      const allSessions = await this.manager.getSessions(true);
      if (allSessions && allSessions.length > 0) {
        const workingSession = allSessions.find((s) => s.status === 'WORKING');
        sessionName = workingSession ? workingSession.name : allSessions[0].name;
      } else {
        sessionName = 'default';
      }
    }

    const session = this.manager.getSession(sessionName);

    if (!session) {
      this.logger.error(`[ChatbotX] Target WhatsApp Session '${sessionName}' not found or not running`);
      throw new NotFoundException(`WAHA session '${sessionName}' not found`);
    }

    // Extract target WhatsApp Chat ID from various ChatbotX payload schemas
    let chatId =
      payload.to ||
      payload.recipient ||
      payload.contact?.sourceId ||
      payload.contact?.source_id ||
      payload.contact_inbox?.source_id ||
      payload.conversation?.contact_inbox?.source_id ||
      payload.conversation?.contact_inbox?.sourceId ||
      payload.contact?.identifier ||
      payload.contact?.phone_number ||
      payload.data?.to ||
      payload.data?.recipient;

    if (!chatId) {
      this.logger.warn(`[ChatbotX] Unable to find recipient 'chatId' in payload: ${JSON.stringify(payload)}`);
      return { success: false, result: 'missing_recipient' };
    }

    // Extract text content
    const text =
      payload.text ??
      payload.content ??
      payload.message?.text ??
      payload.message?.content ??
      (typeof payload.message === 'string' ? payload.message : undefined) ??
      payload.data?.content ??
      payload.data?.text;

    // Extract attachments from all potential levels
    let rawAttachments: any[] =
      payload.attachments ||
      payload.message?.attachments ||
      payload.data?.attachments ||
      [];

    if (!Array.isArray(rawAttachments)) {
      rawAttachments = [rawAttachments];
    }

    // Check single attachment object
    if (rawAttachments.length === 0) {
      const single = payload.attachment || payload.message?.attachment || payload.data?.attachment;
      if (single) {
        rawAttachments = [single];
      }
    }

    // Filter valid attachment objects
    rawAttachments = rawAttachments.filter((att) => att && (att.url || att.data_url || att.file_url));

    // Handle text-only message
    if (rawAttachments.length === 0 && text) {
      this.logger.info(`[ChatbotX] Dispatching text message to '${chatId}' on session '${sessionName}': ${text}`);
      try {
        const result = await session.sendText({
          session: sessionName,
          chatId: chatId,
          text: String(text),
        });
        return { success: true, result };
      } catch (err: any) {
        this.logger.error(`[ChatbotX] Error sending text to '${chatId}': ${err.message}`);
        return { success: false, result: err.message };
      }
    }

    // Handle attachments (image, video, document/file)
    if (rawAttachments.length > 0) {
      const results = [];
      for (const attachment of rawAttachments) {
        const fileUrl = attachment.url || attachment.data_url || attachment.file_url;
        const mimeType = attachment.mimeType || attachment.mime_type || attachment.content_type || 'image/jpeg';
        const fileName = attachment.name || attachment.filename || 'file';

        if (!fileUrl) continue;

        this.logger.info(`[ChatbotX] Dispatching attachment (${mimeType}) from '${fileUrl}' to '${chatId}' on session '${sessionName}'`);
        const filePayload = {
          session: sessionName,
          chatId: chatId,
          file: {
            url: fileUrl,
            mimetype: mimeType,
            filename: fileName,
          },
          caption: text ? String(text) : undefined,
        };

        try {
          let res;
          if (mimeType.startsWith('image/')) {
            res = await session.sendImage(filePayload);
          } else if (mimeType.startsWith('video/')) {
            res = await session.sendVideo({ ...filePayload, convert: false });
          } else {
            res = await session.sendFile(filePayload);
          }
          results.push(res);
        } catch (err: any) {
          this.logger.error(`[ChatbotX] Error sending attachment to '${chatId}': ${err.message}`);
        }
      }
      return { success: true, result: results };
    }

    this.logger.warn(`[ChatbotX] No message text or attachments found in payload`);
    return { success: true };
  }
}
