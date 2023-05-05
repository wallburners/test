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

const App = () => {
  const [toggleScreen, setToggleScreen] = useState(false);
  //const URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb';
  //const URL = 'https://raw.githubusercontent.com/wallburners/test/main/winged_victory_of_samothrace.glb';
  const URL = 'https://playground.babylonjs.com/scenes/skull.babylon';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        { !toggleScreen &&
          <AR style={{flex: 1}} src={URL} />
        }
        { toggleScreen &&
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>EngineScreen has been removed.</Text>
            <Text style={{fontSize: 12}}>Engine has been disposed, and will be recreated.</Text>
          </View>
        }
        <Button title="Toggle EngineScreen" onPress={() => { setToggleScreen(!toggleScreen); }} />
      </SafeAreaView>
    </>
  );
};

export default App;
