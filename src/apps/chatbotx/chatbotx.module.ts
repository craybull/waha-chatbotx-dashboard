import { ChatbotXController } from '@waha/apps/chatbotx/controllers/ChatbotXController';
import { ChatbotXAppService } from '@waha/apps/chatbotx/services/ChatbotXAppService';
import { ChatbotXOutboundService } from '@waha/apps/chatbotx/services/ChatbotXOutboundService';

export const ChatbotXAppExports = {
  providers: [ChatbotXAppService, ChatbotXOutboundService],
  imports: [],
  controllers: [ChatbotXController],
};

