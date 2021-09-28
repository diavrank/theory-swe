export default {
	currentStringTime() {
		const currentTime = this.currentLocalDate();
		const hours = currentTime.getUTCHours() < 10 ? '0' + currentTime.getUTCHours() : currentTime.getUTCHours();
		const minutes = currentTime.getUTCMinutes() < 10 ? '0' + currentTime.getUTCMinutes() : currentTime.getUTCMinutes();
		const seconds = currentTime.getUTCSeconds() < 10 ? '0' + currentTime.getUTCSeconds() : currentTime.getUTCSeconds();
		return hours + ':' + minutes + ':' + seconds;
	},
	currentLocalDate() {
		const date = new Date();
		const offsetMs = date.getTimezoneOffset() * 60 * 1000;
		const msLocal = date.getTime() - offsetMs;
		const dateLocal = new Date(msLocal);
		return dateLocal;
	},
	currentLocalISODate() {
		const iso = this.currentLocalDate().toISOString();
		const isoLocal = iso.substring(0, 10);
		return isoLocal;
	},
	lastLocalISODate() {
		const dateLocal = this.currentLocalDate();
		dateLocal.setDate(dateLocal.getDate() - 1);
		const iso = dateLocal.toISOString();
		const isoLocal = iso.substring(0, 10);
		return isoLocal;
	},
	/**
	 * Generate a random number between given params
	 * @param min Minimum number
	 * @param max Maximum number
	 * @returns {number}
	 */
	generateNumberToken(min: number, max: number) {
		return Math.floor(Math.random() * ((max + 1) - min) + min);
	}
};
