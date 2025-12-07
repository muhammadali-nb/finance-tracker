import { TieredMenuDesignTokens } from "@primeuix/themes/types/tieredmenu";
import { TieredMenuPassThroughOptions } from "primevue";

export const tieredConfig = (): TieredMenuDesignTokens => {
    return {
        item: {
            padding: '0.8rem 1.6rem',
        }
    }
};

export const tieredMenuPt = (): TieredMenuPassThroughOptions => {
    return {
        itemLabel: {
            class: 'font-12-r',
        }
    };
};
