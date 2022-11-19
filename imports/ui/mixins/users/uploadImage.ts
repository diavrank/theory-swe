import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {
			file: [],
			photoFileUser: null
		};
	},
	watch: {
		file(newFiles: Array<File>) {
			if (newFiles && typeof (FileReader) != 'undefined') {
				const newFile = newFiles[0];// TODO: Possible Vuetify bug, since it shouldn't be an array because it doesn't have multiple property
				const reader = new FileReader();
				reader.onload = function(ev: any) {
					this.user.profile.path = ev.target.result;
					this.photoFileUser = ev.target.result;
				}.bind(this);
				reader.readAsDataURL(newFile);
			}
		}
	},
	methods: {
		onClickUploadButton() {
			let fileUpload = document.getElementById('fileUpload')
			if (fileUpload != null) {
				fileUpload.click()
			}
		}
	}
});