import path from "path";
import { errors } from "@ts-morph/common";
import { FileSystemHost, RuntimeDirEntry } from "ts-morph";
import { FileUtils } from "@ts-morph/common";
import { DirItem } from "@/pages/api/fs/dir";

export class KozmikFileSystemHost implements FileSystemHost {
  private currentDirectory?: string;

  /** @inheritdoc */
  async delete(path: string) {
    return fetch(`/api/fs/remove?path=${encodeURIComponent(path)}`, {
      method: 'POST'
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK')
      })
      .catch(() => {
        throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, path));
      });
  }

  /** @inheritdoc */
  deleteSync(path: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/fs/remove?path=${encodeURIComponent(path)}`, false);
      request.send(null);
    } catch {
      throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, path));
    }
  }

  /** @inheritdoc */
  readDirSync(dirPath: string): RuntimeDirEntry[] {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/dir?path=${encodeURIComponent(dirPath)}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        const dirents: DirItem[] = json && json.items;

        return dirents.map(file => ({
          name: path.join(dirPath, file.name),
          isDirectory: file.isDirectory,
          isFile: !file.isDirectory,
          isSymlink: file.isSymbolicLink
        }));
      }
    } catch { }

    throw new errors.DirectoryNotFoundError(FileUtils.getStandardizedAbsolutePath(this, dirPath));
  }

  /** @inheritdoc */
  async readFile(filePath: string, encoding = "utf-8") {
    return await fetch(`/api/fs/file?path=${encodeURIComponent(filePath)}&options={"encoding":"${encodeURIComponent(encoding)}"}`, {
      method: 'GET'
    })
      .then(async (response: Response) => {
        const json = await response.json();

        if (!response.ok)
          throw new Error(json && json.error || 'Network response was not OK');

        return json && json.data;
      })
      .catch(() => {
        throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, filePath));
      });
  }

  /** @inheritdoc */
  readFileSync(filePath: string, encoding = "utf-8") {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/file?path=${encodeURIComponent(filePath)}&options={"encoding":"${encodeURIComponent(encoding)}"}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.data;
      }
    } catch { }

    throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, filePath));
  }

  /** @inheritdoc */
  async writeFile(filePath: string, fileText: string) {
    await fetch(`/api/fs/file?path=${encodeURIComponent(filePath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: fileText })
    });
  }

  /** @inheritdoc */
  writeFileSync(filePath: string, fileText: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/fs/file?path=${encodeURIComponent(filePath)}`, false);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify({ data: fileText }));
    } catch { }
  }

  /** @inheritdoc */
  mkdir(dirPath: string) {
    return fetch(`/api/fs/dir?path=${dirPath}`, {
      method: 'POST'
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** @inheritdoc */
  mkdirSync(dirPath: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/fs/dir?path=${dirPath}`, false);
      request.send(null);
    } catch (e) {
      console.error(e);
    }
  }

  /** @inheritdoc */
  move(srcPath: string, destPath: string) {
    return fetch(`/api/fs/rename?path=${encodeURIComponent(srcPath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPath: destPath })
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** @inheritdoc */
  moveSync(srcPath: string, destPath: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/fs/rename?path=${encodeURIComponent(srcPath)}`, false);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify({ newPath: destPath }));
    } catch (e) {
      console.error(e);
    }
  }

  /** @inheritdoc */
  copy(srcPath: string, destPath: string) {
    return fetch(`/api/fs/copy?path=${encodeURIComponent(srcPath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPath: destPath })
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** @inheritdoc */
  copySync(srcPath: string, destPath: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('POST', `/api/fs/copy?path=${encodeURIComponent(srcPath)}`, false);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify({ newPath: destPath }));
    } catch (e) {
      console.error(e);
    }
  }

  /** @inheritdoc */
  async fileExists(filePath: string) {
    return fetch(`/api/fs/exists?path=${encodeURIComponent(filePath)}`, {
      method: 'GET'
    })
      .then(async (response: Response) => {
        const json = await response.json();

        if (!response.ok)
          throw new Error(json && json.error || 'Network response was not OK');

        return json && json.exists;
      })
      .catch(() => {
        throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, filePath));
      });
  }

  /** @inheritdoc */
  fileExistsSync(filePath: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/exists?path=${encodeURIComponent(filePath)}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.exists;
      }
    } catch { }

    throw new errors.FileNotFoundError(FileUtils.getStandardizedAbsolutePath(this, filePath));
  }

  /** @inheritdoc */
  async directoryExists(dirPath: string) {
    return fetch(`/api/fs/exists?path=${encodeURIComponent(dirPath)}`, {
      method: 'GET'
    })
      .then(async (response: Response) => {
        const json = await response.json();

        if (!response.ok)
          throw new Error(json && json.error || 'Network response was not OK');

        return json && json.exists;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** @inheritdoc */
  directoryExistsSync(dirPath: string): boolean {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/exists?path=${encodeURIComponent(dirPath)}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.exists;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  /** @inheritdoc */
  realpathSync(path: string) {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/realpath?path=${encodeURIComponent(path)}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.path;
      }
    } catch (e) {
      console.error(e);
    }

    return path;
  }

  /** @inheritdoc */
  getCurrentDirectory(): string {
    if (this.currentDirectory === undefined)
      try {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/cwd', false);
        request.overrideMimeType("text/plain; charset=UTF-8");
        request.send(null);

        if (request.status === 200) {
          return this.currentDirectory = request.responseText;
        }
      } catch (e) {
        console.error(e);
      }

    return this.currentDirectory || "/";
  }

  /** @inheritdoc */
  glob(patterns: ReadonlyArray<string>): Promise<string[]> {
    return fetch(`/api/fs/glob?patterns=${encodeURIComponent(backSlashesToForward(JSON.stringify(patterns)))}`, {
      method: 'GET'
    })
      .then(async (response: Response) => {
        const json = await response.json();

        if (!response.ok)
          throw new Error(json && json.error || 'Network response was not OK');

        return json && json.paths;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** @inheritdoc */
  globSync(patterns: ReadonlyArray<string>): string[] {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/api/fs/glob?patterns=${encodeURIComponent(backSlashesToForward(JSON.stringify(patterns)))}`, false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.paths as string[];
      }
    } catch (e) {
      console.error(e);
    }

    return [];
  }

  /** @inheritdoc */
  isCaseSensitive() {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', '/api/fs/iscasesensitive', false);
      request.send(null);

      if (request.status === 200) {
        const json = JSON.parse(request.responseText);

        return json && json.isCaseSensitive;
      }
    } catch (e) {
      console.error(e);
    }

    return true;
  }
}

function backSlashesToForward(patterns: string) {
  return patterns.replace(/\\/g, "/"); // maybe this isn't full-proof?
}