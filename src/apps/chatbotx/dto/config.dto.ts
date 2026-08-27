import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class ChatbotXAppConfig {
  @ApiProperty({
    description: 'ChatbotX API base URL',
    default: 'https://app.chatbotx.io/api',
  })
  @IsUrl({ require_tld: true })
  apiUrl: string = 'https://app.chatbotx.io/api';

  @ApiProperty({
    description: 'API Channel token created in ChatbotX. Keep this secret.',
  })
  @IsString()
  apiToken: string;

  @ApiPropertyOptional({
    description:
      'Public WAHA URL used to replace localhost in inbound media URLs. Required for image, video, and file forwarding.',
    example: 'https://waha.example.com',
  })
  @IsOptional()
  @IsUrl({ require_tld: true })
  mediaBaseUrl?: string;

  @ApiPropertyOptional({
    description: 'Forward group messages. Disabled by default.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeGroups?: boolean = false;
}
