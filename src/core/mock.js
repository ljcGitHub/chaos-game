export const mock = [{
  tag: '1234',
  transform: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  physical: {
    isTrigger: true,
    mass: 1,
    comp: [{
      shapeType: 'Box',
      halfSize: { x: 2, y: 2, z: 2 }
    }]
  },
  children: []
}, {
  transform: {
    position: { x: 4, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  physical: {
    isTrigger: true,
    mass: 1,
    comp: [{
      shapeType: 'Box',
      halfSize: { x: 2, y: 2, z: 2 }
    }]
  }
}]
