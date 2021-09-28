describe('Cache DB: pouchdb Create/Read/Delete', () => {
    let cacheDB;

    beforeAll(() => {
        cacheDB = require('./index')();
    })
    afterEach(async () => {
        await cacheDB.resetDB();
    })

    it('create a item', async () => {
        let expected = {
            id: 'C#4F',
            name: 'this is for testing couchdb',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await cacheDB.createItem({
            ... expected
        });
        const actual = await cacheDB.readItem(expected.id);
        expect(actual).toEqual(expected);
    })

    it('read all items', async () => {
        let expected = [
            {
                id: 'R34K',
                name: 'this is for testing couchdb',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            }, {
                id: '324G',
                name: 'this is for testing couchdb',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            },
        ];
        expected.forEach(cacheDB.createItem);
        const expectedIds = expected.map(e => e.id);
        const actual = (await cacheDB.readAllItems()).map(doc => doc.id);
        actual.forEach(a => expect(expectedIds.includes(a)).toBeTruthy());
    })

    it('delete a item', async () => {
        let expected = [
            {
                id: '58R@',
                name: 'this is for testing couchdb delete',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            }, 
            {
                id: '37!4',
                name: 'this is for testing couchdb delete',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            },
        ];
        expected.forEach(cacheDB.createItem);
        await cacheDB.deleteItem(expected[1].id);
        const actual = await cacheDB.readAllItems();
        expect(actual).toEqual([expected[0]]);
    })

})
