// Cloud Base Storage
const bucket = "cloud://linside-dev.6c69-linside-dev";

var config = {

  url: {
    bucket,

    // Movies Covers
    covers: `${bucket}/images/covers/`,
  }
};

module.exports = config;