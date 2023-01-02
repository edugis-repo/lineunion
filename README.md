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
        coordinates: [
            [4.5112985372543335,51.93054627470241],
            [4.5360177755355835,51.937320111808276],
            [4.537353515625,51.936757869326385]
        ]
    },
    properties: {}
};
const linestring2 = {
    type:"Feature", 
    geometry: {
        type: "LineString",
        coordinates: [
            [4.515380859375,51.93166429288598],
            [4.5360177755355835,51.937320111808276],
            [4.549922347068787,51.93149890733616],
            [4.564771056175232,51.93779635875168]
        ]
    },
    properties: {}
};

const union = lineUnion(linestring1, linestring2);


```



