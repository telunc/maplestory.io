import mongoose from 'mongoose';
import ProgressBar from 'progress';
import Promise from 'bluebird';
import debug from 'debug';

import { MONGO_URL } from './src/environment';

const log = debug('demo:migration');

export default async function main (modelType, requiresUpdateSelector, mutator, limitPerStep = 5000) {
	let threadLocals = {
    modelType,
    requiresUpdateSelector,
    mutator,
    limitPerStep
  };

  const runBaseBound = runBase.bind(threadLocals);
  const getTotalBound = getTotal.bind(threadLocals);
  const runMigrationBound = runMigration.bind(threadLocals);

	if (!threadLocals.modelType) throw new Error('migration#default requires model name to be passed as the first parameter')

	if (!threadLocals.requiresUpdateSelector && !argv.unsafe) throw new Error('migration#default requires a valid DB query selector to be passed as the second parameter when not running in unsafe mode');

  threadLocals.requiresUpdateSelector = threadLocals.requiresUpdateSelector || {};

  if (!threadLocals.mutator) throw new Error('app/scripts/migration#default requires an async function to be passed as a mutator for the third parameter');

  try {
    threadLocals.conn = mongoose.createConnection(MONGO_URL);

    await getTotalBound();

    const stats = await runMigrationBound();

    log('Successfully updated ' + stats.successfulCount + '/' + stats.totalCount + ' instances of model ' + threadLocals.modelType);

    if (stats.failureCount > 0) log('Failed to update ' + stats.failureCount + '/' + stats.totalCount + ' instances of model ' + threadLocals.modelType);

    return stats;
  } catch (e) {
    throw e;
  }
}

function getTotal () {
	var threadLocals = this;
	return new Promise (function (resolve, reject) {
		log('Getting number of instances for model ' + threadLocals.modelType + ' matching selector ' + JSON.stringify(threadLocals.requiresUpdateSelector));
		threadLocals.Model.count(threadLocals.requiresUpdateSelector, function (err, total) {
			if (err) return reject(err);
			threadLocals.total = total;
			log('Found ' + threadLocals.total + ' instances of model ' + threadLocals.modelType + ' matching selector ' + JSON.stringify(threadLocals.requiresUpdateSelector));
			resolve();
		});
	});
}

function runMigration () {
	var threadLocals = this;
	return new Promise(function(resolve, reject) {

		var bar = new ProgressBar(':bar :percent (:current succeeded / :error_count failed out of :total total)' , {total: threadLocals.total})

		threadLocals.count = 0;
		threadLocals.successfulMappings = {};
		threadLocals.failedMappings = {};

		function finished () {
			return resolve({
        totalCount: threadLocals.count,
        successfulCount: Object.keys(threadLocals.successfulMappings).length,
        failureCount: Object.keys(threadLocals.failedMappings).length,
				successes: threadLocals.successfulMappings,
				failures: threadLocals.failedMappings
			});
		}

		if (threadLocals.total < 1) return finished();

		log('Running migrations for ' + threadLocals.total + ' instances of model ' + threadLocals.modelType)

		iterate();

		function iterate () {
			var remaining = threadLocals.total - threadLocals.count;
			var limit = remaining < threadLocals.limitPerStep ? remaining : threadLocals.limitPerStep;
			var stepCount = 0;

			if (limit === 0) finished();

			threadLocals.Model
				.find(threadLocals.requiresUpdateSelector)
				.limit(limit)
				.exec(function(err, instances) {

					if (instances.length < 1) return finished();

					if (err) return reject(err);

					step();

					function step () {
						var oldInstance = instances[stepCount];
						if (!oldInstance) return reject(new Error('Pointer out of bounds at ' + stepCount));

						threadLocals.mutator(oldInstance)
						.then(function (instance) {
							return new Promise(function (resolve, reject) {
								instance.save(function (err, newInstance) {
									if (err) return reject(err);
									threadLocals.successfulMappings[oldInstance._id.toString()] = newInstance.toJSON();
									resolve();
								});
							});
						})
						.catch(function (err) {
							threadLocals.failedMappings[oldInstance._id.toString()] = err.message;
						})
						.finally(function () {
							threadLocals.count ++;
							stepCount ++;
							bar.tick({
								error_count: Object.keys(threadLocals.failedMappings).length
							});
							if (instances.length - 1 < stepCount) return iterate();
							step();
						});
					}
				});
		}
	});
}
