import fs from 'fs/promises';
import glob from 'glob';
import { exportWrap, genTabs } from './utils.js';

/**
 *
 * @param {Array} imports
 * @returns {string}
 */
const generateImportsText = imports => {
	if (!imports?.length) return;

	const mapped = imports.map(item => {
		let data = 'import ';
		if (item.name) data += `${item.name} from `;
		data += `'${item.path}';`;
		return data;
	});

	return mapped.join('\n');
};

/**
 *
 * @param {Array} exports
 * @returns {string}
 */
const generateExportsText = exports => {
	if (!exports?.length) return;

	const mapped = exports
		.map(item => {
			if (!item.name) return;
			let data = item.name;
			if (item.as) data += ` as ${item.as}`;
			return data;
		})
		.filter(Boolean);

	return exportWrap(mapped, false);
};

/**
 *
 * @param {Object} defaultExports
 * @returns {string}
 */
const generateDefaultExportsText = defaultExports => {
	if (!defaultExports || Object.keys(defaultExports).length === 0) return;

	const entries = Object.entries(defaultExports);

	const mapped = entries
		.map(([key, value]) => {
			if (!(key && value)) return;
			const output = key === value ? key : `${key}: ${value}`;
			return output;
		})
		.filter(Boolean);

	return exportWrap(mapped, true);
};

/**
 * Generates a file from a settings object
 * @param {string} writePath - The write path |  e.g. './src/config/index.js'
 * @param {Object} settings - The file builder settings
 * @param {{ path: string, name?: string }[]} settings.imports - The file imports
 * @param {Array} settings.body - The file body
 * @param {{ name: string, as?: string }[]} settings.exports - The file exports
 * @param {Object.<string, string>} settings.defaultExports - The file default exports
 * @returns {Promise} Returns the text file created as a string
 */
const generateFile = async (writePath, { imports, body, exports, defaultExports }) => {
	const importsText = generateImportsText(imports);

	const exportsText = generateExportsText(exports);

	const defaultExportsText = generateDefaultExportsText(defaultExports);

	const spaces = '\n\n';
	const data = [importsText, exportsText, defaultExportsText].filter(Boolean).join(spaces);
	await fs.writeFile(writePath, data);

	return data;
};

/**
 *
 * @param {string} path - The path to the folder | e.g. './src/components'
 * @param {boolean} [isExportDefault=true] - Weather to use 'export' or 'default export'
 * @returns {Promise} Returns the text file created as a string
 */
const generateIndex = async (path, isExportDefault = true) => {
	const dirFiles = glob.sync(`${path}/!(index.js|_*)`);

	const defaultExports = {};
	const exports = [];

	const imports = dirFiles.map(item => {
		const file = item.split('/').pop();
		const [fileName] = file.split('.');

		isExportDefault ? (defaultExports[fileName] = fileName) : exports.push({ name: fileName });

		return { name: fileName, path: `./${file}` };
	});

	const data = await generateFile(`${path}/index.js`, {
		imports,
		defaultExports,
		exports,
	});

	return data;
};

/**
 * The ability to insert lines of code into a file.
 * Add '// ### START DYNAMIC CONTENT ###'
 * and '// ### END DYNAMIC CONTENT ###'
 * to the file you want to write in
 * @param {string} path - The path to the file to write in | e.g. './src/services/writeHere.js'
 * @param {string[]} content - Lines of code to write
 * @param {number} [tabs=0] - The amount of tabs each line needed
 * @returns {Promise}
 */
const writeInFile = async (path, content) => {
	const genTag = string => `// ### ${string} DYNAMIC CONTENT ###`;
	const fileContent = await fs.readFile(path, 'utf-8');

	const lastItem = content[content.length - 1];
	const countTabs = (lastItem.match(/\t/g) || []).length;

	const regexp = new RegExp(`(${genTag('START')})([\\s\\S]*?)(${genTag('END')})`, 'gm');
	const replaceContent = [genTag('START'), ...content, `${genTabs(countTabs)}${genTag('END')}`];
	const output = fileContent.replace(regexp, replaceContent.join('\n'));

	await fs.writeFile(path, output);
};

export { generateFile, generateIndex, writeInFile };
