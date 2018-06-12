var expect = require('chai').expect;
import React from 'react';
import ReactDOM from 'react-dom';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('React', function() {

    var document;
    beforeEach(function() {
        document = new JSDOM(`<div id="root"></div>`).window.document;
    });
    it('can render an element', function() {
        const element = <h1 id="greetings">Hello world</h1>;
        ReactDOM.render(
            element,
            document.getElementById('root')
        );

        expect(document.getElementById('greetings').innerHTML).to.equal('Hello world');
    });
    it('can render a functional component', function() {
        function Greetings(props) { return <h1 id="greetings">{props.message}</h1>; }
        ReactDOM.render(
            <Greetings message="Hello world" />,
            document.getElementById('root')
        );

        expect(document.getElementById('greetings').innerHTML).to.equal('Hello world');
    });
    it('can render a class component', function() {
        class Greetings extends React.Component {
            render() { return <h1 id="greetings">{this.props.message}</h1>; }
        }
        ReactDOM.render(
            <Greetings message="Hello world" />,
            document.getElementById('root')
        );

        expect(document.getElementById('greetings').innerHTML).to.equal('Hello world');
    });
    it('can render custom class attributes', function() {
        class Greetings extends React.Component {
            constructor(props) {
                super(props);
                this.message = 'Hello world' ;
            }
            render() { return <h1 id="greetings">{this.message}</h1>; }
        }
        ReactDOM.render(
            <Greetings />,
            document.getElementById('root')
        );

        expect(document.getElementById('greetings').innerHTML).to.equal('Hello world');
    });
    it('uses special attribute state to update UI for you', function() {
        class Greetings extends React.Component {
            constructor(props) {
                super(props);
                this.state = { message:'Hello world' };
            }
            render() { return <h1 id="greetings">{this.state.message}</h1>; }
            componentDidMount() {
                this.setState({ message:'updated' });
            }
        }
        ReactDOM.render(
            <Greetings />,
            document.getElementById('root')
        );

        expect(document.getElementById('greetings').innerHTML).to.equal('updated');
    });
});
