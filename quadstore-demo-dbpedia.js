const sparqlParser = require('sparqljs').Parser;
const fileOps = require('fs');
const parser = new sparqlParser();
const https = require('https')

function validateAndDisplayParsedQuery(unparsedQuery) { // if this throws error, query is invalid 
    const parsedQuery = parser.parse(unparsedQuery);
    console.log(parsedQuery);
}

function sendHttpRequest(unparsedQuery) {

    const sparqlQueryPath = encodeURI(`/sparql?default-graph-uri=http://dbpedia.org&query=${unparsedQuery}&format=json`);

    const options = {
        hostname: 'dbpedia.org',
        path: sparqlQueryPath,
        method: 'GET'
    };
    
    const req = https.request(options, result => {
        console.log(`statusCode: ${result.statusCode}`);
    
        result.on('data', data => {
            fileOps.appendFileSync('result.txt', data.toString('utf8'));
        });
    });
    
    req.on('error', error => {
        console.error(error);
    });
    
    req.end();
}

function main() {
    const unparsedQuery = fileOps.readFileSync('query.txt', 'utf8')
    validateAndDisplayParsedQuery(unparsedQuery);
    sendHttpRequest(unparsedQuery);
}

main();