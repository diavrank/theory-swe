import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {};
	},
	methods: {
		currentLocalDate(): Date {
			const date = new Date();
			const offsetMs = date.getTimezoneOffset() * 60 * 1000;
			const msLocal = date.getTime() - offsetMs;
			return new Date(msLocal);
		},
		currentLocalISODate(): string {
			const iso = this.currentLocalDate().toISOString();
			const isoLocal = iso.substring(0, 10);
			return isoLocal;
		},
		currentStringTime(): string {
			const currentTime = this.currentLocalDate();
			const hours = currentTime.getUTCHours() < 10 ? '0' + currentTime.getUTCHours() : currentTime.getUTCHours();
			const minutes = currentTime.getUTCMinutes() < 10 ? '0' + currentTime.getUTCMinutes() : currentTime.getUTCMinutes();
			const seconds = currentTime.getUTCSeconds() < 10 ? '0' + currentTime.getUTCSeconds() : currentTime.getUTCSeconds();
			return hours + ':' + minutes + ':' + seconds;
		}
	}
});
