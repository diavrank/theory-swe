export const initials = (value: string, quantity: number) => {
	let initials = '';
	if (value) {
		const words = value.split(' ');
		initials = words.reduce((acc, word) => {
			return acc.length < quantity ? acc + word[0] : acc;
		}, '');
	}
	return initials.toUpperCase();
};
