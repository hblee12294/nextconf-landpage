import { Shape, BoxGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial } from 'three'
import { forwardRef, useRef, useState, useMemo } from 'react'
import { useFrame, MeshProps, GroupProps } from '@react-three/fiber'

import { lerpC } from '../utils'

const w = 1
const h = 1
const r = 0.1
const depth = 1
const s = new Shape()
s.moveTo(-w / 2, -h / 2 + r)
s.lineTo(-w / 2, h / 2 - r)
s.absarc(-w / 2 + r, h / 2 - r, r, 1 * Math.PI, 0.5 * Math.PI, true)
s.lineTo(w / 2 - r, h / 2)
s.absarc(w / 2 - r, h / 2 - r, r, 0.5 * Math.PI, 0 * Math.PI, true)
s.lineTo(w / 2, -h / 2 + r)
s.absarc(w / 2 - r, -h / 2 + r, r, 2 * Math.PI, 1.5 * Math.PI, true)
s.lineTo(-w / 2 + r, -h / 2)
s.absarc(-w / 2 + r, -h / 2 + r, r, 1.5 * Math.PI, 1 * Math.PI, true)

const boxGeometry = new BoxGeometry()
const roundedBoxGeometry = new ExtrudeGeometry(s, { depth: 1, bevelEnabled: false })
roundedBoxGeometry.translate(0, 0, -depth / 2)
roundedBoxGeometry.computeVertexNormals()

export type BoxProps = GroupProps

export const Box = forwardRef<Group, GroupProps>((props, ref) => {
  const [hovered, hover] = useState(false)
  const inner = useRef<Mesh>(null!)

  useFrame(() => {
    lerpC((inner.current.material as MeshStandardMaterial).emissive, hovered ? 'white' : '#454545', 0.1)
  })

  const boxProps = useMemo(() => {
    return { onRayOver: () => hover(true), onRayOut: () => hover(false) } as MeshProps
  }, [])

  return (
    <group scale={0.5} ref={ref} {...props}>
      <mesh visible={false} geometry={boxGeometry} {...boxProps} />
      <mesh ref={inner} geometry={roundedBoxGeometry}>
        <meshStandardMaterial color="#333" toneMapped={false} emissiveIntensity={2} />
      </mesh>
    </group>
  )
})

Box.displayName = 'Box'
