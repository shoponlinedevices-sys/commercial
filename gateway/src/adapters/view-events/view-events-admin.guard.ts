import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
interface AuthenticatedRequest {
  user?: { id?: number | string; role?: string; status?: number };
}

@Injectable()
export class ViewEventsAdminGuard implements CanActivate {
  constructor() {}

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

    const status = request.user?.status;
    if (status !== undefined && Number(status) !== 1) {
      throw new UnauthorizedException('Account is not active');
    }
    if (request.user?.role !== 'admin') {
      throw new ForbiddenException('Administrator access is required for view analytics');
    }
    return true;
  }
}
