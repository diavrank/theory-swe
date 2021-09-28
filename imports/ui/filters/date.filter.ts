import Vue from 'vue';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

Vue.use(VueFilterDateFormat, {
	dayOfWeekNames: [
		'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves',
		'Viernes', 'Sábado'
	],
	dayOfWeekNamesShort: [
		'Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'
	],
	monthNames: [
		'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
	],
	monthNamesShort: [
		'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
		'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'
	]
});
