export default `
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
            hydrate(ComponentBody, {
                target,
                props
            });
        }
    };
};`

