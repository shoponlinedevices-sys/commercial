import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountEntity } from '../../infrastructure/database/entities/account.entity';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

type AccountLookup = Pick<AccountRepository, 'findById'>;

interface AuthenticatedRequest {
  user?: { id?: number | string };
}

@Injectable()
export class ViewEventsAdminGuard implements CanActivate {
  constructor(
    @Inject(AccountRepository) private readonly accounts: AccountLookup,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const rawId = request.user?.id;
    const accountId = typeof rawId === 'number'
      ? rawId
      : typeof rawId === 'string' && /^[1-9]\d*$/.test(rawId)
        ? Number(rawId)
        : NaN;

    if (!Number.isSafeInteger(accountId) || accountId < 1) {
      throw new UnauthorizedException();
    }

    const account: AccountEntity | null = await this.accounts.findById(accountId);
    if (!account || Number(account.status) !== 1) {
      throw new UnauthorizedException('Account is not active');
    }
    if (account.role !== 'admin') {
      throw new ForbiddenException('Administrator access is required for view analytics');
    }
    return true;
  }
}
