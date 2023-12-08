
import { defineComponent } from 'vue';
import { ProfileCollection } from '@api/Profiles/ProfileCollection';

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
