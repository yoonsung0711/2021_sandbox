## Redux Middleware를 어떻게 작성할 것인가?  

<font size="3" color="red">

️⚡️ 부제: middleware 연쇄는 어떻게 일어나는가

</font>

> applyMiddleware의 인자로 주입되는 middleware 들이 어떠한 과정을 통해 처리되고   
> 작성시 유의해야 하는 점들에는 어떤 것들이 있는지 알아보고자 합니다.  

<br/>

<font color="purple"><span style="font-weight:bold">

목차 

</span></font>

1. 문제 해결의 기대효과

2. (잠정적인) 결론

3. 탐구 과정

    3..1 redux 경량 구현체 + 테스트 코드 작성하기

    3..3 redux 앞으로 차기 (CPS) 살펴보기

    3..4 middleware 호출 스택이 열리는 순서

    3..5 middleware 내부에서 dispatch가 호출될 경우 호출 스택이 쌓이는 양상

    3..6 next(action) 호출 위치에 따라 niddleware chain의 동작은 어떻게 달라지는가

    3..7 실수 없는 코드를 작성하기 위한 next(action)의 호출 위치

    3..8 (추가) 미들웨어의 분기 및 복잡성을 제거하기

<br/>


<!-- #region 1 문제 해결의 기대효과 (expected effect of problem solving) -->

### 1. 문제 해결의 기대효과 (expected effect of problem solving)

<details open>
<summary>...(닫기)</summary>

<br/>

🙉 이 **_문제_** 를 이해하면 :   

* middleware의 배치 순서에 따라 애플리케이션의 동작이 어떻게 달라지는지 예측할 수 있습니다. 

* 응답성을 최대화 하기 위해 middlware 블록 내부의 next(action) 문 호출이 언제 발생해야 하는지를 결정할 수 있습니다. 

* 비동기 요청을 처리하는 middleware를 선순서로 배치할지, 후순서로 배치할 지 결정할 수 있습니다. 

<br/>

</details>

<!-- #endregion 1 -->

<!-- #region 2 잠정적 결론들 (tentative conclusions) -->

### 2. (잠정적인) 결론 (tentative conclusions)

<details open>
<summary>...(닫기)</summary>

<br/>

🐣 이 **_문제_** 를 탐구해보니 :   

* middleware 연쇄는 **_합성 함수(compose)_** 와 **_앞으로 차기(CPS)_** 로 작동합니다. 

* middleware 호출 스택은 applyMiddleware 인자의 순서대로  **_좌에서 우로_** 열립니다. 

* 일반적인 middleware의 경우:

    *  applyMiddleware에 주입할 때 **_비동기 처리 미들웨어 앞단에_** 배치하는 것이 안전합니다. 

    *  꼬리 호출 최적화가 지원된다는 가정하에, next(action)은 각 분기 문의 반환 시점에 호출하는 것이 유리합니다. 

* 비동기 요청을 동기화 하는 (async) middleware의 경우:

  *  applyMiddleware에 주입할 때 **_가장 마지막에 배치_** 하는 것이 안전합니다. 

  *  next(action)을 블록문의 **_가장 상단에 위치_** 시키는 것이 안전합니다. 

<br/>

</details>

<!-- #endregion 2 -->

<!-- #region 3 탐구 과정 (exploration process) -->

### 3. 탐구 과정 (exploration process)

<details open>
<summary>...(닫기)</summary>

<!-- #region 3-1 redux 라이브러리 구현체 및 테스트 코드 작성하기 -->

<font size="4">

### 3-1. redux 라이브러리 구현체 및 테스트 코드 작성하기 

</font>

<details open>
<summary>...(닫기)</summary>

<br/>

> 해외 세미나 컨퍼런스를 시청하는 중에 redux 라이브러리가 1,000 라인 남짓 밖에 안된다는 사실을 알게 되었고,  
> middleware의 동작이 궁금해진 즈음에 create own redux라는 키워드로 작은 git repo를 찾아보게 되었습니다.  
> 처음에는 구현체에 compose 함수가 포함되어 있지 않았고 applyMiddleware도 한 개의 middleware만 처리하는  
> 코드라 매우 아쉽다는 생각이 들었습니다. 
>
> 하지만 실망하지 않고 redux 라이브러리를 살펴보니 compose 함수가 생각보다 간단하다는 사실을 확인할 수 있었고   
> apply middleware 또한 복잡하지 않아 해당 코드(typescript)를 javascript로 옮기는 것이 가능해 보였습니다. 
>
> 이후 compose와 applyMiddlware에 대한 테스트 코드를 작성하여 작동 여부를 확인한 후 통합 테스트를 진행하였는데  
> 잘동작하는 것을 보고 가슴을 쓸어내렸습니다. (실험 + 코드 이해가 가능해졌다는 안도감이... 😂 )  
> applyMiddleware 부분은 짧은 코드였지만 그 함의를 깨닫기 까지 시간과 노력을 투자해야 했습니다. 
> 
> 단일 middleware를 처리할 수 있는 lightweight redux 구현체는 아래 github repo를 참고하시길 바랍니다. 

<font size="4">

##### 참고한 redux tutorial: [link](https://github.com/heiskr/prezzy-redux-scratch)

</font>

<br/>

* 그 동안 여러 라이브러리의 동작을 잘 이해하고자 :

    * 공식 tutorial을 읽어보거나 

    * 관련된 컨퍼런스 세미나 영샹을 시청하거나 

    * 샘플 프로젝트를 clone해서 디버거를 돌려보거나 

    * 라이브러리 내에 있는 테스트 코드를 살펴보는 등의 방법을 사용해왔습니다.  

* 샌드박스 프로젝트를 진행하면서 처음으로 

  * 테스트 코드를 직접 작성하며 라이브러리 주요 구현체를 하나씩 따라해 보았는데 관련된 활동이 라이브러리를 이해하는 데 매우 큰 도움이 되었습니다. 

<br/>

<font size="3">⌘</font> 작성한 코드 

<!-- **_ 프로젝트 구현체_**   -->

**_● compose_**: [`src/js/store/_lib/compose.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/compose.js)  
**_● createStore_**: [`src/js/store/_lib/createStore.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/createStore.js)  
**_● applyMiddleware_**: [`src/js/store/_lib/applyMiddleware.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/applyMiddleware.js)  
**_● middleware_**: [`src/js/store/middleware/log/middleware.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/log/log.middleware.js)  
**_● bindAction_**: [`src/js/store/_lib/bindAction.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/bindAction.js)  

<br/>

<font size="3">⌘</font> 테스트 코드

**_● compose_**: [`src/js/store/_lib/compose.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/compose.test.js)  
**_● createStore_**: [`src/js/store/_lib/createStore.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/createStore.test.js)  
**_● applyMiddleware_**: [`src/js/store/_lib/applyMiddleware.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/applyMiddleware.test.js)  
**_● middleware_**: [`src/js/store/middleware/log/middleware.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/log/log.middleware.test.js)  
**_● bindAction_**: [`src/js/store/_lib/bindAction.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/bindAction.test.js)  


<br/>

</details>


<!-- #endregion 3-1 -->


<!-- #region 3-2 redux 합성 함수 (compose function) 살펴보기 -->

<font size="4">

### 3-2. redux 합성 함수 (compose function) 살펴보기 

</font>

<details open>
<summary>...(닫기)</summary>

#### ❖ 합성 함수 (compose function)

[`src/js/store/_lib/compose.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/_lib/compose.js)  

```ts

module.exports = (...funcs) => {
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

```

<br/>

* **__중첩 합수 vs 합성 함수__** : 함수 값에 대한 합성과, 함수를 다른 함수에 적용시키는 합성 함수는 엄연히 다른 개념입니다. 

    * 전자는 함수가 적용된 값을 다시 함수에 적용시키는 것으로 함수의 실행 및 평가가 가장 안쪽 함수부터 시작됩니다. 

    * 후자는 함수가 인자로 평가되기 때문에 가장 바깥쪽 함수부터 실행되며 바깥 함수의 내부에서 인자로 받은 함수에 대한 호출이 발생할 때 비로소 안쪽 함수가 평가됩니다. 

<br/>

* 상기 compose 함수는 임의 개수의 인자로 받은 func을 rest 파라미터로 받아 배열로 변환하고 **_reduce 접기 연산_** 을 적용하여, 오른쪽에서 왼쪽으로 함수의 인자를 전달합니다. 

    * 접기 연산에 의해 함수의 포인터를 다른 함수에 연쇄적으로 넘기는 것으로 cps가 구현된 것은 아닙니다. 

    * 나중에 다루겠지만 **_middleware에서 (next)로 다음 함수를 인자로 받고, 함수 내에서 다시 (next) 함수를 호출하며 context를 넘겨주는 부분__** 이 제대로 작성되어야 cps가 비로소 구현됩니다. 


<br/>

</details>

<!-- #endregion 3-2 -->


<!-- #region 3-3 redux 앞으로 차기 (continuation pass style) 살펴보기 -->

<font size="4">

### 3-3. redux 앞으로 차기 (continuation pass style) 살펴보기 

</font>

<details open>
<summary>...(닫기)</summary>

<br/>

> 앞으로 차기(cps;continuation pass style)라는 용어와 개념을 처음으로 접하게 된 것은 
> [프로그래밍 패턴(크리스티나 로페즈)](http://www.yes24.com/Product/Goods/19114313?OzSrank=3) 이라는  
> 책을 통해서 였습니다. 이후 자바스립트 async generator를 다시 공부하게 되면서 해당 부분을 다시 찾아 본 적이 있었습니다.   
> 그리고 이번에 redux 라이브러리의 compose 함수와 middleware가 동작하는 방식을 살펴본 뒤 해당 패턴이 cps라는 사실을  
> 깨닫게 되었습니다. 
>
> express server의 middleware도 또한 비슷한 시그니처와 처리를 하고 있으니 cps 패턴이 아닐까 추측해 봅니다. 
> redux saga는 앞으로 차기를 generator 형식으로 구현했다는 것을 확인하였습니다. 

<br/>

#### ❖ 앞으로 차기 (continuation passing style)

[`src/js/store/store/middleware/log/log.middleware.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/log/log.middleware.js)  

```ts
const logMiddleware = (store) => (next) => (action) => {
    console.log(action);
    return next(action);
};

```

<br/>

* **__앞으로 차기(cps)__** 패턴은 함수 b가 다음 함수 a를 호출하면서 '자신의 컨텍스트'를 a에게 넘겨주는 것을 의미합니다. 

    * 일반적으로는 **_cps_** 는 코드블록 b가 코드블록 a에게 **_'컨텍스트'와 '제어권(code flow)'을 a에게 넘기는 것_** 을 말합니다. 

    * 자바스크립트의 generator의 경우만 보더라도 볼 때 앞으로 차기(cps)는 함수 호출이 아닌 **_구문 형태로도 구현_** 될 수 있으니, GOF 패턴의 경우에서처럼 구현 형태 보다는 실질적인 역할과 기능에 주목할 필요가 있습니다.

    * 명령(command)을 실행하는 방식도 method invocation 방식만 있는 것이 아니듯 .. cps도 구문 형태나 함수 호출에 얽매일 필요는 없을 것 같습니다. 

    * **__앞으로 차기__** 는 널리 사용되는 용어는 아닙니다. ['프로그래밍 패턴']() (크리스티나 로페즈 지음) 책에서 저자가 명명한 것으로 cps 보다는 직관적이라 생각합니다. 😁😁😁

<br/>

* 상기 코드의 logMiddleware는 cps 처리에 필요한 시그니쳐를 연속 람다 전달 형태의 합성 함수로 구현하고 있습니다. 

    * 두번째 인자인 next로 다음 middlewar를 주입받아 next(action)으로 제어권 및 컨텍스트를 전달합니다. 

    * 첫번째 인자인 store는 런타임에 동적으로 생성되는 store로부터 dispatch의 포인터를 캐치하여 가장 안쪽 middleware의 next 함수로 전달하기 위한 고계 합성함수 인자입니다. 


<br/>

</details>

<!-- #endregion 3-3 -->


<!-- #region 3-4 middleware 호출 스택이 열리는 순서 -->

### 3-4. middleware 호출 스택이 열리는 순서

<details open>
<summary>...(닫기)</summary>

<br/>

> middleware의 chain 호출은 dispatch 함수 호출로 부터 시작됩니다. 아래 테스트 코드에서는 store 객체의   
> 내부 코드에서 middleware의 연쇄 호출과 무관한 처리를 하는 부분은 과감히 덜어내고 stubStore를 구현하였습니다  


* redux의 dispatch 호출시에는 applyMiddleware에 전달되는 middlewar 인자들 중 가장 좌측의 middleware가 먼저 호출됩니다. 

    * 이는 compose 함수에 의해 합성되는 middleware 함수 본체에서 가장 바깥쪽 함수가 가장 먼저 호출된다는 것을 의미하기도 합니다. 

    * 흥미로운 것은 middleware의 합성 함수에 store 인자를 전달하여 얻은 포인터(dispatch)는 가장 내측에 위치한 applyMiddlware의 next가 가리키는 함수 포인터가 된다는 사실입니다. dispatch 함수는 middleware chain의 연쇄 호출의 시작과 끝에서 호출된다는 점은 흥미로우면서도 매우 오묘한 사실입니다. 

<br/>

🔔 테스트 코드 

**_● jest 테스트 바로가기_**: [`./src/js/store/middleware/_exp/process_order.exp.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/_exp/process_order.exp.test.js)  

```js 
const compose = (...funcs) => {
    return funcs
        .reduce((a, b) => (...args) => a(b(...args)));
};

const middlewareA = (store) => (next) => (action) => {
    action.push('[middlewareA] stack is open');
    action.push('[middlewareA] before call next');
    next(action);
    action.push('[middlewareA] after call next');
};
const middlewareB = (store) => (next) => (action) => {
    action.push('[middlewareB] stack is open');
    action.push('[middlewareB] before call next');
    next(action);
    action.push('[middlewareB] after call next');
};

// 첫번째 버전 - 구현체를 최대한 간결하게 나타내고자 축약한 버전입니다. 

const action1 = []; // 테스트 메시지를 수집하기 위한 객체입니다. 
const stubStore = { dispatch: () => {} };
const chain = [middlewareA, middlewareB].map((middleware) => middleware(stubStore));
const dispatch = compose(...chain)(stubStore.dispatch);
dispatch(action1);

// 두번째 버전 - 같은 결과를 나타내지만 좀더 이해하기 쉬운 형태로 함수를 치환했습니다.

const action2 = [];
const middlewareAA = middlewareA(stubStore);
const middlewareBB = middlewareB(stubStore);
const composedMiddleware = (...args) => middlewareAA(middlewareBB(...args));
const dispatch2 = composedMiddleware(stubStore.dispatch);
dispatch2(action2);

// 이제 action1, action2를 각각 콘솔에 출력해보면 아래와 같은 결과가 나옵니다. 

[
    '[middlewareA] stack is open',
    '[middlewareA] before call next',
    '[middlewareB] stack is open',
    '[middlewareB] before call next',
    '[middlewareB] after call next',
    '[middlewareA] after call next'
]

// composeMiddleware를 볼 때, middlewareBB가 먼저 호출되어야 할 것 같지만 
// 실제로는 그렇게 작동하지 않습니다. middlewareBB의 코드 블록은 
// middlewareAA에서 내부에서 호출될 때까지 
// 호출이 지연되기 때문입니다. 

const action = [];
const stubStore = {
    dispatch: (action) => {}
}
const dispatch = (function middlewareA(action) {
        action.push('[middlewareA] stack is open');
        action.push('[middlewareA] before call next');
        (function middlewareB(action) {
            action.push('[middlewareB] stack is open');
            action.push('[middlewareB] before call next');
            action.push('[middlewareB] after call next');
            store.dispatch(action);
        })(action)
        action.push('[middlewareA] after call next');
});
dispatch(action);

// 무엇보다 구조상 가장 중요하면서도 이해하기 어려운 것은 사실 가장 안쪽 미들웨어(middlewareBB)의 
// next 함수가 가리키는 것이 stubStore의 dispatch 객체라는 것입니다. 

```

<br/>

</details>

<!-- #endregion 3-4 -->


<!-- #region 3-5 Middleware 내부에서 dispatch가 호출될 경우 호출 스택이 쌓이는 양상 -->

<font size="4">

### 3-5. Middleware 내부에서 dispatch가 호출될 경우 호출 스택이 쌓이는 양상

</font>

<details open>
<summary>...(닫기)</summary>

* redux의 dispatch는 **_스택 안전하지 않은 재귀호출_** 이다. 

    * **_dispatch가 거쳐가는 미들웨어의 숫자가 많거나, 미들웨어 내부에서 dispatch 재귀 호출이 연쇄된다는 것은 나쁜 설계를 의미_** 한다고 생각됩니다. 

    * dispatch **_재귀 호출을 최소화 하는 방법_** 은 rxjs와 같은 함수형/반응형 라이브러리로 기능을 일부 위임하는 것이 방법이 아닐까 싶습니다. 

    * 스택 안전한 공재귀 형태로 변형할 시 재귀 형태에 비해 메모리 사용량을 감소시킬 수 있는 장점이 있고, v8 컴파일러의 **_꼬리호출 최적화가 지원_** 된다면 안전한 재귀호출이 가능해집니다.

    * 공재귀로 변환 가능한 재귀는 것은 루프로도 변환 가능하니, redux saga에서는 스택 안전한 루프로 처리하기 위해 **_generator 방식의 cps_** 를 도입한 것으로 생각됩니다. 

<br>


🔔 테스트 코드 

**_jest 테스트 바로가기_**: [`./src/js/store/middleware/_exp/unsafe_stack.exp.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/_exp/unsafe_stack.exp.test.js)  

```ts
# 
const middlewares = [
    (store) => (next) => (action) => {
        action.A_call_count = action.A_call_count + 1;
        next(action);
        if (action.val < 100) {
            action.val = action.val + 1
            store.dispatch(action);
        } else {
            return
        }
    },
    (store) => (next) => (action) => {
        action.B_call_count = action.B_call_count + 1;
        next(action);
        if (action.val < 100) {
            action.val = action.val + 1
            store.dispatch(action);
        } else {
            return
        }
    }
];
const store = createStoreForTest(middlewares);
const action = { val : 0, A_call_count: 0, B_call_count: 0 };
store.dispatch(action);

// action을 콘솔로 출력하면 아래와 같은 값이 나옵니다. 
{ val: 100, A_call_count: 101, B_call_count: 101 }

```

<br/>

</details>

<!-- #endregion 3-5 -->


<!-- #region 3-6 next(action) 호출 위치에 따라 niddleware chain의 동작은 어떻게 달라지는가 -->

<font size="4">

### 3-6. next(action) 호출 위치에 따라 niddleware chain의 동작은 어떻게 달라지는가

</font>

<details>
<summary>...(닫기)</summary>

* 비동기 처리(Promise)를 담은 dispatch의 경우 middleware들 중 하나가 **_동기화 해주는 resolve 작업_** 을 해야 합니다. 

    * 미들웨어 async await 구문을 사용하든 promise.then 구문을 사용하든 **_비동기를 sync하는 시점에는 블록킹이 발생_** 할 수 밖에 없습니다. 

    * 모든 미들웨어에서 next(action) 호출이 최상단에 위치한다면 각각의 미들웨어는 **_블록킹이 발생하기 전에 비동기 처리가 시작_** 될 수 있는 기회가 주어집니다. 

    * 반대로 모든 미들웨어가 자신의 처리가 끝날 때까지 next(action)을 호출을 지연한다면 sync 작업이 수행되는 동안 다음 미들웨어의 호출이 지연되므로 사실상 미들웨어의 연쇄는 하나의 sync blocking 코드가 되므로 **_애플리케이션의 반응성이 낮아집니다_** .

<br/>

🔔 예시 코드 

**_jest 테스트 바로가기_**: [`./src/js/store/middleware/_exp/position_next.exp.test.js`](https://github.com/yoonsung0711/2021_sandbox/blob/main/src/js/store/middleware/_exp/position_next.exp.test.js)  

```ts
// sync blocking 이 발생하는 시나리오 

const middlewares = [
    (store) => (next) => (action) => {
        action.push([1, new Date().toISOString()]);
        next(action);
    },
    (store) => (next) => async(action) => {
        action.push([2, new Date().toISOString()]);
        action.push([await new Promise(res => setTimeout(res, 2000, 4)), new Date().toISOString()]);
        next(action);
    },
    (store) => (next) => (action) => {
        action.push([3, new Date().toISOString()]);
        next(action);
    }
];
const store = createStoreForTest(middlewares);
const action = [];
store.dispatch(action);
await new Promise(res => setTimeout(res, 2000));

// 위에서 잠시 언급했었던 것처럼 
// 미들웨어의 실행은 인자 순서대로 좌에서 우로 진행됩니다. 
// 그리고 코드 실행의 결과는 아래 composedMiddleware의 
// 실행 결과와 유사해 집니다. 
//
// 하지만 실제적인 작동은 아래와 같지 않습니다. 
// 실제로는 호출된 함수는 worker thread의 큐에 들어가기 때문에 
// 결과만 빼놓고는 아주 상이하게 처리된다는 것을 유념해야 합니다. 


// async non-blocking을 가져오는 코드 

const composedMiddleware = async(action) => {
    //첫번째 미들웨어 
     action.push([1, new Date().toISOString()]);

    //두번째 미들웨어 
    (async(action) => {
        action.push([2, new Date().toISOString()]);
        action.push([await new Promise(res => setTimeout(res, 2000, 4)), new Date().toISOString()]);

        //세번째 미들웨어 
        ((action) => {
            action.push([3, new Date().toISOString()]);

        })(action);
    })(action);
};

// 하나의 컨텍스트를 이어 나가는 모습이 단일체 함수의 실행과도 같아 보입니다. 
// 코드의 모양상 위의 코드는 전형적인 sync blocking 코드에 해당합니다. 
//
// 코드 실행결과를 확인하면 2번째 미들웨어의 처리와 3번째 미들웨어의 처리 사이에 
// 2초의 지연이 발생함을 알 수 있습니다. 
//
// 코드가 순차 실행(sync)되면서 중간에 블록킹(bloking)이 발생했습니다.
//
[
    [ 1, '2021-01-30T15:41:22.075Z' ],
    [ 2, '2021-01-30T15:41:22.075Z' ],
    [ 4, '2021-01-30T15:41:24.080Z' ],
    [ 3, '2021-01-30T15:41:24.080Z' ]
]


// async non-blocking 코드 

const middlewares = [
    (store) => (next) => (action) => {
        next(action);
        action.push([1, new Date().toISOString()]);
    },
    (store) => (next) => async(action) => {
        next(action);
        action.push([2, new Date().toISOString()]);
        action.push([await new Promise(res => setTimeout(res, 2000, 4)), new Date().toISOString()]);
    },
    (store) => (next) => (action) => {
        next(action);
        action.push([3, new Date().toISOString()]);
    }
];
const store = createStoreForTest(middlewares);
const action = [];
store.dispatch(action);
await new Promise(res => setTimeout(res, 2000));


// 함수가 next(action) 연쇄를 통해 워커 쓰레드의 큐로 등록되고 나면
// 이후에는 async하게 작동합니다. 
//
[
    [ 3, '2021-01-30T15:59:17.728Z' ],
    [ 2, '2021-01-30T15:59:17.728Z' ],
    [ 1, '2021-01-30T15:59:17.728Z' ],
    [ 4, '2021-01-30T15:59:19.729Z' ]
]

```

<br/>

</details>

<!-- #endregion 3-6 -->


<!-- #region 3-7 실수 없는 코드를 작성하기 위한 next(action)의 호출 위치 -->

<font size="4">

### 3-7. 실수 없는 코드를 작성하기 위한 next(action)의 호출 위치

</font>

<details open>
<summary>..(닫기)</summary>

* 동기 블록킹 문제 외에도 redux의 middleware의 **_코드를 실수 없이 깔끔하게 작성하기 위해서_** 도 next 호출 코드가 최상단에 위치하는 것이 좋습니다. 

    * next(action)은 분기문의 끝에다가 적어주어야 하는데 빠트리는 경우에도 에러가 발생하지 않으므로, 발견하기 힘든 버그의 원인이 되기도 합니다. 

<br/>

```ts
// next(action)을 먼저 호출하면 분기문이 끝날 때마다 next(action)을 호출해야 하는 수고로움이 사라집니다. 
// 그렇지 않으면 단일한 에러 지점이 아니라 다수의 에러 발생 지점을 가지는 것과 같습니다. 
// 컴파일러의 꼬리 물기 최적화 같은 지원이 가능해지지 않는 다음에야 처리를 마친 이후에 스택을 여는 
// 공재귀를 구현할 유인이 크지 않습니다. (물론 컨텍스트 메모리 사용량이 일정하다는 장점이 있지만)

const callNextImediateMiddleware = (store) => (next) => (action) => {
    next(action);
    if (action.type === 'target') {
        switch(action.meta) {
            case 'meta1':
                return;
            case 'meta2':
                return;
            case 'meta3':
                return;
        }
    } else {
        return;
    }
},

const callNextDelayedMiddleware = (store) => (next) => (action) => {
    if (action.type === 'target') {
        switch(action.meta) {
            case 'meta1':
                return next(action); // next(action) 첫번째 
            case 'meta2':
                return next(action); // next(action) 두번째 
            case 'meta3':
                return next(action); // next(action) 세번째 
        }
    } else {
        next(action); // next(action) 네번째
    }
},

```

<br/>

</details>

<!-- #endregion 3-7 -->

<!-- #region 3-8 미들웨어의 분기문을 줄이기 위해서는 action에 메시지 type 정보 외에 분류를 위한 meta infomation을 포함시켜야 한다. -->

<font size="4">

#### 3-8. (추가) 미들웨어의 분기 및 복잡성을 제거하기 

</font>

<details open="true">
<summary>..(닫기)</summary>

* 애플리케이션의 feature가 늘어날 수록 미들웨어에 다양한 action을 처리하기 위한 **_분기문(if-else, switch case)의 개수_** 가 늘어납니다.

    * 분기문은 프로그램의 복잡성을 증가시키므로 중첩된 분기(2 depth 이상)는 가급적 제거하는 것이 좋습니다.  

    * 객체지향 프로그래밍은 최종적으로 **_if..else 분기 로직을 클래스 다형성으로 대체한뒤 런타임 바인딩(dependency injection)_** 으로 외부화 하는 것이 목표입니다. 

    * 미니 프로젝트에서는 ~~YAGNI 원칙에 따라 분기문 제거를 위해 action 메시지에 meta 정보를 부여하여 한 분기문 내에서 처리할 수 있는 메시지의 종류를 늘리는 것까지만 시도하기로 한다~~ action을 event, document, command, async-command 네 가지로 분류하고 관련된 객체를 도입함으로써 미들웨어 분기 처리의 복잡도를 완화하였습니다.

<br/>


```ts
// 아래의 app 미들웨어는 ActionCommand, AsyncActionCommand는 처리하지 않고 
// ActionEvent와 ActionDocument의 경우에만 디스패치된 액션의 종류를 판별하여 처리합니다. 

const { ActionEvent, AsyncActionCommand, ActionCommand, ActionDocument } = require('../../entity');
const { MOD_OUTPUT_LOADED, MOD_TODO_CREATE, MOD_TODO_DELETE, APP_CACHE_FETCH, APP_CACHE_CREATE, APP_CACHE_DELETE } = require('../../vo');

const AppMiddleware = (dispatch) => (store) => (next) => (action) => {
   next(action);
   dispatch ? store.dispatch = dispatch : null;

   if (action.constructor === ActionCommand || AsyncActionCommand) {
    //    store.dispatch(action);
       return;
   }

   if (action.constructor === ActionEvent) {
       switch(action) {
           case MOD_OUTPUT_LOADED:
            store.dispatch(APP_CACHE_FETCH);
            break;
       }
   }

   if (action.constructor === ActionDocument) {
    //    store.dispatch(action);
       switch(action) {
           case MOD_TODO_CREATE:
            APP_CACHE_CREATE.arguments = action.document;
            store.dispatch(APP_CACHE_CREATE);
            break;
           case MOD_TODO_DELETE:
            APP_CACHE_DELETE.arguments = action.document;
            store.dispatch(APP_CACHE_DELETE);
            break;
       }
       return;
   }
}

// ActionCommand, AsyncActionCommand, ActionDocument, ActionEvent의 정의는 아래와 같습니다. 

class ActionCommand {
    sender;
    subject;
    command;
    arguments;
    constructor(sender, subject, command) {
        this.sender = sender;
        this.subject = subject;
        this.command = command;
    }
}

class AsyncActionCommand extends ActionCommand{
    promise;
    constructor(sender, subject, command) {
        super(sender, subject, command);
    }
}

class ActionEvent {
    sender;
    subject;
    message;
    constructor(sender, subject, message) {
        this.sender = sender;
        this.subject = subject;
        this.message = message;
    }
}

class ActionDocument {
    sender;
    subject;
    doctype;
    document;
    constructor(sender, subject, doctype) {
        this.sender = sender;
        this.subject = subject;
        this.doctype = doctype;
    }
}

```

<br/>

<!-- endregion 3-8 -->

</details>

<!-- #endregion 3 -->
