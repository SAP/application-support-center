module.exports = {
  getStorageDir,
  checkStorageFoldersExist
};

var fs = require('fs');

function getStorageDir() {
  var containerDir = '';
  if (process.env.VCAP_SERVICES) {
    const fsStorages = JSON.parse(process.env.VCAP_SERVICES)['fs-storage'];
    if (fsStorages) {
      const fsStorage = fsStorages.find((item) => {
        return item.label === 'fs-storage';
      });

      if (fsStorage) {
        containerDir = fsStorage.volume_mounts[0].container_dir + '/';
      }
    }
  }
  return containerDir;
}

function checkStorageFoldersExist(resourcesDir) {
  if (!fs.existsSync(resourcesDir + '/app_ipas')) {
    fs.mkdirSync(resourcesDir + '/app_ipas');
  }

  if (!fs.existsSync(resourcesDir + '/app_icons')) {
    fs.mkdirSync(resourcesDir + '/app_icons');
  }
}
