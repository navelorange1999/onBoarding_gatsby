---
title: "依据React Hooks的原理，写一个简易的 useState"
date: "2021-04-04"
---


**参考文章：[React Hooks 原理](https://github.com/brickspert/blog/issues/26)**
**先回顾一下 useState 的用法**
``` js
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
**总结：调用 useState 得到一个状态和一个修改该状态的函数**
依据这个特点，来实现一个简易的 useState 吧

### 预设一个执行环境
先预设一个执行环境，在这里我们用 console.log 去模拟视图的渲染
``` js
let onClick;

function render() {
    const [count, setCount] = useState(0);
    console.log("使用 clg 模拟视图渲染", count);
    // 使用 onClick 模拟更新操作
    onClick = () => {setCount(count + 1)};
}

render();
onClick();
onClick();
```
使用上面这段代码，来模拟 React 界面的渲染和点击两次按钮

### 最初版本的，满足一个状态和修改状态函数的返回
``` js
function useState(defaultState) {
    let _state = defaultState;
    function setState(newState) {
        _state = newState;
        render();
    }

    return [_state, setState];
}
```
使用结果如下：

![能够很明显的看到，其实两次点击都是没有效果的](https://upload-images.jianshu.io/upload_images/22082630-b81cad9270857e0c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是因为，每次 setState 时，它state改变然后需要重新 render，在重新 render 时，执行 useState 又了赋初始值，这样就导致每次的 state 都被初始值覆盖了。

### 改进版本，修复了 setState 无效的 bug
针对上面的问题，我们可以使用闭包的性质，把 state 提取出来，让它成为一个自由变量，然后每次 调用 useState 时都判断一下，当前state有没有值，有的话就不要让初始值对它进行覆盖了。
``` js
// 提取成为全局的自由变量
let _state;

function useState(defaultState) {
  // 赋初始值前，先进行判断当前state是不是没用过
    _state = _state !== undefined ? _state : defaultState;
    function setState(newState) {
        _state = newState;
        render();
    }

    return [_state, setState];
}
```
使用结果如下：

![](https://upload-images.jianshu.io/upload_images/22082630-41a2f426be2ec2ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**但是，如果我们又调用一个 useState 去开辟一个名为 name 的 state，然后通过一个 onChange 方法去使用会怎么样呢？**

改造一下最初模拟的运行环境，让它变成这样：

``` js
let onClick;
let onChange;

function render() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("77")
    console.log("使用 clg 模拟视图渲染 --- count", count);
    console.log("使用 clg 模拟视图渲染 --- name", name);
    // 使用 onClick 模拟更新操作
    onClick = () => { setCount(count + 1) };
    onChange = (name) => { setName(name) };
}

render();
onClick();
onClick();

onChange("kiana")
onChange("kiana_k423")
```
运行结果如下：

![可以看到完全错乱了](https://upload-images.jianshu.io/upload_images/22082630-c26d1207a1f00b12.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**原因也很显而易见，就是因为，多个 state 共用了一个全局的 _state 自由变量**

### 最后改进的版本，修复多次调用 useState，各个 state 状态错乱的 bug
针对这个问题，react 是如何解决的呢？
react 选择的是链表结构，每个 hook 除了自身的state，另外还有一个 next 属性，用于指定下一个 hook
这里，我们选择数组简单模拟一下：
``` js
let _memoizedState = []; // 多个 hook 存放在这个数组
let _idx = 0; // 当前 memoizedState 下标

/**
 * 模拟实现 useState
 * @param {any} defaultState 默认值
 * @returns state 和 setState 方法
 */
function useState(defaultState) {
    // 查看当前位置有没有值
    _memoizedState[_idx] = _memoizedState[_idx] || defaultState;
    // 再一次利用闭包，让 setState 更新的都是对应位置的 state
    const curIdx = _idx;
    function setState(newState) {
        // 更新对应位置的 state
        _memoizedState[curIdx] = newState;
        // 更新完之后触发渲染函数
        render();
    }

    // 返回当前 state 在 _memoizedState 的位置
    return [_memoizedState[_idx++], setState];
}
```
最后根据上面那个模拟的执行环境再来使用一下：
``` js
// 模拟的 react render
let onClick;
let onChange;

function render() {
    // _idx 重新置为 0, 也是契合react每次更新时都从 hooks 头节点开始更新每一个 hook
    // 重置的操作也可以写在 useState 的 render 之前，都是一样的思路
    _idx = 0;
    const [count, setCount] = useState(0);
    const [name, setName] = useState("77")
    console.log("使用 clg 模拟视图渲染 --- count", count);
    console.log("使用 clg 模拟视图渲染 --- name", name);
    // 使用 onClick, onChange 简单模拟一下更新操作
    onClick = () => { setCount(count + 1) };
    onChange = (name) => { setName(name) };
}

render();
console.log("-------------");
onClick();
onClick();
console.log("-------------");
onChange("kiana")
onChange("kiana_k423")
```
效果如下：

![能看见更新都是按部就班地更新了自己对应位置的state](https://upload-images.jianshu.io/upload_images/22082630-38205a4e8b545ebf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 总结
这个简易实现和 react hooks 源码还是有很大的出入的，首先 react hooks 源码中采用的是链表结构，然后链表中单个节点的数据结构定义如下：
``` ts
// react-reconciler/src/ReactFiberHooks.js
export type Hook = {
  memoizedState: any, // 最新的状态值
  baseState: any, // 初始状态值，如`useState(0)`，则初始值为0
  baseUpdate: Update<any, any> | null, // 当前需要更新的 Update ，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
  queue: UpdateQueue<any, any> | null, // 临时保存对状态值的操作，更准确来说是一个链表数据结构中的一个指针
  next: Hook | null,  // 指向下一个链表节点
};
```
能看到还是比较复杂的，这是因为 react hooks 它除了上述的核心功能之外，还需要考虑很多边界情况，异步更新，优先级调度以及封装自定义hook的情况。

文章采用数组结构，是忽略了很多 react 异步渲染和优先级调度的一些场景的。但是也足够契合 react hook的核心思路，也更方便去理解和实现。（其实就是执行 setState后，函数式组件重新render，同时也会重新去从头到下去执行 hooks)
就比如：`const [count, setCount] = useState(0);` 很明显，这个 count 是const 声明是不可变的，但是执行 setCount 之后视图上的 count 就更新了，这就是因为，当执行 setCount 时，该函数式组件就重新 render 了，重新 render 的过程中 count 又被重新地 const 声明了。

而文章的简易实现，只是为了更好地理解在使用 react hooks 时为什么要写在函数式组件顶端且一定要保证顺序调用。**这就是是因为初始化阶段和更新阶段 hooks 都是按照同一个顺序去执行的，倘若更新阶段执行的 hooks 比初始化阶段的 hooks 要少或者要多都是会报错的。** [另外有关 useEffect 的简易实现也可以继续看一下](https://www.jianshu.com/p/746f32252a5a)


