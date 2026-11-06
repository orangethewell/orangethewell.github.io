export interface OrbitGeometry {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  cameraDistance: number;
}

export interface OrbitPoint {
  x: number;
  y: number;
  z: number;
  depth: number;
  scale: number;
}

const radians = (degrees: number) => (degrees * Math.PI) / 180;

function ringColor(depth: number): string {
  const from = depth < 0 ? [178, 107, 54] : [216, 120, 34];
  const to = depth < 0 ? [216, 120, 34] : [236, 179, 106];
  const amount = depth < 0 ? depth + 1 : depth;
  return `rgb(${from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount)).join(' ')})`;
}

/** Project a point on the tilted ellipse through a perspective camera. */
export function projectOrbit(angle: number, geometry: OrbitGeometry): OrbitPoint {
  let x = geometry.radiusX * Math.cos(angle);
  let y = geometry.radiusY * Math.sin(angle);
  let z = 0;

  const sinX = Math.sin(radians(geometry.rotationX));
  const cosX = Math.cos(radians(geometry.rotationX));
  [y, z] = [y * cosX - z * sinX, y * sinX + z * cosX];

  const sinY = Math.sin(radians(geometry.rotationY));
  const cosY = Math.cos(radians(geometry.rotationY));
  [x, z] = [x * cosY + z * sinY, -x * sinY + z * cosY];

  const sinZ = Math.sin(radians(geometry.rotationZ));
  const cosZ = Math.cos(radians(geometry.rotationZ));
  [x, y] = [x * cosZ - y * sinZ, x * sinZ + y * cosZ];

  const scale = geometry.cameraDistance / (geometry.cameraDistance - z);
  return {
    x: geometry.centerX + x * scale,
    y: geometry.centerY + y * scale,
    z,
    depth: Math.max(-1, Math.min(1, z / Math.max(geometry.radiusX, geometry.radiusY))),
    scale,
  };
}

export interface RingSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  front: boolean;
  stroke: string;
}

/** Adjacent segments share endpoints, forming one continuous ellipse. */
export function createRingSegments(geometry: OrbitGeometry, count = 192): RingSegment[] {
  const result: RingSegment[] = [];
  for (let index = 0; index < count; index += 1) {
    const first = projectOrbit((index / count) * Math.PI * 2, geometry);
    const last = projectOrbit(((index + 1) / count) * Math.PI * 2, geometry);
    const mid = projectOrbit(((index + 0.5) / count) * Math.PI * 2, geometry);
    const front = mid.z >= 0;
    result.push({
      x1: first.x,
      y1: first.y,
      x2: last.x,
      y2: last.y,
      front,
      opacity: front ? 0.3 + mid.depth * 0.24 : 0.1 + (mid.depth + 1) * 0.12,
      stroke: ringColor(mid.depth),
    });
  }
  return result;
}
