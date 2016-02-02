
import SansSel from "./SansSel";

export { default as merge } from "./merge";
export { default as SansSel } from "./SansSel";
export { default as Backend } from "./Backend";

export default function sansSel(options) {
    return new SansSel(options);
}
