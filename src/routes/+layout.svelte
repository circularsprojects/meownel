<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/cat.webp';
	import { Toaster } from 'svelte-sonner';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors theme="dark" />
{@render children()}
