
import { defineComponent } from 'vue';
import { ProfileCollection } from '/imports/api/Profiles/ProfileCollection';

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
