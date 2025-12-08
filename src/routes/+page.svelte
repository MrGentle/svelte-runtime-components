<script lang="ts">
	import { mountComponent, type RuntimeComponent } from '$lib/loader.js';
	import { onMount } from 'svelte';

    let { data } = $props();
    let mountRef: HTMLElement;
    let dynamicComponent: RuntimeComponent;
    let counter = $state(0);

    onMount(async () => {
        dynamicComponent = await mountComponent(data.clientModule, mountRef, { counter });
    })
</script>

<h3>Dynamic component rendering:</h3>
<div style="border: 1px solid #333; padding: 5px; border-radius: 5px;">
    <div bind:this={mountRef}></div>
</div>
<br>
<button onclick={() => { dynamicComponent && dynamicComponent.setProps({ counter: ++counter }) }}>Increment counter</button>
