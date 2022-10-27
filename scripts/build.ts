import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const cwd = path.resolve(__dirname, '..');
const sourceDir = path.resolve(cwd, 'src');
const tempDir = path.resolve(cwd, '.tmp');
const outDir = path.resolve(cwd, 'dist');

fsExtra.emptyDirSync(tempDir);
fsExtra.emptyDirSync(outDir);

for (let file of fsExtra.readdirSync(sourceDir)) {
    const src = path.resolve(sourceDir, file);
    //copy the svg file over directly
    fsExtra.copyFileSync(src, path.resolve(outDir, file));
    file = file.replace(/\.svg$/, '.png');
    console.log(file);
    //export the original image
    doExport({
        src,
        dest: path.resolve(outDir, file),
        transparent: false
    });

    file = file.replace(/\.png$/, '-transparent.png');
    console.log(file);
    //export a transparent version
    doExport({
        src,
        dest: path.resolve(outDir, file),
        transparent: true
    });
}

function doExport(options: { src: string; dest: string; transparent?: boolean; width?: number }) {
    execSync([
        `inkscape`,
        options.transparent ? `--export-background-opacity=0` : '',
        `--export-width=${options.width ?? 1200}`,
        `--export-filename="${options.dest}"`,
        `"${options.src}"`,
    ].join(' '), { stdio: 'inherit' });
}