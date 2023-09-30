<script lang="ts">
    import { extensions } from "../extensions.js";
    import { saveLocalStorage, selected } from "./utils.js";
    let search = "";
    let maxCharNumber = 40;
    let onlyTopLevel = false;
    let ext = [];
    $: ext = extensions
        .filter((oneExt) => (onlyTopLevel ? !oneExt.includes(".") : true))
        .filter((oneExt) => (maxCharNumber > 0 ? oneExt.length <= maxCharNumber : true));
</script>

{#key onlyTopLevel}
    <h2>
        Extensions ({ext.length})
    </h2>
{/key}
<div class="div-input">
    <input type="text" class="input" bind:value={search} placeholder="Search extension" />
    <input
        type="checkbox"
        bind:checked={onlyTopLevel}
        on:input={() => {
            saveLocalStorage("only-top-level", onlyTopLevel);
            onlyTopLevel = !onlyTopLevel;
            $selected = $selected.filter((oneExt) => (onlyTopLevel ? !oneExt.includes(".") : true));
            saveLocalStorage("selected-extensions", $selected);
        }}
    />
    Only top level
    <input type="number" class="input" bind:value={maxCharNumber} min={2} placeholder="Max char number" />
</div>
<div class="extensions-list">
    {#each $selected
        .sort()
        .filter((oneExt) => (onlyTopLevel ? !oneExt.includes(".") : true))
        .filter((oneExt) => (maxCharNumber > 0 ? oneExt.length <= maxCharNumber : true))
        .filter( (oneExt) => (search !== "" ? (search.startsWith(".") ? oneExt.includes(search.substring(1)) : oneExt.includes(search)) : true) ) as oneSelected}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="one-extension"
            class:selected={$selected.includes(oneSelected)}
            on:click={() => {
                const newArr = $selected.filter((oneExt) => {
                    return oneExt !== oneSelected;
                });
                $selected = newArr;
                saveLocalStorage("selected-extensions", $selected);
            }}
        >
            .{oneSelected}
        </div>
    {/each}
    {#each ext.filter( (oneExt) => (search !== "" && !$selected.includes(oneExt) ? (search.startsWith(".") ? oneExt.includes(search.substring(1)) : oneExt.includes(search)) : !$selected.includes(oneExt)) ) as extension}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="one-extension"
            on:click={() => {
                $selected = [...$selected, extension];
                saveLocalStorage("selected-extensions", $selected);
            }}
        >
            .{extension}
        </div>
    {/each}
</div>

<style>
    h2 {
        text-align: center;
    }
    .div-input {
        width: 100%;
        padding: 10px;
    }
    .input:focus-visible {
        outline: none;
    }
    .input {
        width: 100%;
        margin: 10px 0px;
    }
    .one-extension {
        cursor: pointer;
    }
    .selected {
        background-color: lightgreen;
    }
    .extensions-list {
        height: 70vh;
        overflow-y: scroll;
        padding: 10px;
    }
</style>
