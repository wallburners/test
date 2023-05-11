/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback } from 'react';
import { PermissionsAndroid, SafeAreaView, StatusBar, Button, View, Text, ViewProps, Image } from 'react-native';

import { EngineView, useEngine, EngineViewCallbacks } from '@babylonjs/react-native';
 import { Scene, Vector3, ArcRotateCamera, Camera, WebXRSessionManager, SceneLoader, TransformNode, DeviceSourceManager, DeviceType, PointerInput, WebXRTrackingState, IMouseEvent } from '@babylonjs/core';
import '@babylonjs/loaders';
import Slider from '@react-native-community/slider';
import AR from './components/AR';
const URL_LIST = [
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
  'https://playground.babylonjs.com/scenes/skull.babylon',
  'https://raw.githubusercontent.com/wallburners/test/main/winged_victory_of_samothrace.glb',
];

const App = () => {
  const [toggleScreen, setToggleScreen] = useState(false);
  const [urlIdx, setUrlIdx] = useState(0);
  const nextUrl = (urlIdx + 1) % URL_LIST.length;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Button title="Toggle EngineScreen" onPress={() => { setToggleScreen(!toggleScreen); }} />
        { !toggleScreen
          ? <Text>{URL_LIST[urlIdx]}</Text>
          : <Button title={`Switch to ${URL_LIST[nextUrl]}`}
                    onPress={() => { setUrlIdx(nextUrl); }} />
        }
        { toggleScreen &&
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>EngineScreen has been removed.</Text>
            <Text style={{fontSize: 12}}>Engine has been disposed, and will be recreated.</Text>
          </View>
        }
        { !toggleScreen &&
          <AR style={{flex: 1}} src={URL_LIST[urlIdx]} />
        }
      </SafeAreaView>
    </>
  );
};

export default App;
