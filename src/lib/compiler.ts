import { compile } from "svelte/compiler";
import * as esbuild from "esbuild";
import { runtimeComponentBodyPlugin } from "./runtime-component-body-plugin.js";
import { randomUUID } from "node:crypto";
import { runtimeComponentWrapperPlugin } from "./runtime-component-wrapper-plugin.js";
import wrapper from "./wrapper.js";

export interface ComponentBuildOptions {
    moduleIdentifier?: string,
    minify?: boolean,
    treeShaking?: boolean,
    customWrapper?: string
}

export const compileModule = async (code: string, svelteVersion: string, buildOptions: ComponentBuildOptions = { minify: false, treeShaking: true }) => {
    let id = randomUUID();

    const clientCompiledCode = compile(code, {
        filename: buildOptions.moduleIdentifier ? `${buildOptions.moduleIdentifier}.svelte` : `Template_${id}.svelte`,    
        css: "injected"
    });

    const clientBuildRes = await esbuild.build({  
        entryPoints: ["virtual:wrapper"],
        bundle: true,
        outfile: buildOptions.moduleIdentifier ? `${buildOptions.moduleIdentifier}.ts` : `component_${id}.ts`,
        platform: "browser",
        target: "esnext",
        format: "esm",
        minify: buildOptions.minify,
        write: false,
        banner: {
            js: "//Wrapped dynamic component with esbuild"
        },
        
        treeShaking: buildOptions.treeShaking,
        
        external: ["svelte"],
        plugins: [runtimeComponentWrapperPlugin(buildOptions.customWrapper ?? wrapper), runtimeComponentBodyPlugin(clientCompiledCode.js.code, svelteVersion)]
    });
    

    return {
        client: clientBuildRes.outputFiles ? clientBuildRes.outputFiles[0].text : "",
    };
}
