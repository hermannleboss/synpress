import path from 'node:path'
import { globSync } from 'glob'
import { build } from 'tsup'
import { ensureCacheDirExists } from '../ensureCacheDirExists'
import { FIXES_BANNER } from './compilationFixes'

const OUT_DIR_NAME = 'wallet-setup-dist'

function escapeWindowsFilePath(filePath: string, platform: string) {
  if (platform !== 'win32') return filePath;
  return filePath.replace(/\\/g, '\\\\');
}

export async function compileWalletSetupFunctions(
  walletSetupDir: string,
  debug: boolean
) {
  const outDir = path.join(ensureCacheDirExists(), OUT_DIR_NAME);

  // **Refined Glob Pattern:** 
  const globPattern = path.join(walletSetupDir, '**', '*.setup.{ts,js,mjs}');
  const platform = process.platform
  // Get file paths using glob, ensuring proper path handling
  const fileList = globSync(escapeWindowsFilePath(globPattern, platform));

  if (debug) {
    console.log('[DEBUG] Found the following wallet setup files:');
    console.log(fileList, '\n');
  }

  // TODO: This error message is copied over from another function. Refactor this.
  if (!fileList.length) {
    throw new Error(
      [
        `No wallet setup files found at ${walletSetupDir}`,
        'Remember that all wallet setup files must end with `.setup.{ts,js,mjs}` extension!'
      ].join('\n')
    );
  }
  // TODO: This error message is copied over from another function. Refactor this.
  if (!fileList.length) {
    throw new Error(
      [
        `No wallet setup files found at ${walletSetupDir}`,
        'Remember that all wallet setup files must end with `.setup.{ts,js,mjs}` extension!'
      ].join('\n')
    )
  }

  await build({
    name: 'cli-build',
    silent: true,
    entry: fileList,
    clean: true,
    outDir,
    format: 'esm',
    splitting: true,
    sourcemap: false,
    config: false,
    // TODO: Make this list configurable.
    external: ['@synthetixio/synpress', '@playwright/test', 'playwright-core', 'esbuild', 'tsup'],
    banner: {
      js: FIXES_BANNER
    },
    esbuildOptions(options) {
      // TODO: In this step, if the debug file is present, we should modify `console.log` so it prints from which file the log is coming from.
      // We're dropping `console.log` and `debugger` statements because they do not play nicely with the Playwright Test Runner.
      options.drop = debug ? [] : ['console', 'debugger']
    }
  })

  return outDir
}
