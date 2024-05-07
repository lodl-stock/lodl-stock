import client from 'prom-client';
let register = new client.Registry();

// define metric
const accessCount = new client.Counter({
    name: "access_count",
    help: "Number of accesses on the page"
});

// register metric
register.registerMetric(accessCount);

const mailCount = new client.Counter({
    name: "mail_count",
    help: "Number of emails sent to users"
});

// register metric
register.registerMetric(mailCount);

register.setDefaultLabels({
    app: 'hello-api'
});

client.collectDefaultMetrics({
    register
});

export { register, accessCount, mailCount }
