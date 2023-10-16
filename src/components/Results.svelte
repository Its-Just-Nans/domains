<script>
    import { getDomain, results, getCartId } from "./utils.js";
    let threshold = 20;
    let res = {};
    $: res = Object.entries($results)
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce((acc, current) => {
            const [domain, value] = current;
            let priceDefault;
            let priceRenew;
            let priceTotal;
            let type;
            let error = true;
            if (value.length > 0 && value[0].action) {
                error = false;
                type = value[0].action || "error";
                if (value[0].prices && value[0].prices.length > 0) {
                    priceDefault =
                        value[0].prices.find((onePrice) => onePrice.label === "PRICE")?.price.value ?? "error";
                    priceRenew = value[0].prices.find((onePrice) => onePrice.label === "RENEW")?.price.value ?? "error";
                    priceTotal = value[0].prices.find((onePrice) => onePrice.label === "TOTAL")?.price.value ?? "error";
                }
            }
            return {
                ...acc,
                [domain]: {
                    priceDefault,
                    priceRenew,
                    priceTotal,
                    type,
                    error,
                },
            };
        }, {});
</script>

<h2>Results</h2>
<div class="flex">
    <span>Max price</span>
    <input type="number" class="input" bind:value={threshold} placeholder="Max price" />
</div>
<div class="wrap-table">
    <table>
        <thead>
            <tr>
                <th>Domain</th>
                <th>Type</th>
                <th>Price</th>
                <th>Renew</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(res) as [domain, value]}
                <tr
                    class:green={value.type === "create" && value.priceTotal < threshold}
                    class:red={value.type === "unavailable"}
                    class:blue={value.type === "transfer"}
                >
                    <td>
                        {#if value.type !== "create"}
                            <a href={`https://${domain}`}>{domain}</a>
                        {:else}
                            {domain}
                        {/if}
                    </td>
                    {#if !value.error}
                        {#if value.type === "unavailable"}
                            <td class="align" colspan="3">{value.type}</td>
                        {:else}
                            <td>{value.type}</td>
                            <td class="align">
                                <a
                                    href={`https://www.ovh.com/fr/order/webcloud/?#/webCloud/domain/select?domain=${domain}`}
                                    target="_blank"
                                >
                                    {value.priceTotal}
                                    {#if value.priceDefault === value.priceTotal}
                                        <span />
                                    {:else if value.priceDefault < value.priceTotal}
                                        <span class="span-infos">(fee)</span>
                                    {:else}
                                        <span class="span-infos">(discount)</span>
                                    {/if}
                                </a>
                            </td>
                            <td
                                class:orange={value.type === "create" &&
                                    value.priceTotal < threshold &&
                                    value.priceRenew > threshold}>{value.priceRenew}</td
                            >
                        {/if}
                    {:else}
                        <td
                            class="align"
                            colspan="3"
                            on:click={() => {
                                getDomain(domain, getCartId());
                            }}
                        >
                            <span>
                                <a
                                    href={`https://www.ovh.com/fr/order/webcloud/?#/webCloud/domain/select?domain=${domain}`}
                                    target="_blank"
                                    >error
                                </a>
                            </span>
                            <span class="retry">(retry)</span>
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .flex {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .flex > * {
        flex: 1;
    }
    .retry {
        cursor: pointer;
    }
    .blue {
        background-color: lightblue;
    }
    .orange {
        background-color: orange;
    }
    .span-infos {
        font-size: 0.8em;
    }
    .input:focus-visible {
        outline: none;
    }
    .input {
        width: 100%;
        margin: 10px 0px;
    }
    .red {
        background-color: lightcoral;
    }
    .align {
        text-align: center;
    }
    .green {
        background-color: lightgreen;
    }
    h2 {
        text-align: center;
    }
    table {
        width: 100%;
    }
    .wrap-table {
        height: 80vh;
        overflow-y: scroll;
    }
</style>
