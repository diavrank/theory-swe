import { ProfileCollection } from '../../../api/Profiles/Profile';
import { defineComponent } from 'vue';

export default defineComponent({
	meteor: {
		$subscribe: {
			'profiles': []
		},
		profiles() {
			return ProfileCollection.find({}).fetch();
		}
	}
})
