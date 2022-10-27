import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const cwd = path.resolve(__dirname, '..');
const sourceDir = path.resolve(cwd, 'src');
const tempDir = path.resolve(cwd, '.tmp');
const outDir = path.resolve(cwd, 'dist');

fsExtra.emptyDirSync(tempDir);
fsExtra.emptyDirSync(outDir);

for (const file of fsExtra.readdirSync(sourceDir)) {
    console.log(file);
    const src = path.resolve(sourceDir, file);
    const dest = path.resolve(outDir, file.replace(/\.svg$/, '.png'));
    //export the original image
    doExport(src, dest, false);

    //export a transparent version
    doExport(src, dest.replace(/\.png$/, '-transparent.png'), true);
}

function doExport(src: string, dest: string, transparent: boolean) {
    execSync([
        `inkscape`,
        transparent ? `--export-background-opacity=0` : '',
        `--export-width=1200`,
        `--export-filename="${dest}"`,
        `"${src}"`,
    ].join(' '), { stdio: 'inherit' });
}