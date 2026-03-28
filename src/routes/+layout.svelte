<script lang="ts">
	import '../app.css';
	import { ensureMigrated } from '$lib/utils/store.js';

	ensureMigrated();

	let { children } = $props();
</script>

{@render children()}
