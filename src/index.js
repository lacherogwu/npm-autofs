import fs from 'fs/promises';

const exportWrap = (items, isDefault) => {
	const header = `export ${isDefault ? 'default ' : ''}{`;
	const body = items.join(',\n\t');
	const footer = '};';

	return `${header}\n\t${body}\n${footer}`;
};

const generateImportsText = imports => {
	if (!imports) return;

	const mapped = imports.map(item => {
		let data = 'import ';
		if (item.name) data += `${item.name} from `;
		data += `'${item.path}';`;
		return data;
	});

	return mapped.join('\n');
};

const generateExportsText = exports => {
	if (!exports) return;

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

const generateDefaultExportsText = defaultExports => {
	if (!defaultExports) return;

	const entries = Object.entries(defaultExports);

	const mapped = entries
		.map(([key, value]) => {
			if (!(key && value)) return;
			return `${key}: ${value}`;
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

export { generateFile };
