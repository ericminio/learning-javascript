const { expect } = require('chai');
const initSqlJs = require('sql.js');
require('./dates.js');

describe('sql.js', () => {
    it('can create a table and insert data', async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        db.exec('create table users(id integer, name varchar(15));');
        db.exec('insert into users values (0, "Alice");');
        db.exec('insert into users values (1, "Bob");');
        const result = db.exec('select * from users');
        const [{ _, values }] = result;

        expect(values).to.deep.equal([
            [0, 'Alice'],
            [1, 'Bob'],
        ]);
    });

    it('knows about datetime', async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        db.exec(
            'create table any(id integer, created datetime default current_timestamp);'
        );
        db.exec(
            'insert into any(id, created) values (3, "2021-10-19 06:03:00");'
        );
        const result = db.exec('select * from any');
        const [{ _, values }] = result;

        expect(values).to.deep.equal([[3, '2021-10-19 06:03:00']]);
    });

    it('can digest and return js Dates', async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        db.exec(
            'create table any(id integer, created datetime default current_timestamp);'
        );
        db.exec(
            `insert into any(id, created) values (3, "${new Date(
                2021,
                9,
                19,
                6,
                3,
                0
            )}");`
        );
        const result = db.exec('select * from any');
        const [{ _, values }] = result;

        expect(new Date(values[0][1])).to.deep.equal(
            new Date(2021, 9, 19, 6, 3, 0)
        );
    });

    it('can order', async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        db.exec(
            'create table products(name text, created datetime default current_timestamp);'
        );
        db.exec(
            `insert into products(name, created) values ("mouse", "${(1)
                .day()
                .ago()}");`
        );
        db.exec(
            `insert into products(name, created) values ("keyboard", "${(3)
                .days()
                .ago()}");`
        );
        const result = db.exec(
            'select name from products order by created desc'
        );
        const [{ _, values }] = result;

        expect(values).to.deep.equal([['mouse'], ['keyboard']]);
    });
});
