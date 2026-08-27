import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatbotXCallbackPayload } from '@waha/apps/chatbotx/dto/callback.dto';
import { ChatbotXOutboundService } from '@waha/apps/chatbotx/services/ChatbotXOutboundService';

@Controller('webhooks/chatbotx')
@ApiTags('🧩 Apps')
export class ChatbotXController {
  constructor(private readonly outboundService: ChatbotXOutboundService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ChatbotX Callback Webhook',
    description: 'Receives outbound messages sent by ChatbotX bot/agents and delivers them via WAHA session.',
  })
  async callback(@Body() payload: ChatbotXCallbackPayload) {
    return this.outboundService.handleOutboundMessage(payload);
  }

  @Post(':session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ChatbotX Callback Webhook with Session',
    description: 'Receives outbound messages sent by ChatbotX bot/agents for a specific WAHA session.',
  })
  async callbackWithSession(
    @Param('session') session: string,
    @Body() payload: ChatbotXCallbackPayload,
  ) {
    payload.session = session;
    return this.outboundService.handleOutboundMessage(payload);
  }
}
