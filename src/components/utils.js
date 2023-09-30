import { writable } from "svelte/store";

export const fromLocalStorage = (key, defaultValue) => {
    const json = localStorage.getItem(key);
    if (json) {
        return JSON.parse(json);
    }
    return defaultValue;
};

let cartId;

export const getCartId = () => cartId;
export const setCartId = (c) => (cartId = c);

export const saveLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const results = writable({});
export const selected = writable(fromLocalStorage("selected-extensions", []));

export const getDomain = (domain, cartId) =>
    fetch(`https://api.ovh.com/1.0/order/cart/${cartId}/domain?domain=${domain}`).then(async (resp) => {
        const decoded = await resp.json();
        results.update((currResults) => {
            return {
                ...currResults,
                [domain]:
                    decoded.length === 0
                        ? [
                              {
                                  action: "unavailable",
                                  prices: [],
                              },
                          ]
                        : decoded,
            };
        });
    });
