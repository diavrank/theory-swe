import { ProfileCollection } from '../../../api/Profiles/Profile';
import Vue from 'vue';

export default Vue.extend({
	meteor: {
		$subscribe: {
			'profiles': []
		},
		profiles() {
			return ProfileCollection.find({}).fetch();
		}
	}
})
