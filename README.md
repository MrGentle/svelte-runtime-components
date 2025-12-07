
This library enables compiling Svelte components **from text at runtime**, allowing dynamic, user-provided svelte component code to be compiled and mounted in the browser.

```html
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

The above code is an example of a component that can be loaded at runtime.

---

### Installation
`npm install @mrgentle/svelte-runtime-components`

---

### Core Runtime Compiler

`compileModule(code: string, svelteVersion: string, buildOptions?: ComponentBuildOptions)`

- Uses the official `svelte/compiler` to compile component source code.
- Bundles the compiled output using **esbuild** and wraps the component with a standard mount/hydration interface.

Returns a `.client` JavaScript module as a string, ready to execute in the browser via dynamic `import()`.

---

### Mount the compiled component

`mountComponent(code: string, ref: HTMLElement, props?: object)`

A lightweight browser utility that loads the compiled module string as an ES module using `import()`.

Returns a wrapped component

---

### Wrappers

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

You can write your own wrappers for use with compileModule
Just make sure you include this line so that the esbuild plugin finds the component body:

`import ComponentBody from 'component-body';`

