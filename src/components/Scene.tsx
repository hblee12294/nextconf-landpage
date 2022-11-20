import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Object3D, Vector3, AdditiveBlending, DynamicDrawUsage, InstancedMesh } from 'three'

import { Reflect, Api } from './Reflect'
import Block from './Block'
import Triangle from './Triangle'

function Scene() {
  const streaks = useRef<InstancedMesh>(null)
  const glow = useRef<InstancedMesh>(null)
  const reflect = useRef<Api>(null)
  const [streakTexture, glowTexture] = useTexture([
    'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/1LRW0uiGloWqJcY0WOxREA/61737e55cab34a414d746acb9d0a9400/download.png',
    'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/2NKOrPD3iq75po1v0AA6h2/40f1a3d6bc175c89fb0934c8c294254a/download.jpeg',
  ])

  const obj = new Object3D()
  const f = new Vector3()
  const t = new Vector3()
  const n = new Vector3()

  let i = 0
  let range = 0

  useFrame((state) => {
    if (!reflect.current || !streaks.current || !glow.current) return

    reflect.current.setRay([
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0,
    ])
    range = reflect.current.update()

    for (i = 0; i < range - 1; i++) {
      // Position 1
      f.fromArray(reflect.current.positions, i * 3)
      // Position 2
      t.fromArray(reflect.current.positions, i * 3 + 3)
      // Calculate normal
      n.subVectors(t, f).normalize()
      // Calculate mid-point
      obj.position.addVectors(f, t).divideScalar(2)
      // Stretch by using the distance
      obj.scale.set(t.distanceTo(f) * 3, 6, 1)
      // Convert rotation to euler z
      obj.rotation.set(0, 0, Math.atan2(n.y, n.x))
      obj.updateMatrix()

      streaks.current.setMatrixAt(i, obj.matrix)
    }

    streaks.current.count = range - 1
    streaks.current.instanceMatrix.updateRange.count = (range - 1) * 16
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

  return (
    <>
      <Reflect ref={reflect} far={10} bounce={10} start={[10, 5, 0]} end={[0, 0, 0]}>
        {/* Any object in here will receive ray events */}
        <Block scale={0.5} position={[0.25, -0.15, 0]} />
        <Block scale={0.5} position={[-1.1, 0.9, 0]} rotation={[0, 0, -1]} />
        <Triangle scale={0.4} position={[-1.1, -1.2, 0]} rotation={[Math.PI / 2, Math.PI, 0]} />
      </Reflect>
      {/* Draw stretched pngs to represent the reflect positions. */}
      <instancedMesh ref={streaks} args={[undefined, undefined, 100]} instanceMatrix-usage={DynamicDrawUsage}>
        <planeGeometry />
        <meshBasicMaterial
          map={streakTexture}
          transparent
          opacity={1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
      {/* Draw glowing dots on the contact points. */}
      <instancedMesh ref={glow} args={[undefined, undefined, 100]} instanceMatrix-usage={DynamicDrawUsage}>
        <planeGeometry />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  )
}

export default Scene
