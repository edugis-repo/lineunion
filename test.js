import fs from 'fs';
import lineUnion from './index.js';

function segementCompare(seg1, seg2, tolerance = 0.000000001 ) {
    const xdiff1 = seg1[1][0] - seg1[0][0];
    const xdir1 = xdiff < tolerance ? -1 : xdiff > -tolerance ? +1 : 0;
    const ydiff1 = seg1[1][1] - seg1[0][1];
    const ydir1 = ydiff < tolerance ? -1 : ydiff > -tolerance ? +1 : 0;
}

// https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
function lineDistance(line, point) {
    const [x1, y1] = line[0];
    const [x2, y2] = line[1];
    const [x0,y0] = point;
    const denominator = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 -y1));
    if (denominator > 0) {
        const numerator = Math.abs((x2 - x1)*(y1-y0) - (x1 - x0)*(y2-y1));
        const dist =  numerator / denominator;
        return dist;
    }
    const dist = Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
    return dist;
}


/*
  //https://stackoverflow.com/a/1501725/2027237
  function sqr(x) { return x * x }
  function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
  function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x),
                      y: v.y + t * (w.y - v.y) });
  }
  function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
*/

function lineCompare(line1, line2) {
    const lineSegments1 = [];
    const lineSegments2 = [];
    for (let segment = 0; segment < line1.length - 1; segment++) {
        for (let pointIndex = 0; pointIndex < line2.length; pointIndex++) {
            const dist = lineDistance([line1[segment], line1[segment+1]], line2[pointIndex]);
            const dist2 = pDistance(line2[pointIndex][0], line2[pointIndex][1], line1[segment][0], line1[segment][1], line1[segment+1][0], line1[segment+1][1]);
            //const dist3 = distToSegment({x:line2[pointIndex][0], y:line2[pointIndex][1]}, {x:line1[segment][0],y:line1[segment][1]},{x:line1[segment+1][0],y:line1[segment+1][1]});
            console.log(`segment: ${segment}, point: ${pointIndex}, dist: ${dist}, dist2: ${dist2}, dist3: ${dist3}`);
        }
    }
}


function main() {
    let data = JSON.parse(fs.readFileSync('lines.json'));
    const lines = [];
    for (const feature of data.features) {
        lines.push(feature);
    }
    const result = lineUnion(lines[0], lines[1]);
    fs.writeFileSync('result.json', JSON.stringify(result));
    console.log(result);
    data = JSON.parse(fs.readFileSync('renderedfeatures.json'));
    const multilines = data.features.filter(feature=>feature.properties.id === 1 || feature.properties.id === 4);
    const multilineResult = lineUnion(multilines[0], multilines[1]);
    fs.writeFileSync('multilineresult.json', JSON.stringify(multilineResult));
    console.log(result);
    
}


main()