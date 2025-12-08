import lock from "../../package-lock.json" with { type: "json" };
import { compileModule } from "@mrgentle/svelte-runtime-components/compiler"

 const template = `
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
    `;

export const load = async () => {    
    const { client } = await compileModule(template, lock.packages['node_modules/svelte'].version);

    return {
        clientModule: client
    };
}