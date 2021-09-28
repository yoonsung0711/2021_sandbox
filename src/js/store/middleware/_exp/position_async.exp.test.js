
describe('Middleware: internals', () => {
    const { createStoreForMiddlewareTest } = require('#tests/middleware');

    it(`(1) right to left processing order`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => async(action) => {
                next(action);
                actual.push(1);
                return
            },
            (store) => (next) => async(action) => {
                next(action);
                actual.push(2);
                return
            },
            (store) => (next) => async(action) => {
                next(action);
                actual.push(3);
                return
            },
        ];
        const store = createStoreForMiddlewareTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 10));
        expect(actual).toEqual([3, 2, 1]);
    })

    it.skip(`(2) left to right processing order`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => async(action) => {
                actual.push(1);
                console.log('ah1');
                return next(action);
            },
            (store) => (next) => async(action) => {
                actual.push(2);
                console.log('ah2');
                return next(action);
            },
            (store) => (next) => async(action) => {
                actual.push(3);
                console.log('ah3');
                return next(action);
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 10));
        expect(actual).toEqual([1, 2, 3]);
    })

    it.skip(`(3) sync blocking processing order`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => async(action) => {
                actual.push(1);
                console.log('ah1');
                return next(action);
            },
            (store) => (next) => async(action) => {
                actual.push(2);
                console.log('ah2-1');
                await new Promise(res => setTimeout(res, 10));
                console.log('ah2-2');
                return next(action);
            },
            (store) => (next) => async(action) => {
                next(action);
                console.log('ah3');
                return actual.push(3);
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 5));
        expect(actual).toEqual([1, 2]);
    })

    it.skip(`(4) async blocking processing order`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => async(action) => {
                next(action);
                console.log('ah1');
                return actual.push(1);
            },
            (store) => (next) => async(action) => {
                next(action);
                console.log('ah2-1');
                await new Promise(res => setTimeout(res, 10));
                console.log('ah2-2');
                return actual.push(2);
            },
            (store) => (next) => async(action) => {
                next(action);
                console.log('ah3');
                return actual.push(3);
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 8));
        expect(actual).toEqual([3, 1]);
    })

    it.skip(`(5) right to left processing order + async handler 1`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷︎pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(11);
                    console.log(`ah1: ${action.type}`);
                    console.log('<stack closed');
                    return 
                } else {
                    actual.push(12);
                    console.log(`ah1-1: ${action.type}`);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(21);
                    console.log(`ah2-1: ${action.type}`);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah2-2: ${action.type}`);
                    actual.push(22);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>stack open');
                console.log('---▷pause');
                next(action);
                console.log('---▶resume');
                if (action.type === 'test') {
                    actual.push(311);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah3-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah3-2: ${action.type}`);
                    actual.push(312);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-3: ${action.type}`);
                    actual.push(32);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('----😁waiting finish');
                    console.log(`ah4a: ${action.type}`);
                    actual.push(411);
                    // actual.push(answer);
                    console.log(`ah4b: ${action.type}`);
                    actual.push(412);
                    next(action);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-4: ${action.type}`);
                    actual.push(42);
                    // next(action);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 9));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(6) right to left processing order + async handler 2`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷︎pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(11);
                    console.log(`ah1: ${action.type}`);
                    console.log('<stack closed');
                    return 
                } else {
                    actual.push(12);
                    console.log(`ah1-1: ${action.type}`);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(211);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah2-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah2-2: ${action.type}`);
                    actual.push(212);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah2-3: ${action.type}`);
                    actual.push(22);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>stack open');
                console.log('---▷pause');
                next(action);
                console.log('---▶resume');
                if (action.type === 'test') {
                    actual.push(31);
                    console.log(`ah3-1: ${action.type}`);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-2: ${action.type}`);
                    actual.push(32);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('----😁waiting finish');
                    console.log(`ah4a: ${action.type}`);
                    actual.push(411);
                    // actual.push(answer);
                    console.log(`ah4b: ${action.type}`);
                    actual.push(412);
                    next(action);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-4: ${action.type}`);
                    actual.push(42);
                    // next(action);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 9));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(7) right to left processing order + async handler 3`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷︎pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(11);
                    console.log(`ah1: ${action.type}`);
                    console.log('<stack closed');
                    return 
                } else {
                    actual.push(12);
                    console.log(`ah1-1: ${action.type}`);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(211);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah2-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah2-2: ${action.type}`);
                    actual.push(212);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah2-3: ${action.type}`);
                    actual.push(22);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('----😁waiting finish');
                    console.log(`ah3a: ${action.type}`);
                    actual.push(311);
                    // actual.push(answer);
                    console.log(`ah3b: ${action.type}`);
                    actual.push(312);
                    next(action);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-4: ${action.type}`);
                    actual.push(32);
                    // next(action);
                    next(action);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>>stack open');
                console.log('----▷pause');
                next(action);
                console.log('----▶resume');
                if (action.type === 'test') {
                    console.log(`ah4-1: ${action.type}`);
                    actual.push(41);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-2: ${action.type}`);
                    actual.push(42);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 100));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(8) right to left processing order + async handler 3`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷︎pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(11);
                    console.log(`ah1: ${action.type}`);
                    console.log('<stack closed');
                    return 
                } else {
                    actual.push(12);
                    console.log(`ah1-1: ${action.type}`);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(211);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah2-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah2-2: ${action.type}`);
                    actual.push(212);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah2-3: ${action.type}`);
                    actual.push(22);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('----😁waiting finish');
                    console.log(`ah3a: ${action.type}`);
                    actual.push(311);
                    // actual.push(answer);
                    console.log(`ah3b: ${action.type}`);
                    actual.push(312);
                    next(action);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-4: ${action.type}`);
                    actual.push(32);
                    // next(action);
                    next(action);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>>stack open');
                console.log('----▷pause');
                next(action);
                console.log('----▶resume');
                if (action.type === 'test') {
                    console.log(`ah4-1: ${action.type}`);
                    actual.push(41);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-2: ${action.type}`);
                    actual.push(42);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 100));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(9) right to left processing order + async handler 3`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(111);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah1-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah1-2: ${action.type}`);
                    actual.push(112);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah1-3: ${action.type}`);
                    actual.push(113);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷︎pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(21);
                    console.log(`ah2-1: ${action.type}`);
                    console.log('<<stack closed');
                    return 
                } else {
                    actual.push(22);
                    console.log(`ah2-2: ${action.type}`);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('----😁waiting finish');
                    console.log(`ah3a: ${action.type}`);
                    actual.push(311);
                    // actual.push(answer);
                    console.log(`ah3b: ${action.type}`);
                    actual.push(312);
                    next(action);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-4: ${action.type}`);
                    actual.push(32);
                    // next(action);
                    next(action);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>>stack open');
                console.log('----▷pause');
                next(action);
                console.log('----▶resume');
                if (action.type === 'test') {
                    console.log(`ah4-1: ${action.type}`);
                    actual.push(41);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-2: ${action.type}`);
                    actual.push(42);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 100));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(10) right to left processing order + async handler 3`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => (action) => {
                console.log('>stack open');
                console.log('-▷pause');
                next(action);
                console.log('-▶resume');
                if (action.type === 'test') {
                    actual.push(111);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah1-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah1-2: ${action.type}`);
                    actual.push(112);
                    console.log('<<stack closed');
                    return 
                } else {
                    console.log(`ah1-3: ${action.type}`);
                    actual.push(113);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷︎pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(21);
                    console.log(`ah2-1: ${action.type}`);
                    console.log('<<stack closed');
                    return 
                } else {
                    actual.push(22);
                    console.log(`ah2-2: ${action.type}`);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>stack open');
                console.log('---▷pause');
                next(action);
                console.log('---▶resume');
                if (action.type === 'test') {
                    console.log(`ah3-1: ${action.type}`);
                    actual.push(31);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-2: ${action.type}`);
                    actual.push(32);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => async(action) => {
                console.log('>>>>stack open');
                if (action.type === 'async') {
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('-----😁waiting finish');
                    console.log(`ah3a: ${action.type}`);
                    actual.push(411);
                    // actual.push(answer);
                    console.log(`ah3b: ${action.type}`);
                    actual.push(412);
                    next(action);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-4: ${action.type}`);
                    actual.push(42);
                    // next(action);
                    next(action);
                    console.log('<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 100));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })

    it.skip(`(11) right to left processing order + async handler 3`, async() => {
        let actual = [];
        const middlewares = [
            (store) => (next) => async(action) => {
                console.log('>stack open');
                if (action.type === 'async') {
                    actual.push(110);
                    console.log('----😂waiting start');
                    const answer = await action.payload;
                    console.log('-----a few minute later');
                    console.log('-----😁waiting finish');
                    console.log(`ah1a: ${action.type}`);
                    actual.push(111);
                    // actual.push(answer);
                    console.log(`ah1b: ${action.type}`);
                    actual.push(112);
                    next(action);
                    console.log('<stack closed');
                    return 
                } else {
                    console.log(`ah1-2: ${action.type}`);
                    actual.push(113);
                    // next(action);
                    next(action);
                    console.log('<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>stack open');
                console.log('--▷︎pause');
                next(action);
                console.log('--▶resume');
                if (action.type === 'test') {
                    actual.push(21);
                    console.log(`ah2-1: ${action.type}`);
                    console.log('<<stack closed');
                    return 
                } else {
                    actual.push(22);
                    console.log(`ah2-2: ${action.type}`);
                    console.log('<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>stack open');
                console.log('---▷pause');
                next(action);
                console.log('---▶resume');
                if (action.type === 'test') {
                    console.log(`ah3-1: ${action.type}`);
                    actual.push(31);
                    console.log('<<<stack closed');
                    return 
                } else {
                    console.log(`ah3-2: ${action.type}`);
                    actual.push(32);
                    console.log('<<<stack closed');
                    return
                }
            },
            (store) => (next) => (action) => {
                console.log('>>>>stack open');
                console.log('----▷pause');
                next(action);
                console.log('----▶resume');
                if (action.type === 'test') {
                    actual.push(411);
                    const promised = new Promise(res => setTimeout(res, 10, 3));
                    console.log(`ah4-1: ${action.type}`);
                    store.dispatch({ type: 'async', payload: promised });
                    console.log(`ah4-2: ${action.type}`);
                    actual.push(412);
                    console.log('<<<<stack closed');
                    return 
                } else {
                    console.log(`ah4-3: ${action.type}`);
                    actual.push(413);
                    console.log('<<<<stack closed');
                    return
                }
            },
        ];
        const store = createStoreForTest(middlewares);
        store.dispatch({
            type: 'test',
        })
        await new Promise(res => setTimeout(res, 100));
        console.log(actual);
        expect(actual).toEqual([2,1,3]);
    })
})

