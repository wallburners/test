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
  Scene,
  Vector3,
  ArcRotateCamera,
  PointerDragBehavior,
  Camera,
  WebXRSessionManager,
  SphereBuilder,
  SceneLoader,
  TransformNode,
  DeviceSourceManager,
  DeviceType,
  PointerInput,
  PointerEventTypes,
  WebXRTrackingState,
  IMouseEvent,
} from '@babylonjs/core';
import '@babylonjs/loaders';

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
    
          const transformContainer = new TransformNode('Transform Container', scene);
          transformContainer.parent = rootNode;
          const cameraRay = scene.activeCamera.getForwardRay(1);
          rootNode.position = cameraRay.origin.add(cameraRay.direction.scale(cameraRay.length));
          SceneLoader.ImportMeshAsync('', props.src).then((result) => {
            const mesh = result.meshes[0];
            mesh.parent = transformContainer;
            rootNode.scaling.scaleInPlace(0.1);
            const pointerDragBehavior = new PointerDragBehavior({});
            mesh.addBehavior(pointerDragBehavior);
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
