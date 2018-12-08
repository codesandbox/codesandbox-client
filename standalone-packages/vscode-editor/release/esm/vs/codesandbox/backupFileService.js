import { TPromise } from '../base/common/winjs.base.js';
/**
 * A service that handles any I/O and state associated with the backup system.
 */
var CodeSandboxBackupService = /** @class */ (function () {
    function CodeSandboxBackupService() {
    }
    /**
       * Finds out if there are any backups stored.
       */
    CodeSandboxBackupService.prototype.hasBackups = function () {
        return new TPromise(function (resolve) { return resolve(false); });
    };
    /**
       * Loads the backup resource for a particular resource within the current workspace.
       *
       * @param resource The resource that is backed up.
       * @return The backup resource if any.
       */
    CodeSandboxBackupService.prototype.loadBackupResource = function (resource) {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    /**
       * Given a resource, returns the associated backup resource.
       *
       * @param resource The resource to get the backup resource for.
       * @return The backup resource.
       */
    CodeSandboxBackupService.prototype.toBackupResource = function (resource) {
        return resource;
    };
    /**
       * Backs up a resource.
       *
       * @param resource The resource to back up.
       * @param content The content of the resource as snapshot.
       * @param versionId The version id of the resource to backup.
       */
    CodeSandboxBackupService.prototype.backupResource = function (resource, content, versionId) {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    /**
       * Gets a list of file backups for the current workspace.
       *
       * @return The list of backups.
       */
    CodeSandboxBackupService.prototype.getWorkspaceFileBackups = function () {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    /**
       * Resolves the backup for the given resource.
       *
       * @param value The contents from a backup resource as stream.
       * @return The backup file's backed up content as text buffer factory.
       */
    CodeSandboxBackupService.prototype.resolveBackupContent = function (backup) {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    /**
       * Discards the backup associated with a resource if it exists..
       *
       * @param resource The resource whose backup is being discarded discard to back up.
       */
    CodeSandboxBackupService.prototype.discardResourceBackup = function (resource) {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    /**
       * Discards all backups associated with the current workspace and prevents further backups from
       * being made.
       */
    CodeSandboxBackupService.prototype.discardAllWorkspaceBackups = function () {
        return new TPromise(function (resolve) { return resolve(null); });
    };
    return CodeSandboxBackupService;
}());
export { CodeSandboxBackupService };
