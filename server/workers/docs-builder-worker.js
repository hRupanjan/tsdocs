require("esbuild-register/dist/node").register();

const {
  generateDocsForPackage,
} = require("../package/extractor/doc-generator");
const logger = require("../../common/logger");

let workerActiveTime = Date.now();

setInterval(() => {
  if (Date.now() - workerActiveTime > 1000 * 60 * 5) {
    console.log("Worker remained idle for too long, dying.");
    process.exit(1);
  }
});

module.exports = async (job) => {
  try {
    workerActiveTime = Date.now();
    return await generateDocsForPackage(job.data.packageJSON, {
      force: job.data.force,
    });
  } catch (err) {
    job.updateData({
      ...job.data,
      originalError: {
        code: err.message,
        stacktrace: err?.originalError?.stack,
        message: err?.originalError?.message,
      },
    });
    throw err;
  }
};
