<script>
	import { extra, params, path, route, user } from '$meta';

	export let __meta, __props, __route;

	$route = __meta.route;
	$path = __meta.path;
	$params = __meta.params;
	$user = __meta.user;
	$extra = __meta.extra;
</script>

<svelte:component this={__route} {...__props}></svelte:component>
