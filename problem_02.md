## 브라우저 캐싱 + 원격 데이터베이스로 PWA 구현하기 

<font size="3" color="red">

⚡️ 부제: PWA를 구현하는 가장 쉽고 빠른 방법은 무엇인가  : 

</font>

> 샌드박스 v1.0.0에서는 pouchdb와 couchdb를 이용하여 PWA를 구현하였습니다.   
> 브라우저 캐싱 + 원격 데이터베이스 동기화를 경량으로 직접 구현하는 것은 가능한지   
> 여부를 따져볼 예정이나, 그 보다 중요한 토픽인 '원격 데이터베이스의 인증전략    
> 문제를 먼저 탐구'한 뒤에 샌드박스 프로젝트 v2.0.0에 추가 여부를 결정할 예정입니다. 

<br/>

<font color="purple"><span style="font-weight:bold">

목차 

</span></font>

1. [문제 해결의 기대효과](###-1.-문제-해결의-기대효과-(expected-effect-of-problem-solving))

2. [(잠정적인) 결론](###-2.-잠정적인-결론-(tentative-conclusions))

3. [탐구 과정](###-3.-탐구-과정-(exploration-process))  

    3..1 [cache-DB 연결 객체는 언제 생성하고 어떻게 관리하나](####-3-1.-cache-DB-연결-객체는-언제-생성하고-어떻게-관리하나)

    3..2 [cache-DB 테스트 코드 작성하기](####-3-2.-cache-DB-테스트-코드-작성하기)

4. [다음 샌드박스 프로젝트에서 도전해 볼 과제들]()  

<br/>

<!-- #region 1 문제 해결의 기대효과 (expected effect of problem solving) -->

### 1. 문제 해결의 기대효과 (expected effect of problem solving)

<details open>
<summary>...(닫기)</summary>

<br/>

🙉 이 **_문제_** 를 해결하면 :   

* 백엔드 서버 모킹이나 mock service 코드를 작성하고 백엔드 api를 다시 만들어야 하는 번거로움 없이 자연스럽게 개발을 이어나갈 수 있습니다. 

* 메시지 큐 서버를 따로 구현하지 않더래도 푸시알람 같은 서비스를 구현해볼 수 있고, 이벤트 주도 개발에 조금 더 친숙해질 수 있을 거라 기대합니다 

* 웹앱 방식의 PWA의 동작 방식에 대해 이해하고 관련된 여타 기술을 익히는데 징검다리 역할을 해줄 거라 생각합니다. 


</details>

<br/>

<!-- #endregion 1 -->

<!-- #region 2 잠정적 결론들 (tentative conclusions) -->

### 2. (잠정적인) 결론 (tentative conclusions)

<details open>
<summary>...(닫기)</summary>

<br/>

🐣 이 **_문제_** 를 탐구해보니 :   


* 브라우저 cache 데이터베이스에 연결하는 접근하는 conn 객체는 

    * 테스트나 다중 접속등을 고려할 때 dao 객체 내부에 싱글턴 객체로 생성하는 방법이 합리적이라 생각했습니다. 

* pouchdb는 여타 문서 기반 NoSql 서버와 마찬가지로 RDBMS에 비해 사용이 직관적이고 간편했습니다. 

    * 캐시 브라우저이지만 테스트 시에도 일반 데이터베이스와 비슷한 방식으로 테스트 의존성 주입이 가능합니다. 

<br/>

</details>

<br/>

<!-- #endregion 2 -->

<!-- #region 3 탐구 과정 (exploration process) -->

### 3. 탐구 과정 (exploration process)

<details open>
<summary>...(닫기)</summary>

<!-- #region 3-1 redux 라이브러리 구현체 및 테스트 코드 작성하기 -->

#### 3-1. cacheDB 연결 객체는 언제 생성하고 어떻게 관리하나

<details open>
<summary>...(닫기)</summary>

<br/>

>
>
>



<br/>

<font size="3">⌘</font> 작성한 코드 

**_● compose_**: [`src/js/store/_lib/compose.js`](https://github.com/reduxjs/redux/blob/master/src/compose.ts)  
**_● createStore_**: [`src/js/store/_lib/createStore.js`](https://github.com/reduxjs/redux/blob/master/src/compose.ts)  

<br/>

<font size="3">⌘</font> 테스트 코드

**_● compose_**: [`src/js/store/_lib/compose.test.js`](https://github.com/reduxjs/redux/blob/master/src/compose.ts)  
**_● createStore_**: [`src/js/store/_lib/createStore.test.js`](https://github.com/reduxjs/redux/blob/master/src/compose.ts)  

<br/>

</details>

<!-- #endregion 3-1 -->


<!-- #region 3-2 싱글턴 Cache-DB 의존성 주입하기  -->

#### 3-2. cache-DB 테스트 코드 작성하기

<details open>
<summary>...(닫기)</summary>

#### ❖ 합성 함수 (compose function)

```ts
// src/js/store/_lib/compose.js

module.exports = (...funcs) => {
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

```

<br/>

* **__중첩 합수 vs 합성 함수__** : 함수 값에 대한 합성과, 함수를 다른 함수에 적용시키는 합성 함수는 엄연히 다른 개념입니다. 

    * 전자는 함수가 적용된 값을 다시 함수에 적용시키는 것으로 함수의 실행 및 평가가 가장 안쪽 함수부터 시작됩니다. 

    * 후자는 가장 바깥쪽 함수부터 실행되며 바깥쪽 함수의 구문 내부에서 인자로 받은 안쪽 함수에 대한 호출이 발생할 때 비로소 안쪽 함수가 평가됩니다. 

<br/>

* 상기 compose 함수는 임의 개수의 인자로 받은 func을 rest 파라미터로 받아 배열로 변환하고 **_reduce 접기 연산_** 을 적용하여, 오른쪽에서 왼쪽으로 함수의 인자를 전달합니다. 

    * 접기 연산에 의해  함수의 포인터를 다른 함수에 연쇄적으로 넘기는 것만으로는 cps가 구현된 것은 아닙니다. 

    * 나중에 다루겠지만 **_middleware에서 (next)로 다음 함수를 인자로 받고, 함수 내에서 다시 (next) 함수를 호출하며 context를 넘겨주는 부분__** 이 cps 구현에 해당합니다.

<br/>

</details>

<!-- #endregion 3-2 -->


</details>

<!-- #endregion 3 -->
