import { Client } from '@elastic/elasticsearch';
import pinoElasticsearch from 'pino-elasticsearch';

// Read elasticsearch tls credentials
let caString = '';
let crtString = '';
let keyString = '';
const tlsCertDir = Bun.env.APP_ES_CERT_DIR;
try {
    [caString, crtString, keyString] = await Promise.all([
        Bun.file(tlsCertDir + '/ca.crt').text(),
        Bun.file(tlsCertDir + '/app.crt').text(),
        Bun.file(tlsCertDir + '/app.key').text(),
    ]);
} catch (error) {
    console.error('Elastic TLS files are missing');
}

const nodeURL = Bun.env.ELASTIC_URI_SECURED || 'https://172.16.32.40:9200';
const eSTls = {
    ca: caString,
    cert: crtString,
    key: keyString,
};
const eSAuth = {
    username: Bun.env.ELASTIC_USER,
    password: Bun.env.ELASTIC_PASSWORD,
};

export const streamToElastic = pinoElasticsearch({
    index: 'logs-api',
    node: nodeURL,
    esVersion: 8,
    flushBytes: 1000,
    flushInterval: 3000,
    auth: eSAuth,
    tls: eSTls,
});

streamToElastic.on('error', (err) => {
    console.error('Pino streamToElastic error:', err);
});

export const eSClient = new Client({
    node: nodeURL,
    tls: eSTls,
    auth: eSAuth,
});
