// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
// https://stackoverflow.com/a/6853926/2027237
function pDistance(x, y, x1, y1, x2, y2) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceToSegment(p, s) {
    const [x,y] = p;
    const [[x1,y1],[x2,y2]] = s;
    return pDistance(x,y,x1,y1,x2,y2);
}

// deep clone
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

const pointDistanceToSegments = (point, line) => {
    let minDistance = Number.MAX_VALUE;
    for (let i = 0;  i < line.length - 1; i++) {
        const segment = [line[i],line[i+1]];
        // distance between line1 starting point and line2 segment
        let dist  = distanceToSegment(point, segment);
        if (dist < minDistance) {
            minDistance = dist;
        }
    }
    return minDistance;
}

// union assumptions:
// lines are only unionable if at least one line-ending is on the other line
const lineUnionCoordinates = (line1, line2, tolerance = 0.0001) => {
    const union = [];

    // check if line1 endings are somewhere on line2
    let startDistance = pointDistanceToSegments(line1[0], line2);
    let endDistance = pointDistanceToSegments(line1[line1.length-1], line2);

    if (startDistance <= tolerance && endDistance <= tolerance) {
        // both line1 end-points are on line2, so return line2
        return clone(line2);
    }
    if (startDistance > tolerance && endDistance > tolerance) {
        // both line1 end-points are not on line2
        startDistance = pointDistanceToSegments(line2[0], line1);
        endDistance = pointDistanceToSegments(line2[line2.length-1], line1);
        if (startDistance <= tolerance && endDistance <= tolerance) {
            // both line2 end-points are on line1, so return line1
            return clone(line1);
        }
        if (startDistance > tolerance && endDistance > tolerance) {
            // no line endpoints touch other line, so return empty union
            return union;
        }
        // one of line2 end-points is on line 1, swap line1 and line2
        const temp = line1;
        line1 = line2;
        line2 = temp;
    }
    // one of line1 end-points is on line2
    if (startDistance <= tolerance) {
        line1 = line1.reverse();
    }
    for (let point1 = 0; point1 < line1.length; point1++) {
        if (distanceToSegment(line1[point1], [line2[0],line2[1]]) > tolerance) {
            if (distanceToSegment(line1[point1], [line2[line2.length-2],line2[line2.length-1]]) > tolerance) {
                union.push(line1[point1]);
            } else {
                return clone(union.concat(line2.reverse().slice(1)));
            }
        } else {
            return clone(union.concat(line2.slice(1)));
        }
    }
    return union;
}

export const lineUnion = (line1, line2, tolerance = 0.0001) => {
    if (line1.type && line1.type==='Feature' && line1.geometry && line1.geometry.type && (line1.geometry.type=== 'LineString' || line1.geometry.type==='MultiLineString')) {
        if (line2.type && line2.type==='Feature' && line2.geometry && line2.geometry.type && (line2.geometry.type=== 'LineString' || line2.geometry.type==='MultiLineString')) {
            let line1Coordinates = line1.geometry.type === 'LineString' ? [line1.geometry.coordinates] : line1.geometry.coordinates;
            let line2Coordinates = line2.geometry.type === 'LineString' ? [line2.geometry.coordinates] : line2.geometry.coordinates;
            let i = 0;
            while (i < line1Coordinates.length && line2Coordinates.length) {
                for (let j = 0; j < line2Coordinates.length; j++) {
                    const union = lineUnionCoordinates(line1Coordinates[i], line2Coordinates[j]);
                    if (union.length) {
                        // parts are unioned
                        line1Coordinates[i] = union;
                        line2Coordinates[j] = [];
                    }
                }
                if (line2Coordinates.some(coords=>coords.length === 0)) {
                    line2Coordinates = line2Coordinates.filter(coords=>coords.length !== 0);
                } else {
                    i++;
                }
            }
            // internally union line1 coordinates
            i = 0;
            while (i < line1Coordinates.length && line1Coordinates.length > 1) {
                for (let j = i + 1; j < line1Coordinates.length; j++) {
                    const union = line1Coordinates(line1Coordinates[i], line1Coordinates[j]);
                    if (union.length) {
                        line1Coordinates[i] = union;
                        line1Coordinates[j] = [];
                    }
                }
                if (line1Coordinates.some(coords=>coords.length === 0)) {
                    line1Coordinates = line1Coordinates.filter(coords=>coords.length !== 0);
                } else {
                    i++;
                }
            }
            let result = line1Coordinates.concat(line2Coordinates);
            let geometryType = result.length === 1 ? "LineString" : "MultiLineString";
            if (result.length === 1) {
                result = result[0]
            }
            return {
                "type": "Feature",
                "geometry": {
                    "type": geometryType,
                    "coordinates": result,
                },
                "properties": {...line1.properties}
            }
        } else {
            throw "lineUnion: parameter 'line2' is not a valid GeoJSON (Multi-)LineString feature";
        }
    } else {
        throw "lineUnion: parameter 'line1' is not a valid GeoJSON (Multi-)LineString feature" 
    }
}

export default lineUnion;