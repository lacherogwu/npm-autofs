import { generateFile, generateIndex, writeInFile } from '../src/index.js';

await generateIndex('./test/components', true);

await generateFile('./test/newFile.js', {
	imports: [
		{
			path: 'dotenv/config',
		},
	],
	defaultExports: {
		nodeEnv: `'development'`,
		port: `'3000'`,
		item: 'process.env.ITEM',
	},
});

await writeInFile('./test/writeInsideMe.js', [`const alibaba = 123;`, `const testMe = 'Testing';`]);
