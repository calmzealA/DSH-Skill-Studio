import { rename, rm } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';

// Windows readers, indexers and scanners may briefly hold a file without
// FILE_SHARE_DELETE. Never replace an atomic rename with truncate/write.
const RETRY_DELAYS = [40, 80, 160, 240, 400, 600];

export function createFileOperations({ renameFile = rename, removeFile = rm, wait = pause, platform = process.platform } = {}) {
  async function attempt(operation, beforeAttempt) {
    for (let index = 0;; index++) {
      // A delayed write must not overwrite changes made while it was waiting.
      if (beforeAttempt) await beforeAttempt();
      try { return await operation(); }
      catch (cause) {
        const temporary = cause?.code === 'EBUSY' || platform === 'win32' && ['EPERM', 'EACCES'].includes(cause?.code);
        if (!temporary) throw cause;
        if (index === RETRY_DELAYS.length) {
          const error = new Error(cause.code === 'EBUSY'
            ? 'The file is still in use by another program. Close that program and retry; your changes have not been discarded.'
            : 'The file could not be changed. It may be in use, or this account may not have write permission. Check access and retry.', { cause });
          error.code = cause.code === 'EBUSY' ? 'FILE_BUSY' : 'FILE_ACCESS';
          error.fsCode = cause.code;
          throw error;
        }
        await wait(RETRY_DELAYS[index]);
      }
    }
  }
  return {
    rename: (from, to, { beforeAttempt } = {}) => attempt(() => renameFile(from, to), beforeAttempt),
    remove: (path, options = {}, { beforeAttempt } = {}) => attempt(() => removeFile(path, options), beforeAttempt),
  };
}
