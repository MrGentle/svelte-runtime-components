export function runtimeComponentWrapperPlugin(wrapperSource: string) {
    return {
        name: 'virtual-runtime-component-wrapper',
        setup(build: any) {
            build.onResolve({ filter: /^virtual:wrapper$/ }, () => ({ path: 'virtual:wrapper', namespace: 'virtual' }));
            build.onLoad({ filter: /.*/, namespace: 'virtual' }, () => ({ contents: wrapperSource, loader: 'ts' }));
        }
    }
}