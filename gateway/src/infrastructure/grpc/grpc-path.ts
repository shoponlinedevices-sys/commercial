import { existsSync } from 'fs';
import { join } from 'path';

export function contractsProtoPath(fileName: string): string {
  const currentWorkspace = join(process.cwd(), 'packages', 'contracts', 'proto');
  const parentWorkspace = join(process.cwd(), '..', 'packages', 'contracts', 'proto');
  const protoDirectory = existsSync(currentWorkspace) ? currentWorkspace : parentWorkspace;

  return join(protoDirectory, fileName);
}
