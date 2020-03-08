export const pick = (object, ...props) => {
	const accumulator = {};
	for (const prop of props) {
		accumulator[prop] = object[prop];
	}
	return accumulator;
};
