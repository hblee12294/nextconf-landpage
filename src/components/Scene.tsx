import { useRef, useState, useCallback } from 'react'
import { AmbientLight, SpotLight, Group, Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

import { Beam, BeamAPI } from './Beam'
import { Prism } from './Prism'
import { Box } from './Box'
import { Rainbow, RainbowMaterial, RainbowUniforms } from './Rainbow'
import { Flare } from './Flare'
import { CreateEventReturnType } from './Reflect'

import { lerpV3, calculateRefractionAngle, lerp } from '../utils'

const vec = new Vector3()

function Scene() {
  const ambient = useRef<AmbientLight>(null!)
  const spot = useRef<SpotLight>(null!)
  const boxreflect = useRef<BeamAPI>(null!)
  const rainbow = useRef<Mesh>(null!)
  const flare = useRef<Group>(null!)

  const [isPrismHit, hitPrism] = useState(false)

  const rayOut = useCallback(() => hitPrism(false), [])

  const rayOver = useCallback((e: CreateEventReturnType) => {
    // Break raycast so the ray stops when it touches the prism.
    e.stopPropagation()
    hitPrism(true)
    // Set the intensity really high on first contact.
    const material = rainbow.current.material as any as typeof RainbowMaterial & RainbowUniforms
    material.speed = 1
    material.emissiveIntensity = 20
  }, [])

  const rayMove = useCallback(({ api, position, direction, normal }: CreateEventReturnType) => {
    if (!normal) return
    // Extend the line to the prisms center.
    vec.toArray(api.positions, api.number++ * 3)
    // Set flare.
    flare.current.position.set(position.x, position.y, -0.5)
    flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y))

    // Calculate refraction angles.
    let angleScreenCenter = Math.atan2(-position.y, -position.x)
    const normalAngle = Math.atan2(normal.y, normal.x)

    // The angle between the ray and the normal.
    const incidentAngle = angleScreenCenter - normalAngle

    // Calculate the refraction for the incident angle.
    const refractionAngle = calculateRefractionAngle(incidentAngle) * 6

    // Apply the refraction.
    angleScreenCenter += refractionAngle
    rainbow.current.rotation.z = angleScreenCenter

    // Set spot light.
    lerpV3(spot.current.target.position, [Math.cos(angleScreenCenter), Math.sin(angleScreenCenter), 0], 0.05)
    spot.current.target.updateMatrixWorld()
  }, [])

  useFrame((state) => {
    // Tie beam to the mouse.
    boxreflect.current.setRay(
      [(state.pointer.x * state.viewport.width) / 2, (state.pointer.y * state.viewport.height) / 2, 0],
      [0, 0, 0],
    )

    // Animate rainbow intensity.
    lerp(rainbow.current.material, 'emissiveIntensity', isPrismHit ? 2.5 : 0, 0.1)
    const material = rainbow.current.material as any as typeof RainbowMaterial & RainbowUniforms
    spot.current.intensity = material.emissiveIntensity

    // Animate ambience.
    lerp(ambient.current, 'intensity', 0, 0.025)
  })

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambient} intensity={0} />
      <pointLight position={[10, -10, 0]} intensity={0.05} />
      <pointLight position={[0, 10, 0]} intensity={0.05} />
      <pointLight position={[-10, 0, 0]} intensity={0.05} />
      <spotLight ref={spot} intensity={1} distance={7} angle={1} penumbra={1} position={[0, 0, 1]} />

      {/* Prism + blocks + reflect beam */}
      <Beam ref={boxreflect} bounce={10} far={20}>
        <Prism scale={0.6} position={[0, -0.5, 0]} onRayOver={rayOver} onRayOut={rayOut} onRayMove={rayMove} />
        <Box position={[-1.4, 1, 0]} rotation={[0, 0, Math.PI / 8]} />
        <Box position={[-2.4, -1, 0]} rotation={[0, 0, Math.PI / -4]} />
        <Box position={[1, -2, 0]} rotation={[0, 0, Math.PI / 4]} />
        <Box position={[2, 0.5, 0]} rotation={[0, 0, Math.PI / -8]} />
      </Beam>

      {/* Rainbow and flares */}
      <Rainbow ref={rainbow} startRadius={0} endRadius={0.5} fade={0} />
      <Flare ref={flare} visible={isPrismHit} renderOrder={10} scale={1.25} streak={[12.5, 20, 1]} />
    </>
  )
}

export default Scene
