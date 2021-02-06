---
title: React Native混合开发详解
date: 2021-01-05 00:00:00
categories: 
- React Native
---

在进行React Native开发的过程中，对于前端开发来说可以使用React技术栈实现UI和前端交互的功能，但是很多较复杂的功能最终的实现实际都是放到Native端来进行的，这种在使用React Native开发过程中既需要前端RN开发也需要Android、IOS Native端开发模式被称为混合开发。

<!-- more -->
## 混合开发场景
混合开发意味着开发团队不仅仅要掌握前端的开发的能力，还要有Android和IOS的技能，相信这对研发团队的要求是非常奢侈的。目前React Native相关的库也比较丰富了，大部分的功能相信都能在Github上找到对应的功能库，为开发者屏蔽了Native技术栈。但是难免有一些功能功能需要调用Native端的一些API：如微师App中对Gzip压缩文件的处理，播放视频、进入直播间等已有SDK的调用等功能。

## Native端与RN代码交互
Native端与RN的交互至少需要包含两个部分：
1. RN主动调用Native模块，并通过Promise的方式返回模块执行的结果
2. 对于异步任务类型的方法，可以通过在RN端监听事件的方式，监听Native回调的事件


### Android与RN代码交互
Android中React Native为我们提供ReactContextBaseJavaModule基类，我们只需要集成该基类，重写其中的getName方法，返回值为我们自定义模块的名字，最后包添加至MainApplication入口即完成一个自定义模块的添加。
```
// DemoPackage.java
public class DemoPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new DemoModule(reactContext));

        return modules;
    }
}
// DemoModule.java
public class DemoModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public DemoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    @ReactMethod
    public void fun(String data, Promise promise) {
        promise.resolve("{\"data\": \""+data+"\"}");
    }
    @ReactMethod
    public void fun1(String data, Promise promise) {
        sendEvent(reactContext, "ON_NATIVE", "{\"data\": \""+data+"\"}");
    }
    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    @Override
    public String getName() {
        return "DemoModule";
    }
}
```


### IOS与RN代码交互
```
// DemoModule.h
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@interface DemoModule : RCTEventEmitter <RCTBridgeModule>
@end

// DemoModule.m
#import <Foundation/Foundation.h>
#import "AppDelegate.h"
#import "DemoModule.h"
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
@implementation DemoModule

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents {
  return @[@"ON_NATIVE"];
}

RCT_REMAP_METHOD(fun, fun:
  (NSString *)data
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString* result = [NSString stringWithFormat:@"{\"data\": \"%@\"}", data];
  resolve(result);
}
RCT_EXPORT_METHOD(fun1:(NSString *)data) {
  NSString* result = [NSString stringWithFormat:@"{\"data\": \"%@\"}", data];
  [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
      method:@"emit"
        args:@[@"ON_NATIVE", result]
  completion:NULL];
}
@end
```


### RN与Android和IOS交互
```
import { NativeModules, DeviceEventEmitter } from 'react-native';
const { DemoModule } = NativeModules;
DeviceEventEmitter.addListener('ON_NATIVE', (result) => {
  // do something
});
DemoModule.fun('test').then(result => {
  // do something
}).catch(error => {
  // error
});
DemoModule.fun1('test');
```

## RN模块式混合开发
通过上述的方式可以实现RN与Native之间的代码交互，但是存在一个弊端就是，Native代码与项目混合在一起，没办法进行剥离和其他项目共享。每次添加一个Native功能模块都需要在基础框架代码上进行修改，非常不方便。

仔细想想我们会发现，我们通过NPM包引入的相关Native依赖，就不用每次修改框架代码，所以我们也可以将Native相关的功能剥离出来，封装成一个个NPM模块。通过这种模块式的混合开发，就可以解决上面的问题。

## Create React Native Module
React Native从0.60版本开始支持AutoLink，我们不需要每次yarn install 之后再去执行react native link。在RN初始的Native有如下代码会自动的把相关的依赖引入到Native中：
```
// IOS Podfile
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules

// Android setting.gradle
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); 
applyNativeModulesSettingsGradle(settings)
```
所以我们只需要按照特定的结构组织我们的模块就可以通过这种AutoLink的方式引入进来，create react native module就可以帮助我们自动生成一个React Native模块模板。

1. 安装依赖
```
npm install -g create-react-native-module
```
2. 创建项目
创建一个带example的模块项目模板
```
create-react-native-module MyFancyLibrary --generate-example
```

3. 结构说明
```
├── LICENSE       // 开源证书
├── README.md     // 说明文档
├── android       // Android工程代码
├── example       // 完整RN项目，已引入当前库
├── index.js      // RN暴露模块
├── ios           // IOS工程代码
├── package.json 
└── react-native-gzip.podspec
```

4. 模块添加第三方依赖
往往实现一个功能，需要引入一些Android和IOS的第三方依赖，那么如何在Create React Native Module中添加第三方依赖，并可以AutoLink呢？
- Android 
```
// ./android/build.gradle
dependencies {
    //noinspection GradleDynamicVersion
    implementation 'com.facebook.react:react-native:+'  // From node_modules
    implementation 'commons-io:commons-io:2.6'
    implementation 'org.apache.commons:commons-compress:1.1'
}
```

- IOS
```
// ./MODULE_NAME.podspec
s.dependency "NVHTarGzip"
```

## 发布至NPM库
为了方便使用我们需要把封装好的RN模块发布到NPM，在发布之前需要修改好你的package.json和Readme，具体的说明可以参考网上相关资料。准备好之后只需要在根目录下执行：
```
npm login
// 输入账户 密码 邮箱信息
npm publish
```

发布成功后就可以在需要使用这个库的正常引入了

之前为了实现一个解压缩gzip文件的功能，通过Create React Native Module创建了一个NPM包，可以供参考 ***[react-native-gzip](https://github.com/FWC1994/react-native-gzip)***。

## 总结
单纯使用React Native来开发一款APP总会收到各种各样的限制，混合开发为我们打开了新世界的大门，只要在Native端有相应的解决方案，我们都可以将其进行改造，在React Native中进行使用。但是也要求我们对IOS中使用的Objective-C 和Android的Java语言都有一定的了解，任重而道远。