/**
 *
 * @param {Array} items
 * @param {boolean} isDefault
 * @returns {string}
 */
const exportWrap = (items, isDefault) => {
	const header = `export ${isDefault ? 'default ' : ''}{`;
	const body = items.join(',\n\t');
	const footer = '};';

	return `${header}\n\t${body}\n${footer}`;
};

/**
 *
 * @param {number} number - Amount of tabs to generate
 * @returns {string} Tabs
 */
const genTabs = number => Array.from({ length: number }).reduce(acc => (acc += '\t'), '');

export { exportWrap, genTabs };
