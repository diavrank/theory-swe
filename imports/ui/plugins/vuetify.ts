import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import { aliases, md } from 'vuetify/iconsets/md';
// @ts-ignore
import { es } from 'vuetify/locale';

export default createVuetify({
	theme: {
		defaultTheme: 'myCustomLightTheme',
		themes: {
			myCustomLightTheme: {
				dark: false,
				colors: {
					primary: '#01697d',
					secondary: '#002744',
					accent: '#8c191d',
					error: '#d64143',
					info: '#5bc0de',
					success: '#5cb85c',
					warning: '#f0ad4e'
				}
			}
		}
	},
	icons: {
		defaultSet: 'md',
		aliases,
		sets: {
			mdi,
			md
		}
	},
	locale: {
		locale: 'es',
		messages: { es }
	}
});
