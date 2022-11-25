import { AdditiveBlending, Group } from 'three'
import { forwardRef, useRef } from 'react'
import { useTexture, Instances, Instance } from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber'

export interface FlareProps extends GroupProps {
  streak?: [number, number, number]
}

export const Flare = forwardRef<Group, FlareProps>(({ streak = [8, 20, 1], visible, ...props }, fRef) => {
  const ref = useRef<Group>(null!)
  const [streakTexture, dotTexture, glowTexture] = useTexture([
    'resources/download.png',
    'resources/download__2_.png',
    'resources/download.jpeg',
  ])
  const config = {
    transparent: true,
    opacity: 1,
    blending: AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }

  useFrame((state) => {
    ref.current.children.forEach((instance) => {
      instance.position.x =
        (Math[instance.scale.x > 1 ? 'sin' : 'cos']((state.clock.elapsedTime * instance.scale.x) / 2) *
          instance.scale.x) /
        8
      instance.position.y =
        (Math[instance.scale.x > 1 ? 'cos' : 'atan'](state.clock.elapsedTime * instance.scale.x) * instance.scale.x) / 5
    })
  })

  return (
    <group ref={fRef} {...props} visible={visible} dispose={null}>
      <Instances frames={visible ? Infinity : 1}>
        <planeGeometry />
        <meshBasicMaterial map={dotTexture} {...config} />
        <group ref={ref}>
          <Instance scale={0.5} />
          <Instance scale={1.25} />
          <Instance scale={0.75} />
          <Instance scale={1.5} />
          <Instance scale={2} position={[0, 0, -0.7]} />
        </group>
      </Instances>
      <mesh scale={1}>
        <planeGeometry />
        <meshBasicMaterial map={glowTexture} {...config} opacity={1} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={streak}>
        <planeGeometry />
        <meshBasicMaterial map={streakTexture} {...config} opacity={1} />
      </mesh>
    </group>
  )
})

Flare.displayName = 'Flare'
