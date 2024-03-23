import App from '__app.svelte';
import Route from '__route.svelte';

new App({ target: document.body, hydrate: true, props: { __props: window.__INITIAL_PROPS, __meta: window.__ROUTE_META, __route: Route } });
delete window.__INITIAL_PROPS;
delete window.__ROUTE_META;
document.getElementById('__init_script__').remove();

