export { compileModule } from "./compiler.ts"
export { mountComponent } from "./loader.ts"

export interface RuntimeComponent{
    component: object,
    name: string,
    props: object,
    destroy: () => void,
    setProps: (props: object) => void
}

export interface ComponentBuildOptions {
    moduleIdentifier?: string,
    minify?: boolean,
    treeShaking?: boolean,
    customWrapper?: string
}