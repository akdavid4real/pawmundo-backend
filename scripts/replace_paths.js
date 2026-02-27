const fs = require('fs');
const path = require('path');

function replaceAliasesWithRelative(dirName) {
    const files = fs.readdirSync(dirName);
    files.forEach(file => {
        const fullPath = path.join(dirName, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceAliasesWithRelative(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Simple regex for imports: import { ... } from '@modules/...'
            const regex = /from ['"](@modules|@common|@config|@)\/(.*)['"]/g;

            content = content.replace(regex, (match, p1, p2) => {
                let targetSrcPath = '';
                if (p1 === '@modules') targetSrcPath = 'src/modules/' + p2;
                else if (p1 === '@common') targetSrcPath = 'src/common/' + p2;
                else if (p1 === '@config') targetSrcPath = 'src/config/' + p2;
                else if (p1 === '@') targetSrcPath = 'src/' + p2;

                // Now compute relative path from current file to targetSrcPath
                const absoluteTarget = path.resolve(process.cwd(), targetSrcPath);
                const absoluteCurrentDir = path.dirname(path.resolve(process.cwd(), fullPath));
                let relativePath = path.relative(absoluteCurrentDir, absoluteTarget);

                // Ensure it starts with ./ or ../
                if (!relativePath.startsWith('.')) {
                    relativePath = './' + relativePath;
                }
                // Normalize slashes for imports
                relativePath = relativePath.replace(/\\/g, '/');

                return `from '${relativePath}'`;
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated paths in ${fullPath}`);
            }
        }
    });
}

replaceAliasesWithRelative('src');
replaceAliasesWithRelative('api');

console.log('Done!');
