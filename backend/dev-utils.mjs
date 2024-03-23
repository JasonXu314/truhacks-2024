import { readdirSync, statSync } from 'fs';

/**
 * Collects files
 * @param {string} path path to walk
 * @returns {string[]} the found files
 */
export function collectDir(path) {
	return readdirSync(path).flatMap((subpath) => {
		if (statSync(`${path}/${subpath}`).isDirectory()) {
			return collectDir(`${path}/${subpath}`);
		} else {
			return [`${path}/${subpath}`];
		}
	});
}

