import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GeometryUtils } from 'three'

//debugger config

const gui = new dat.GUI()


const texturecolorloader = new THREE.TextureLoader();

const doorcolortexture = texturecolorloader.load('/textures/door/color.jpg')
const doorslphatexture = texturecolorloader.load('/textures/door/alpha.jpg')
const doorambientOcclusiontexture = texturecolorloader.load('/textures/door/ambientOcclusion.jpg')
const doorheighttexture = texturecolorloader.load('/textures/door/height.jpg')
const doormetalnesstexture = texturecolorloader.load('/textures/door/metalness.jpg')
const doornormaltexture = texturecolorloader.load('/textures/door/normal.jpg')
const doorroughnesstexture = texturecolorloader.load('/textures/door/roughness.jpg')
const matcaptexture = texturecolorloader.load('/textures/matcaps/8.png')
const gradienttexture = texturecolorloader.load('/textures/gradients/3.jpg')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
//materials

// const material = new THREE.MeshMatcapMaterial()
// const material =new THREE.MeshLambertMaterial() 
// const material = new THREE.MeshPhongMaterial()
const material = new THREE.MeshStandardMaterial()
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshBasicMaterial();
// material.map=doorcolortexture;
// material.color = new THREE.Color(0x00ff00)
// material.wireframe=true
// material.transparent = true
// material.alphaMap=doorslphatexture;
// material.flatShading=true

// material.matcap=matcaptexture;

material.metalness = 0
material.side= THREE.DoubleSide
material.shininess=100
material.roughness= 1
material.map = doorcolortexture;
material.aoMap=doorambientOcclusiontexture;
material.aoMapIntensity = 1.14;
material.displacementMap = doorheighttexture;
material.displacementScale=0.05
material.normalMap=doornormaltexture;
material.roughnessMap=doorroughnesstexture;
material.metalnessMap=doormetalnesstexture;



gui.add(material,'metalness').min(0).max(1).step(0.0001)
// gui.add(material,'shininess').min(0).max(1000).step(0.001)
gui.add(material,'roughness').min(0).max(1).step(0.01)
gui.add(material,'wireframe')
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.01)
gui.add(material,'displacementScale').min(0).max(0.15).step(0.0001)
// gui.add(material,'metalnessMapScale').min(0).max(1).step(0.0001)
//light 
const ambientlight= new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientlight)


const pointlight = new THREE.PointLight('#ff6633',1)
scene.add(pointlight)
pointlight.position.y=1

const pointlight2 = new THREE.PointLight('#3399ff',1)
scene.add(pointlight2)
pointlight2.position.x=-10



const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,64,64),material)
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2)
)



const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1,100,100),material)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2)
)




const Torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.4,0.1,64,128),material)
Torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(Torus.geometry.attributes.uv.array,2)
)



sphere.position.x=-1.2
Torus.position.x = 1.2
scene.add(plane,sphere,Torus)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //update objects
   sphere.rotation.y=0.1*elapsedTime;
   plane.rotation.y=0.1*elapsedTime;
   Torus.rotation.y=0.1*elapsedTime;
   
   sphere.rotation.x=0.15*elapsedTime;
   plane.rotation.x=0.15*elapsedTime;
   Torus.rotation.x=0.15*elapsedTime;




    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()