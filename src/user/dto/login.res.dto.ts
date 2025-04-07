import { ApiProperty } from '@nestjs/swagger';
import { UserResDto } from './user-res.dto';
import { SuccessResponse } from 'src/shared';

export class LoginResponseDto extends SuccessResponse<UserResDto> {
  @ApiProperty({ type: UserResDto })
  declare data: UserResDto;
}
