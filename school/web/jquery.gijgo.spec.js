var expect = require('chai').expect;
const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');
var html = `
<html>
<head>
    <title>Getting Started with jQuery Grid</title>
    <meta charset="utf-8" />
    <script src="/lib/jquery-3.3.1.min.js"></script>
    <script src="/lib/gijgo-1.9.10.js" type="text/javascript"></script>
</head>
<body>
    <table id="grid"></table>
    <script type="text/javascript">
        $(document).ready(function () {
            var grid = $('#grid').grid({
                dataSource: '/Players/Get',
                columns: [
                    { field: 'ID', width: 56 },
                    { field: 'Name', sortable: true },
                    { field: 'PlaceOfBirth', title: 'Place Of Birth', sortable: true },
                    { field: 'DateOfBirth', title: 'Date Of Birth', type: 'date', width: 150 }
                ],
                pager: { limit: 5 }
            });
        });
    </script>
</body>
</html>
`;

describe.skip('Gijgo', ()=>{

    var server;
    beforeEach(function(done) {
        server = new LocalServer({
            '/': html,
            json: {
                '/Players/Get?page=1&limit=5': {
                    records: [
                        {
                            "ID":1,
                            "Name":"Batman",
                            "PlaceOfBirth":"Gotham",
                            "DateOfBirth":"\/Date(-122227200000)\/",
                            "CountryID":2,
                            "CountryName":"Earth",
                            "IsActive":true,
                            "OrderNumber":1
                        },
                        {
                            "ID":2,
                            "Name":"Superman",
                            "PlaceOfBirth":"Kripton",
                            "DateOfBirth":"\/Date(-122227200000)\/",
                            "CountryID":1,
                            "CountryName":"Kripton",
                            "IsActive":false,
                            "OrderNumber":2
                        }
                    ],
                    total:2
                }
            }
        });
        server.start(done);
    });
    afterEach(function(done) {
        server.stop(done);
    });

    it('can be digested by zombie', (done)=>{
        browser.visit('http://localhost:' + server.port)
            .then(function() {
                setTimeout(() => {
                    let document = browser.document;
                    expect(document.querySelector('#grid [data-position="2"]').innerHTML).to.contain('Superman');
                    done();
                }, 100);
            });
    });
});
