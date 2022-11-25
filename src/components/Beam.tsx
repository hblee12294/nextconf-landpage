import { forwardRef, useRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Object3D, Vector3, AdditiveBlending, DynamicDrawUsage, InstancedMesh } from 'three'

import { Reflect, ReflectProps, ReflectAPI } from './Reflect'

export interface BeamProps extends Omit<ReflectProps, 'ref'> {
  stride?: number
  width?: number
}

export type BeamAPI = ReflectAPI

export const Beam = forwardRef<BeamAPI, BeamProps>(({ children, position, stride = 4, width = 8, ...props }, fRef) => {
  const streaks = useRef<InstancedMesh>(null!)
  const glow = useRef<InstancedMesh>(null!)
  const reflect = useRef<ReflectAPI>(null!)
  const [streakTexture, glowTexture] = useTexture(['resources/download.png', 'resources/download.jpeg'])

  const obj = new Object3D()
  const f = new Vector3()
  const t = new Vector3()
  const n = new Vector3()
  const config = {
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }

  let i = 0
  let range = 0

  useFrame(() => {
    range = reflect.current.update() - 1

    for (i = 0; i < range; i++) {
      // Position 1
      f.fromArray(reflect.current.positions, i * 3)
      // Position 2
      t.fromArray(reflect.current.positions, i * 3 + 3)
      // Calculate normal
      n.subVectors(t, f).normalize()
      // Calculate mid-point
      obj.position.addVectors(f, t).divideScalar(2)
      // Stretch by using the distance
      obj.scale.set(t.distanceTo(f) * stride, width, 1)
      // Convert rotation to euler z
      obj.rotation.set(0, 0, Math.atan2(n.y, n.x))
      obj.updateMatrix()

      streaks.current.setMatrixAt(i, obj.matrix)
    }

    streaks.current.count = range
    streaks.current.instanceMatrix.updateRange.count = range * 16
    streaks.current.instanceMatrix.needsUpdate = true

    // First glow isn't shown.
    obj.scale.setScalar(0)
    obj.updateMatrix()
    glow.current.setMatrixAt(0, obj.matrix)

    for (i = 1; i < range; i++) {
      obj.position.fromArray(reflect.current.positions, i * 3)
      obj.scale.setScalar(0.75)
      obj.rotation.set(0, 0, 0)
      obj.updateMatrix()

      glow.current.setMatrixAt(i, obj.matrix)
    }

    glow.current.count = range
    glow.current.instanceMatrix.updateRange.count = range * 16
    glow.current.instanceMatrix.needsUpdate = true
  })

  useImperativeHandle(fRef, () => reflect.current, [])

  return (
    <group>
      <Reflect position={position} ref={reflect} {...props}>
        {/* Any object in here will receive ray events */}
        {children}
      </Reflect>
      {/* Draw stretched pngs to represent the reflect positions. */}
      <instancedMesh ref={streaks} args={[undefined, undefined, 100]} instanceMatrix-usage={DynamicDrawUsage}>
        <planeGeometry />
        <meshBasicMaterial map={streakTexture} opacity={1.5} {...config} />
      </instancedMesh>
      {/* Draw glowing dots on the contact points. */}
      <instancedMesh ref={glow} args={[undefined, undefined, 100]} instanceMatrix-usage={DynamicDrawUsage}>
        <planeGeometry />
        <meshBasicMaterial map={glowTexture} {...config} />
      </instancedMesh>
    </group>
  )
})

Beam.displayName = 'Beam'
