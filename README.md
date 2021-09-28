## 개념 증명(Proof of Concept)을 위한, 샌드박스 미니 프로젝트 


> 메인 프로젝트<sup>[1](#footnote_1)</sup>를 진행하며 발생한 기술적 문제를 해결하고   
> 테스트 주도 개발을 통해  여러 가지 대안적 실험을 진행할 수 있는   
> <font color="red">샌드박스 미니 프로젝트</font>를 수행하고자 합니다.

<br/>

<font color="purple"><span style="font-weight:bold">

[개발환경 보기 / 사용한 라이브러리 보기](https://yoonsung0711.github.io/2021_sandbox/)

<br/>

목차 

</span></font>


1. 동기 및 증명 개념

2. 샌드박스 미니 프로젝트 작성 원칙

3. 메인 프로젝트에서 발생한 문제점과 해결 과정

    다른 문서 가기 - [>>>>> 미들웨어를 어떻게 작성할 것인가](problem_01.md)  

    다른 문서 가기 - [>>>>> 브라우저 캐싱과 원격 데이터베이스로 PWA를 어떻게 구현할 것인가](problem_02.md)

4. 프로젝트를 진행하며 새롭게 습득하게 된 기법들

5. 회 고 (Retrospective)

<br/>

### 1. 동기 (Motivation) 및 증명 개념 (Concepts)

<!-- #region 1 -->

<details open>
<summary>...(닫기)</summary>

<br/>

🔥 **_샌드박스 미니 프로젝트_** 를 시작하게 된 **_주요 동기_**:   


* __개념 증명 및 예광탄 개발__: 기존에 진행하던 메인 프로젝트에 여러 기능이 부가되면서, 변경에 따른 파급효과가 부담스러워 새로운 실험적 시도를 하지 않게  되었습니다. 이 같은 문제 의식에서 다양한 디자인, 코딩 스타일을 실험해 보기 위한 **_샌드박스_** 역할을 수행하는 동시에, 구현하고자 하는 기술을 사전 점검하는 **_개념 증명_** 을 대신하고자, 샌드박스 미니 프로젝트를 시작하게 되었습니다.

* __프로젝트 컨셉 조감도__: 미니 프로젝트는 메인 프로젝트가 CI / CD 운영 환경에서 안정적으로 중단 없이 배포되는 시점까지, 메인 프로젝트의 전체적인 컨셉(사용된 기술, 개발 방법론, 워크플로우)을 최소한의 기능으로 요약하여 보여줄 수 있는 축소판으로 지속적으로 개선 보완해 나갈 예정입니다. 


<br/>

🔥 **_샌드박스 미니 프로젝트_** 를 통해 **_증명하고자 하는 것_** 들: 


* __테스트 주도 개발__: e2e 테스트 도구(cypress)와 유닛 테스트 도구(jest)를 적극적으로 활용하여, 주요 테스트 기법(SUT, fixtures / stub, fake, mock, spy)의 개념과 red-green-blue TDD 워크플를 사용한 지속적인 개발이 실제적으로 유용하다는 것을 증명하고자 합니다. 샌드박스 미니 프로젝트에서 테스트 주도 개발을 통해 지속적으로 변경 가능한 코드베이스를 구축한 경험을 통해 메인 프로젝트에서도 이를 실천해 나가고자 합니다. 

* __반응형 및 CQRS__ : 상태 관리 라이브러리(redux)의 구현부에 대한 다양한 테스트 코드를 작성함으로서, 반응형 넌블락 비동기 처리를 가능하게 하는 pub-sub + callback-base continuation passing style (middleware 아키텍처)가 작동하는 방식을 이해하고, 이를 기반한 메시지 주도 개발을 실천하고자 합니다. (데이터 소스로 확장)

* __함수형 프로그래밍의 실천__ : 주요 알고리즘 구현시 함수형 기본 문법(map, reduce)을 사용하고, 런타임에 의존성 주입이 가능한 high order function을 적극 사용하여, 읽기 쉽고 선언적이며, context-free하고 테스트 가능한 코드를 작성하고자 합니다.

* __오프라인 퍼스트 (PWA)의 구현__ : 브라우저 캐시 메모리 데이터베이스(pouchdb)와 문서 기반 동기화 분산 데이터베이스(couchdb)를 사용하여 백엔드 서버 운영 환경에 전적으로 의존하지 않는 프로그레시브 웹 애플리케이션을 구현하고자 합니다. 


</details>

<br/>

<!-- [<<< 목차로 돌아가기]() -->

<!-- #endregion 1 -->

### 2. 샌드박스 미니 프로젝트 작성 원칙

<!-- #region 2 -->

<details open>
<summary>...(닫기)</summary>

<br/>

⚠️ **_샌드박스 미니 프로젝트_** 가 지향하는 **_개발 원칙들_** : 


* __YAGNI(You aren't gonna need it)__: 개념 증명에 필요한 코드만 구현하기 위해 의식적으로 노력하고 있습니다. 미니프로젝트는 기능의 수직적 확장하는 데 주안점을 두고 있으며, 리팩토링과 실험적인 시도를 가로막는 수평적인 기능 확장(feature의 증가)는 지양합니다. 특별한 필요가 발생하지 않는 한 Todo 앱의 기능은 등록과 삭제 두가지만 유지할 계획입니다.

* __점진적 개발(Incremental Model)__: 사전 설계(Design Up Front) 없이 테스트 코드만으로 점진적으로 개발을 진행해 나갈 예정입니다. 소규모 토이 프로젝트를 반복하면서 fancy하지만 실현 불가능한 약속을 남발하는 기획보다는 견고한 테스트 코드와 to-do-list를 최소한으로 유지하는 것이 중요하다는 사실을 깨달았습니다. 

* __Simple is Best__: third party dependency를 설치할 정도의 복잡한 기능 구현은 지양할 예정입니다. 그럼에도 불구하고 개념 증명에 필수적이고 작동 방식을 정확히 이해할 필요가 있는 경우(이를 테면 redux 같은 라이브러리)는 내부 구현을 직접 꼼꼼히 공부해 나가면서 실험적인 테스트 코드를 작성해볼 예정입니다. 

* __디자인 고민은 먼저, 결정은 나중에__: 반복은 방지하는 것이 아니라 발견하는 것이라는 지침에 맞게, 확인된 반복 코드에 대해서만 반복을 제거할 예정입니다. 추후 발생가능한 문제들과 이를 방지할 디자인 결정은 한번씩 고민해 보는 것으로 만족하고, 반복이 실제로 발견되기 전까지는 디자인 결정을 유보하고자 합니다.

* __Outside-In 개발 방식 고수__: 경험상 끝나지 않는 설계, 사용성이 떨어지는 불편한 인터페이스가 양산되는 큰 요인은 client side 코드를 먼저 작성해 보지 않았기 때문이었습니다. 이미 알고 있는 작은 기능일 지라도, 테스트 코드 및 구현체는 항상 바깥쪽 인터페이스를 먼저 고려하는 outside-in 방식으로 작성해 나갑니다. 

</details>

<br/>

<!-- [<<< 목차로 돌아가기]() -->

<!-- #endregion 2 -->

### 3. 메인 프로젝트에서 발생한 문제점과 해결 과정

<!-- #region 3 -->

<details open>
<summary>...(전체닫기)</summary>

#### [문제점 1: Redux Middleware를 어떻게 작성할 것인가?](./problem_01.md)

<br/>

> 메인 프로젝트에서 react 컴포넌트의 로딩과 사용자 입력에 의해 발생하는 상태 변화와 관련한 이벤트들을 command, query, event   
> 세 가지로 세분화하고 다수의 이벤트 핸들러(Reducer, APP/ LOG/ UI/ ASYNC (CACHE/HTTP) /...)를  추가해나가는 과정 중에   
> middleware의 구현과 메시지 체인이 복잡해지면서 동기화 관련 버그가 발생하게 되었습니. 버그 수정에 많은 시간이 걸리게 됨에 따라  
> 메인 프로젝트 개발을 잠시 멈추고 미니 프로젝트를 통해 미들웨어 연쇄에 대한 탐구 및 미들웨어의 추상화에 대해 고민하고자 합니다. 

<br/>

##### 해결에 필요한 질문/과제들  

⚡️ **_middleware_** 연쇄는 **_어떻게 일어나는가_** : 

* redux 경량 구현체 + 테스트 코드 작성하기

* redux 합성 함수 (Compose) 살펴보기

* redux 앞으로 차기 (CPS) 살펴보기

* middleware 호출 스택이 열리는 순서

* middleware 내부에서 dispatch가 호출될 경우 호출 스택이 쌓이는 양상

* next(action) 호출 위치에 따라 niddleware chain의 동작은 어떻게 달라지는가

* 실수 없는 코드를 작성하기 위한 next(action)의 호출 위치

* (추가) 미들웨어의 분기 및 복잡성을 제거하기]

<br/>

#### [문제점 2: 브라우저 캐싱 + 원격 데이터베이스로 PWA 구현하기](./problem_02.md)

<br/>

> 메인 프로젝트에 적용할 offline first 기술로 service worker, rabbitMQ(or kafka) 등을 검토하던 끝에 data sync와 관련한   
> 구현이 가장 간편한 '브라우저 캐시(pouchdb) + 문서 기반 동기화 데이터베이스(couchdb)'를 사용하기로 최종 결정하였습니다.   
> 문제는 이와 같은 결정이 지연되는 동안 메인 프로젝트의 기능 개발이 많이 진전되어 복잡성이 증가한 터라 메인 프로젝트에   
> 직접 패키지를 추가하고, 기능을 확장하는 것이 부담스러워 미니 프로젝트에서 예광탄 개발을 먼저 시도해보기로 했습니다. 

<br/>

##### 해결에 필요한 질문/과제들  

⚡️ **_PWA_** 를 구현하는 가장 쉽고 빠른 방법은 무엇인가  : 

<font color="pink">

* 브라우저 cache 데이터베이스는 어떻게 작동하는가 (라이브러리 사용 ✓)
* cache 데이터베이스와 remote 데이터베이스의 동기화는 어떻게 작동하는가 (라이브러리 사용 ✓)

</font>

* cache-DB 연결 객체는 언제 생성하고 어떻게 관리하나 (완결)
* cache-DB 테스트 코드 작성하기 (완결)

<font color="pink">

* CD/CI 자동화를 위해 Couchdb를 도커 컨테이너로 배포하기 (미결)
* Remote 동기화 데이터베이스의 인증 전략 (미결)

</font>

</details>

<br/>

<!-- [<<< 목차로 돌아가기](##-개념-증명(Proof-of-Concept)을-위한,-샌드박스-미니-프로젝트) -->

<!-- #endregion 3 -->

### 4. 프로젝트를 진행하며 새롭게 습득하게 된 기법들 

<!-- #region 4 -->

<br/>

<details open>
<summary>..(전체닫기)</summary>

<br/>

🍀 프로젝트를 진행하는 과정 중에 습득한 **_기법들_** : 

* 미들웨어와 관련한 테스트 케이스 명명시  타입 객체 enum(vo)와 string interpoation을 이용한 renderer를 사용하는 기법을 익혔습니다. 

    <details open>
    <summary>..(닫기)</summary>

    * 미들웨어 개발시 dispatch action과 관련한 객체와 변수의 이름을 수시로 바꾸는 과정 중에 테스트 제목까지 신경써서 수정할 여력이 없었습니다. 

    * enum 객체를 변경할 때 테스트 제목도 함께 변경되도록 action 객체로부터 텍스트를 생성하는 util을 만들어 사용하니 변경의 부담이 적어졌습니다.  

    <br>

    ```ts
    // src/js/store/middleware/app/app.middleware.test.js

    const { logCreator: _ } = require('../log/log.util');
    const { MOD_OUTPUT_LOADED } = require('../../vo');

    describe('Middleware: app', () => {
        it(`catches ActionEvent with ${_(MOD_OUTPUT_LOADED)}`, () => {
        
        })
    })

    // MOD_OUTPUT_LOADED 는 ActionEvent 객체로 sender, subject, message 프로퍼티를 가지는데 
    // 디스패치 시에 '[MOD] OUTPUT    |LOADED|'와 같은 로그가 생성됩니다. 
    // 로그에 출력되는 형식 그대로 테스트 제목이 생성되도록 런타임시 logMiddleware에 logCreator 유틸을 주입하고 
    // 해당 유틸을 테스트 제목 생성시에도 활용하였습니다. 

    |PASS| src/js/store/middleware/app/app.middleware.test.js 
    
     Middleware: app
         ✓ catches ActionEvent with [MOD] OUTPUT    |LOADED| (21 ms)
          
     Test Suites: 1 passed, 1 total
     Tests:       1 passed, 1 total
     Snapshots:   0 total

    ```

    <br>

    </details>

* 미들웨어 테스트 코드를 작성할 때 파라미터 재할당을 이용한 shadowing으로 테스트 code flow와 정상적인 code flow 처리가 취사 선택될 수 있도록 하였습니다.

    <details open>
    <summary>..(닫기)</summary>

    * middleware 테스트시 합성함수 내측의 dispatch에 spyOn가 제대로 작동하지 않아 객체망 통신을 테스트하는 것이 곤란해졌습니다. 

    * 처음에는 의존성으로 spy객체를 직접 하나 둘 씩 넣어줬는데, 미들웨어 처리와 관계없는 코드가 의존성이 되어 깔끔하지 못하고 코드 흐름을 읽는데도 방해가 되었습니다. 

    <br/>

    ```ts
    // src/js/store/middleware/async/async.middleware.js

    // # 최초 시도한 기법
    //
    // dispatch에 spy객체를 전달할 수 없어 jest.spyOn으로 생성한 spy객체를 주입하고 
    // 코드 내에서 명시적으로 spy 객체를 사용하며 어떤 분기가 실행되는지를 일일히 확인해 보았습니다. 

    const AppMiddleware = ({ spy }) => ({ dispatch }) => (next) => (action) => {
      next(action);
      switch (action.type) {
        case ...: 
          spy() // spy객체 호출.. 상당히 좋지 않아 보입니다.  
          dispatch(...)
          return
        case ...: 
          spy() // spy객체 호출.. 상당히 좋지 않아 보입니다.  
          dispatch(...)
          return
        default:
          spy() // spy객체 호출.. 상당히 좋지 않아 보입ㄴ디ㅏ.  
          dispatch(...)
          return
      }
    }; 

    //새롭게 바꾼 기법 

    const AsyncMiddleware = (dispatch) => (store) => (next) => async(action) => {

        next(action);

        let res;
        if (action.constructor !== AsyncActionCommand) {
            return;
        }

        dispatch ? (store.dispatch = dispatch) : null; // 테스트가 필요할 때만 dispatch에 stub, spy 등을 주입 후 
                                                       // store.dispatch를 재할당(shadowing) 해서 원래 처리를 변경하고  
                                                       // dispatch를 주입하지 않으면 원래 계획된 처리를 합니다. 
        switch(action) {
            case ...:
                store.dispatch(...); // 원래의 코드를 변경하지 않으니 코드 리딩에 방해가 되지 않습니다. 
                return;
            case ...:
                store.dispatch(...); // 원래의 코드를 변경하지 않으니 코드 리딩에 방해가 되지 않습니다. 
            default :
                store.dispatch(...); // 원래의 코드를 변경하지 않으니 코드 리딩에 방해가 되지 않습니다. 
                return;
        }
    };

    // 실제 테스트에서는 아래와 같이 dispatch 코드를 주입하여 dispatch 호출을 가로채서 확인합니다.  

    let actual;
    const middlewares = [AsyncMiddleware((action) => { actual = action })];


    ```

</details>

</details>

<br/>

[<<< 목차로 돌아가기](##-개념-증명(Proof-of-Concept)을-위한,-샌드박스-미니-프로젝트)

<!-- #endregion 4 -->

### 5. 회 고 (Retrospective)

<!-- #region 5 -->

<br/>

<details open>
<summary>..(닫기)</summary>

<br/>

︎︎︎︎✨︎ 프로젝트를 진행하면서 깨닫게 된 **_주관적인 경험_** : 

* TDD가 전제된다면, 소규모 프로젝트에서 구조를 잡는 과정은 타입스크립트보다 자바스크립트가 더 간편한 것 같습니다.

    * 특히 라이브러리 설치 시에, 트랜스 파일러 설정과 관련된 크고 작은 트러블 슈팅이 발생하지 않는 다는 점과 type definition 라이브러리를 dev-dependency로 별도 설치해 주지 않아도 되지 않아, 설정 작업에 정신 팔리지 않고 코딩에 집중할 수 있다는 것이 좋았다. 

    * 그럼에도 불구하고 테스트 코드를 작성하지 않는다면 소규모 프로젝트일 지라도 시작부터 타입스크립트의 도움을 받을 것 같습니다. 

    * 타입 인터페이스가 없으면 테스트 코드를 구상하기가 막연할 것이라 생각했는데, 생각보다 테스트를 짤때 인터페이스가 없다는 것이 불편하지 않았고, 오히려 유연하게 사고할 수 있고 손쉽게 코드 변경이 가능하다는 점이 좋았습니다. 

<br/>

* 코드에 대해 충분히 이해하지 못한 상태로 섣불리 추상화 수준을 높여서도 안되고, 리팩토링을 너무 미뤄도 안된다는 것을 배워가고 있습니다. 

    * 미들웨어의 개수가 늘어나고 연쇄 처리가 지면서 미들웨어 처리와 관련한 반복과 분기를 제거해야 한다는 압박감이 커져 갔습니다. 

    * 하지만 코드가 반복되는 패턴에 충분히 익숙해지기 전에, 조급히 추상화 수준을 높이다 보면 다시 코드를 리셋해야 하는 경우가 종종 발생했습니다. 

    * 테스트 코드는 추상화 시점을 언제 높여야 할지 좋은 판단 기준을 제공해주는 것 같습니다. 소비자(클라이언트측) 코드를 작성하는 중에 이미 준비과정에 복잡하다는 생각이 들면 공급자 코드를 고쳐야 겠다는 느낌이 드는데, 테스트 코드는 항상 소비자 코드를 먼저 작성하니 예방효과가 있었습니다. 


<br>

<br>

︎︎︎🌻︎ 다음 **_미니 프로젝트_** 를 통해  **_시도해 보고 싶은 것들_** : 

* 프론트엔드 미니 프로젝트와 연계하여 백엔드 프로젝트에서 CQRS를 구현해 보고자 합니다. 

    * 메시지 큐 서비스는 설정과 구동이 간편한 rabbitmq로 먼저 시도해보고 성공시에 redis와 kafka를 취사 선택하여 재구현할 계획을 가지고 있습니다. 

    * 이와 관련하여 ['기업 통합 패턴'](http://www.yes24.com/Product/Goods/14631181?OzSrank=1)을 읽고 있습니다. 예전부터 읽어보고 싶었던 책인데 프로젝트를 진행하면서 꼭 읽어봐야겠다는 생각이 들었습니다. 재미있게도 백엔드 프로젝트를 진행할 때보다 프론트엔드에서 redux의 내부 구현을 탐구하고 메시지 객체와 핸들러를 직접 설계해보며 통합 패턴에 대한 관심과 cqrs에 대한 이해가 좀 더 넓어 졌습니다.

<br/>

* redux가 middleware를 처리하는 내부 구현과 콜 스택이 쌓이는 양상을 살펴본 이후, 

    * redux saga가 왜 자바스크립트 generator를 이용해서 미들웨어 처리를 하는지 이유를 이해하게 되었습니다.

    * 미니 프로젝트가 어느 정도 완성된 이후에는 redux saga 또한 경량체로 구현해 보는 것을 목표로 삼고 있습니다.


</details>

<br>

<br>

<!-- [<<< 목차로 돌아가기](##-개념-증명(Proof-of-Concept)을-위한,-샌드박스-미니-프로젝트) -->

<!-- #endregion 5 -->


<!-- #region endnote -->

<hr style="border-top:1px solid gray"></hr>

<font size = "2">
각주     

<br/>

<a name="footnote_1">1</a>: 
전체 프로젝트의 기술 스택 및 적용 기술  

> 백엔드는   
> express와 mongodb를 이용한 **_Restful API 서버_** 과   
> apollo-express와 typeorm을 이용한 **_Graphql API 서버_** 을   
> 마이크로서비스로 분리하여 개발하고 있습니다. 
> 
>
> 프론트엔드는  
> express와 handlebar를 이용한 **_SSR 방식_** (topnav, sidebar 파트)과   
> react + redux 라이브러리를 이용한 **_SPA 방식_**을 혼용해서 개발 중에 있습니다. (app 파트)   
> 

<!-- 
* 테스트/빌드/배포 &nbsp; : &nbsp; jenkins (virtual box / macbook)  
* 코드 저장소 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &nbsp; private gitlab (virtual box / macbook)  
* 컨테이너 저장소 &nbsp;&nbsp; : &nbsp; private dockerhub (virtual box / macbook)  
* 운영/배포 서버 &nbsp;&nbsp; : kubernetes cluster on kubeadm (virtual box / z800 hp server)
-->

<br/>

* **백엔드**

    * Restful part
        * runtime: node v13
        * http 서버: express 
        * 데이터베이스: mongoose + mongo
        * 테스트 도구: jest

    * Graphql part
        * runtime: node v13
        * http 서버: express 
        * 데이터베이스: apollo + typeorm
        * 테스트 도구: jest

<br/>

* **프론트 엔드**

    * SSR part
        * runtime: node v13 (ts-node + typescript)
        * http 서버: express 
        * 렌더러 라이브러리: handlebar (mustache) 
        * css 라이브러리: bootstrap 3
        * e2e 테스트 도구: (X - 없음)
        * unit 테스트 도구: (X - 없음)

    * SPA part
        * runtime: chrome v8 (webpack + typescript)
        * 렌더러 라이브러리: react 
        * 상태관리 라이브러리: redux
        * 컴포넌트 디자인툴: storybook
        * e2e 테스트 도구: cypress
        * unit 테스트 도구: jest + enzyme
</font>


<!-- #endregion endnote -->

<!-- 
[1]: ###-1.-동기-(Motivation)-및-증명-개념-(Concepts) ""
[2]: ###-2.-샌드박스-미니-프로젝트-작성-원칙 ""
[3]: ###-3.-메인-프로젝트에서-발생한-문제점과-해결-과정) ""
[4]: ###-4.-프로젝트를-진행하며-새롭게-습득하게-된-기법들 ""
[5]: ###-5.-회-고-(Retrospective) "" 
-->
