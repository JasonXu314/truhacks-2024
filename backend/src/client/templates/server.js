import App from '__app.svelte';
import Route from '__route.svelte';

export default {
	render: (__props, __meta) => App.render({ __props, __meta, __route: Route })
};

