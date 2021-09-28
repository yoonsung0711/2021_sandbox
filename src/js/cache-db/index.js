const PouchDB = require('pouchdb');
// const PouchDB = require('pouchdb-browser');
PouchDB.plugin(require('pouchdb-adapter-memory'));
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-authentication'));


const createDB = () => {
    let conn;
    return new (class Singleton {
        constructor() {
            if (!conn) {
                conn = new PouchDB('todo', { adapter: 'memory' })
            }
        }
        getConnection() {
            return conn;
        }
        async seedItems(items) {
            const sampleTodos = items || [
                {
                    id: 'efd3',
                    name: 'this is from seed',
                    date: '2021-01-20',
                },
                {
                    id: '9377',
                    name: 'this is from seed, too',
                    date: '2021-01-21',
                },
            ];
            sampleTodos.forEach(async(itemTodo) => {
                await this.createItem(itemTodo);
            });
        }
        subscribeCache() {
            conn.changes({
                since: 'now', // 'now'
                live: true
            }).on('change', (change) => (change))
        }
        async resetDB() {
            await conn.destroy();
            conn = new PouchDB('todo', { adapter: 'memory' })
        }
        async createItem(item) {
            return conn.post({
                ...item
            });
        }
        async readItem(docId) {
            const doc = (await conn.find({
                selector: { id: docId },
                // sort: ['name']
            })).docs[0]
            // console.log(doc);
            // const doc = (await conn.find({
            //     selector: { id: docId },
            //     // sort: ['name']
            // })).docs[0]
            delete doc._id;
            delete doc._rev;
            return doc;
        }
        async readAllItems() {
            const raw = await conn.allDocs({include_docs: true});
            const result = raw.rows.map(n => {
                const doc = n.doc;
                delete doc._id;
                delete doc._rev;
                return doc;
            })
            return result;
            // return (await res).rows.map(n => {
            //     const doc = n.doc;
            //     delete doc._id;
            //     delete doc._rev;
            //     return doc;
            // });
        }
        async deleteItem(docId) {
            const doc_Id = (await conn.find({
                selector: { id: docId },
            })).docs[0]._id;
            return conn.get(doc_Id).then(function(doc){
                conn.remove(doc)
            });
        }
    }) ();
}

module.exports = createDB;
