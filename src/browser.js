/*eslint-env browser*/

import merge from "./merge";
import SansSel from "./SansSel";
import Backend from "./Backend";

export default function sansSel(options) {
    return new SansSel(options);
}

sansSel.merge = merge;
sansSel.SansSel = SansSel;
sansSel.Backend = Backend;
