import { ForbiddenException } from '@nestjs/common';
import { IJwtPayload } from '../auth.interface';
import { TOKEN_EXPIRED_ERROR } from '../auth.errors';
import { USER_NOT_FOUND_ERROR } from '../user/user.errors';
import { MILLIS_IN_SECOND } from '../configs/auth.constants';

export default async function checkUserChanges(payload: IJwtPayload): Promise<void> {
  const userUpdatedAt = await this.authService.getLastUpdateDate(payload.userId);
  if (!userUpdatedAt) {
    throw new ForbiddenException(USER_NOT_FOUND_ERROR);
  }
  const createdAt = new Date(payload.iat * MILLIS_IN_SECOND);
  if (userUpdatedAt > createdAt) {
    throw new ForbiddenException(TOKEN_EXPIRED_ERROR);
  }
}
