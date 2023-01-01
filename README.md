### LineUnion
Unions two linestrings into a single linestring (equivalent to sql function 'st_union' or polygon-only turf.union).

Line unions are troublesome because of floating point rounding errors while calculating if a given point is exactly on a given line segment.

## requirements
node
npm

## usage
```bash
npm install @edugis/lineunion
```
```javascript
import lineUnion from '@edugis/lineunion';

const linestring1 = {
    type:"Feature", 
    geometry: {
        type: "LineString",
        coordinates: []
    },
    properties: {}
};
const linestring2 = {
    type:"Feature", 
    geometry: {
        type: "LineString",
        coordinates: []
    },
    properties: {}
};

const union = lineUnion(linestring1, linestring2);


```



