import type { DefineComponent } from 'vue';

declare module '*.vue' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module '@components/*' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module '@views/*' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module '@layouts/*' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
