import stats from 'datadog-metrics';

import {
  DATADOG_API_KEY,
  DATADOG_APP_KEY
} from '../environment';

function collectProcessMetrics () {
  if (typeof process.cpuUsage === 'function') { //works on node 6 only
    const { system, user } = process.cpuUsage();
    stats.gauge('cpu.system', system);
    stats.gauge('cpu.user', user);
  }
  const { rss, heapTotal, heapUsed } = process.memoryUsage();
  stats.gauge('memory.rss', rss);
  stats.gauge('memory.heapTotal', heapTotal);
  stats.gauge('memory.heapUsed', heapUsed);
}

if (DATADOG_API_KEY && DATADOG_APP_KEY) {
  stats.init({
    host: 'stream',
    prefix: 'stream.',
    apiKey: DATADOG_API_KEY,
    appKey: DATADOG_APP_KEY
  });
  setInterval(collectProcessMetrics, 5000);
}

export default stats;
