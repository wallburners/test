/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback } from 'react';
import { PermissionsAndroid, SafeAreaView, StatusBar, Button, View, Text, ViewProps, Image } from 'react-native';

import { EngineView, useEngine, EngineViewCallbacks } from '@babylonjs/react-native';
import {
  WebXRHitTest,
  Space,
  Plane,
  Scene,
  Vector3,
  ArcRotateCamera,
  PointerDragBehavior,
  SixDofDragBehavior,
  Camera,
  WebXRSessionManager,
  MeshBuilder,
  Mesh,
  SceneLoader,
  TransformNode,
  StandardMaterial,
  DeviceSourceManager,
  DeviceType,
  PointerInput,
  PointerEventTypes,
  WebXRTrackingState,
  IMouseEvent,
} from '@babylonjs/core';
import '@babylonjs/loaders';

function makeNonPickable(mesh) {
  mesh.isPickable = false;
  mesh.getChildMeshes().forEach((sm) => { sm.isPickable = false; });
}

function resyncBox(mesh, box) {
  const { min, max } = mesh.getHierarchyBoundingVectors();
  box.setAbsolutePosition(new Vector3(
    (min.x + max.x) / 2, 
    (min.y + max.y) / 2,
    (min.z + max.z) / 2,
  ));
}

function createBoundingBox(mesh, scene) {
  const { min, max } = mesh.getHierarchyBoundingVectors();
  console.log("min", min);
  console.log("max", max);
  const width = max.x - min.x;
  const height = max.y - min.y;
  const depth =  max.z - min.z;
  console.log(width, height, depth);
  const box = MeshBuilder.CreateBox("box", { width, height, depth }, scene);
  box.material = new StandardMaterial("mat", scene);
  box.material.alpha = 0.5;
  box.setAbsolutePosition(new Vector3(
    (min.x + max.x) / 2, 
    (min.y + max.y) / 2,
    (min.z + max.z) / 2,
  ));
  return { box, scale: 1 / height };
}


const AR = (props) => {
  const engine = useEngine();
  const [camera, setCamera] = useState();
  const [rootNode, setRootNode] = useState();
  const [scene, setScene] = useState();
  const [xrSession, setXrSession] = useState();
  const [trackingState, setTrackingState] = useState();
  const [importOK, setImportOK] = useState(false);

  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
      setScene(scene);

      scene.createDefaultXRExperienceAsync({
        disableDefaultUI: true,
        disableTeleportation: true,
      }).then((xr) => {
        xr.baseExperience.enterXRAsync('immersive-ar', 'unbounded', xr.renderTarget).then((session) => {
          setXrSession(session);
          session.onXRSessionEnded.add(() => {
            setXrSession(undefined);
            setTrackingState(undefined);
          })

          setTrackingState(xr.baseExperience.camera.trackingState);
          xr.baseExperience.camera.onTrackingStateChanged.add((newTrackingState) => {
            setTrackingState(newTrackingState);
          });

          scene.createDefaultCamera(true);
          setCamera(scene.activeCamera);
          scene.createDefaultLight(true);
          const rootNode = new TransformNode('Root Container', scene);
          setRootNode(rootNode);
    
          const cameraRay = scene.activeCamera.getForwardRay(1);
          console.log("cameraRay", cameraRay);
          SceneLoader.ImportMeshAsync('', props.src).then((result) => {
            const mesh = result.meshes[0];
            mesh.parent = rootNode;
            makeNonPickable(mesh);
            const { box, scale } = createBoundingBox(mesh, scene);
            box.parent = rootNode;
            rootNode.position = cameraRay.origin.add(cameraRay.direction.scale(cameraRay.length * 2));
            rootNode.scaling.scaleInPlace(scale);
            const pointerDragBehavior = new PointerDragBehavior({});
            box.addBehavior(pointerDragBehavior);
            pointerDragBehavior.onDragStartObservable.add((event) => {
              box.material.alpha = 0.5;
            });
            pointerDragBehavior.onDragObservable.add((event) => {
              mesh.setAbsolutePosition(event.delta.add(mesh.getAbsolutePosition()));
            });
            pointerDragBehavior.onDragEndObservable.add((event) => {
              box.material.alpha = 0;
              resyncBox(mesh, box);
            });
            scene.onPointerDown = () => {
              const { min, max } = mesh.getHierarchyBoundingVectors();
              console.log("mesh", mesh.getAbsolutePosition());
              console.log("box", box.getAbsolutePosition());
            };
            setImportOK(true);
          });
        });
      });

    }
  }, [engine]);

  return (
    <>
      <View style={props.style}>
        <View style={{flex: 1}}>
          <EngineView camera={camera} displayFrameRate={false} antiAliasing={2}/>
          { (trackingState !== WebXRTrackingState.TRACKING || !importOK) &&
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: 'yellow' }}>Loading...</Text>
            </View>
          }
        </View>
      </View>
    </>
  );
};

export default AR;
