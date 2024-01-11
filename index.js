/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
'use strict';
const BasePlugin = require('ember-cli-deploy-plugin');
const copy = require('recursive-copy');

module.exports = {
  name: require('./package').name,

  createDeployPlugin: function (options) {
    const DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        distDir: (context) => context.distDir,
        overwrite: true,
        confirm: true,
        filePattern: undefined,

        didDeployMessage: function (context) {
          const revisionKey =
            context.revisionData && context.revisionData.revisionKey;
          if (revisionKey) {
            return '✅ Copied revision ' + revisionKey + '.';
          }
        },
      },

      requiredConfig: ['destDir', 'indexFileLocation'],

      configure: function (/* context */) {
        this.log('Setting ADONIS_BUILD env variable to true');
        process.env.ADONIS_BUILD = true;

        this.log('Validating Configuration');
        [
          'distDir',
          'overwrite',
          'confirm',
          'didDeployMessage',
          'filePattern',
        ].forEach(this.applyDefaultConfigProperty.bind(this));

        this.log('✅ Config OK');
      },

      upload: function (/* context */) {
        const distDir = this.readConfig('distDir');
        const destDir = this.readConfig('destDir');
        const indexFileLocation = this.readConfig('indexFileLocation');

        const options = {
          overwrite: this.readConfig('overwrite'),
          confirm: this.readConfig('confirm'),
          dot: true,
        };

        const allFilesOptions = {
          ...options,
        };

        if (this.readConfig('filePattern') !== undefined) {
          allFilesOptions.filter = this.readConfig('filePattern');
        }

        this.log('Copying files from ' + distDir + ' to ' + destDir);

        const allFiles = new Promise(function (resolve, reject) {
          copy(distDir, destDir, allFilesOptions, function (error, results) {
            if (error) {
              return reject(new Error('❌ Could not copy files' + error));
            }

            resolve(results);
          });
        });

        const indexFiles = new Promise(function (resolve, reject) {
          copy(
            distDir + '/index.html',
            indexFileLocation,
            options,
            function (error, results) {
              if (error) {
                return reject(new Error('❌ Could not copy files' + error));
              }

              resolve(results);
            }
          );
        });

        return Promise.all([allFiles, indexFiles]);
      },

      didDeploy: function (/* context */) {
        const didDeployMessage = this.readConfig('didDeployMessage');
        if (didDeployMessage) {
          this.log(didDeployMessage);
        }
      },
    });

    return new DeployPlugin();
  },
};
