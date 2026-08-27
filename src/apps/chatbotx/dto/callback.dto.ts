import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ChatbotXMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  BUTTON = 'button',
}

export class ChatbotXCallbackAttachment {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class ChatbotXCallbackPayload {
  @ApiProperty({ description: 'Target WAHA session ID, e.g. default' })
  @IsOptional()
  @IsString()
  session?: string;

  @ApiProperty({ description: 'WhatsApp recipient JID or phone number, e.g. 84901234567@c.us' })
  @IsString()
  to: string;

  @ApiPropertyOptional({ description: 'Message body text' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ enum: ChatbotXMessageType, enumName: 'ChatbotXMessageType' })
  @IsOptional()
  @IsEnum(ChatbotXMessageType)
  type?: ChatbotXMessageType;

  @ApiPropertyOptional({ type: [ChatbotXCallbackAttachment] })
  @IsOptional()
  @IsArray()
  attachments?: ChatbotXCallbackAttachment[];
}
