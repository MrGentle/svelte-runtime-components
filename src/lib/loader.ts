export const mountComponent = async (code: string, ref: HTMLElement, props?: object) => {
    const url = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
    const module = await import(/* @vite-ignore */ url);
    return await module.default(ref, props);
}