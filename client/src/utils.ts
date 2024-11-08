class Utils {
    constructor() { }

    getIntersectionAndDistance(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
        // Calculate the denominator
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        // If denominator is 0, the lines are parallel and don't intersect
        if (denominator === 0) {
            return null;  // No intersection
        }

        // Calculate the intersection point (Px, Py)
        const Px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
        const Py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;

        // Check if the intersection point (Px, Py) lies on both line segments
        const isOnLine1 = (Px >= Math.min(x1, x2) && Px <= Math.max(x1, x2) &&
            Py >= Math.min(y1, y2) && Py <= Math.max(y1, y2));
        const isOnLine2 = (Px >= Math.min(x3, x4) && Px <= Math.max(x3, x4) &&
            Py >= Math.min(y3, y4) && Py <= Math.max(y3, y4));

        // If intersection point is not on both line segments, return null
        if (!isOnLine1 || !isOnLine2) {
            return null;
        }

        // Calculate and return the distance between (x3, y3) and (Px, Py)
        return Math.sqrt((Px - x3) ** 2 + (Py - y3) ** 2);
    }

}

export const utils = new Utils();