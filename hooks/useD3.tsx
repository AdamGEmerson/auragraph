import React from 'react';
import * as d3 from 'd3-selection';

//@ts-ignore
export const useD3 = (renderChartFn, dependencies) => {
    const ref = React.useRef();

    React.useEffect(() => {
        //@ts-ignore
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
}