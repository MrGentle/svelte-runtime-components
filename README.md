# Svelte runtime components

This library enables compiling Svelte components **from text at runtime**, allowing dynamic, user-provided svelte component code to be compiled and mounted in the browser.

```svelte
<script lang="ts">
	let { counter } = $props();
    console.log("Component loaded");
</script>


<div class="component">
	<h2 class="title">Clicked {counter} times</h2>
</div>

<style>
    .component {
        display: flex;
        justify-content: center;
    }
	.title {
		color: #333333;
	}
</style>
```

The above code is an example of a string that can be compiled and loaded at runtime.


## Installation
```
npm install @mrgentle/svelte-runtime-components
```

## Core Runtime Compiler example
Compile code on the server:
```ts
//+page.server.ts
import lock from "../../package-lock.json" with { type: "json" };
import { compileModule } from "@mrgentle/svelte-runtime-components/compiler"

 const template = `
        <script lang="ts">
		...
    `;

export const load = async () => {    
    const { client } = await compileModule(template, lock.packages['node_modules/svelte'].version);

    return {
        clientModule: client
    };
}
```

- Uses the official `svelte/compiler` to compile component source code.
- Bundles the compiled output using **esbuild** and wraps the component with a standard mount/hydration interface.

compileModule returns a client es6 module as a string, ready to execute in the browser via dynamic `import()`.

## Mount the compiled module in browser:
```svelte
<!-- +page.svelte -->

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

<div bind:this={mountRef}></div>
```

mountComponent is a lightweight browser utility that loads the compiled module string as an ES module using `import()`.

Returns a wrapped RuntimeComponent.

## Wrappers
This is the built-in wrapper
```ts
import ComponentBody from 'component-body';
import { hydrate, mount, unmount } from "svelte";

export default function factory(target: HTMLElement, props: object) {
    const component = mount(ComponentBody, { target, props });

    return {
        component,
        name: "RuntimeComponent",
        props,
        destroy: () => unmount(component),
        setProps: (props: object) => {
            hydrate(ComponentBody, { target, props });
        }
    };
};
```

The wrapper exposes setProps which allows you to hydrate the component with new props.

You can write your own wrappers for use with compileModule
Just make sure you include this line so that the esbuild plugin finds the component body:

`import ComponentBody from 'component-body';`

## Thanks
Huge thanks to mateothgreat for his help https://github.com/mateothegreat/svelte-dynamic-component-engine/tree/v2

