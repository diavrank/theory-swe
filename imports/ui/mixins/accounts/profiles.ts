import { defineComponent } from 'vue';
import { ProfileCollection } from '../../../api/Profiles/profile.collection';

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
