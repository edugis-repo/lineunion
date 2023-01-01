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

// union assumptions:
// lines are unionable => intersect but not cross
// if both ends of line1 are not on (near) line2, line1 is the union (line1 fully overlaps line2)
// if both ends of line2 are not on (near) line1, line2 is the union (line2 fully overlaps line1)
export const lineUnion = (line1, line2, tolerance = 0.0001) => {
    const union = [];
    let startDistance, endDistance = Number.MAX_VALUE;
 
    for (let point2 = 0; point2 < line2.length - 1; point2++) {
        const segment = [line2[point2],line2[point2+1]];
        let dist  = distanceToSegment(line1[0], segment);
        if (dist < startDistance) {
            startDistance = dist;
        }
        dist = distanceToSegment(line1[line1.length-1], segment);
        if (dist < endDistance) {
            endDistance = dist;
        }
        if (startDistance < tolerance && endDistance < tolerance) {
            return clone(line1);
        }
        if (startDistance > tolerance && endDistance > tolerance) {
            return clone(line2);
        }
        if (startDistance < tolerance) {
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
    }
    return union;
}

export default lineUnion;