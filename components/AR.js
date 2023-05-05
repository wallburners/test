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

  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
      setScene(scene);

      console.debug('pre createDefaultXR');
      scene.createDefaultXRExperienceAsync({
        disableDefaultUI: true,
        disableTeleportation: true,
        pointerSelectionOptions: {
          enablePointerSelectionOnAllControllers: true,
        },
      }).then((xr) => {
        console.debug('pre enterXR');
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
    
          let currentMesh;
          let startingPoint;
          let pinch = {};
          let rotate;
          scene.onPointerObservable.add((ptrInfo) => {
            let msg = '';
            const { pointerId, x, y } = ptrInfo.event;
            switch (ptrInfo.type) {
			        case PointerEventTypes.POINTERDOWN:
                msg += `PTR DWN${pointerId}`;
				        if (pointerId === 0) {
                  pinch = { x0: x, y0: y };
                  if (ptrInfo.pickInfo.hit) {
                    const { pickedMesh, pickedPoint } = ptrInfo.pickInfo;
                    currentMesh = pickedMesh;
                    startingPoint = pickedPoint;
                    msg += ` ${pickedMesh.name} @ ${startingPoint}`;
                  } else {
                    rotate = x;
                  }
                } else if (pointerId === 1) {
                  pinch.start = Math.sqrt((pinch.x0 - x) ** 2 + (pinch.y0 - y) ** 2);
                  pinch.x1 = x;
                  pinch.y1 = y;
                  pinch.originScaling = rootNode.scaling;
                  currentMesh = undefined;
                  startingPoint = undefined;
                } else {
                  pinch = {};
                }
				        break;
			        case PointerEventTypes.POINTERUP:
                msg += `PTR UP${pointerId}`;
                currentMesh = undefined;
                startingPoint = undefined;
                pinch = {};
                rotate = undefined;
				        break;
			        case PointerEventTypes.POINTERMOVE:
                msg += `PTR MV${pointerId} ${x} ${y}`;
                if (pointerId === 0) {
                  pinch.x0 = x;
                  pinch.y0 = y;
                } else if (pointerId === 1) {
                  pinch.x1 = x;
                  pinch.y1 = y;
                }
                if (currentMesh) {
                  const { hit, pickedPoint } = ptrInfo.pickInfo;
                  if (hit) {
                    const mv = pickedPoint.subtract(startingPoint);
                    msg += ` => ${pickedPoint} - ${startingPoint} = ${mv}`;
                    rootNode.position.addInPlace(mv);
                    startingPoint = pickedPoint;
                  } else {
                    currentMesh = undefined;
                    startingPoint = undefined;
                  }
                } else if (pinch.start) {
                  const currentPinch = Math.sqrt((pinch.x0 - pinch.x1) ** 2 + (pinch.y0 - pinch.y1) ** 2);
                  const pinchRatio = currentPinch / pinch.start;
                  const newScale = pinch.originScaling.scale(pinchRatio);
                  msg += ` pinchRatio: ${pinchRatio}, originScaling: ${pinch.originScaling}`;
                  rootNode.scaling = newScale;
                } else if (rotate) {
                  rootNode.rotate(Vector3.Down(), (x - rotate) * 0.005);
                  rotate = x;
                }
				        break;
            }
            console.debug(msg);
          });
    
          const transformContainer = new TransformNode('Transform Container', scene);
          transformContainer.parent = rootNode;
          const cameraRay = scene.activeCamera.getForwardRay(1);
          rootNode.position = cameraRay.origin.add(cameraRay.direction.scale(cameraRay.length));
          SceneLoader.ImportMeshAsync('', props.src).then((result) => {
            const mesh = result.meshes[0];
            mesh.parent = transformContainer;
            rootNode.scaling.scaleInPlace(0.2);
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
          { trackingState !== WebXRTrackingState.TRACKING &&
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
