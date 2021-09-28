export default {
	data(){
		return {
			file: null,
			photoFileUser: null
		}
	},
	watch:{
		file(newFile) {
			if (newFile && typeof (FileReader) != 'undefined') {
				const reader = new FileReader();
				reader.onload = function(ev) {
					this.user.profile.path = ev.target.result;
					this.photoFileUser = ev.target.result;
				}.bind(this);
				reader.readAsDataURL(newFile);
			}
		}
	},
	methods:{
		onClickUploadButton() {
			this.$refs.imageFile.$refs.input.click();
		}
	}
}