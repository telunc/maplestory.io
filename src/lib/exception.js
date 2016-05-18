import raven from 'raven';
import debug from 'debug';

import stats from './stats';
import { SENTRY_DSN } from '../environment';

const log = debug('stream:exception');

let client = null;

if (SENTRY_DSN) {
  client = new raven.Client(SENTRY_DSN);
  client.patchGlobal(SENTRY_DSN);
}

export default function exception (e) {
  if (client) client.captureException(e);
  stats.increment('exception.thrown');
  log(e);
}
