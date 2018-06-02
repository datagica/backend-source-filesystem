const chai = require('chai');
chai.use(require('chai-fuzzy'));
const expect = chai.expect;

const path = require('path');
const util = require('util');

const fs = require('fs');
const tmp = require('tmp');

const pretty = (x) => {
  console.log(util.inspect(x, false, 7, true));
};

const PluginSource = require("../lib/index");

describe('@datagica/backend-source-filesystem', () => {

  var tmpData = {
    cleanupCallback: function(){}
  }
  before(done => {

    tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
      if (err) throw err;
      tmpData.path = `${path}/`;
      done()
    })

  });

  // actually, no need to call the cleanupCallback
  after(done => {
    done()
  })

  it('should work', done => {

    // step 1: init the engine when the backend starts
    const pluginSource = new PluginSource()

    // step 2: everytime the user requires the settings
    const settings = pluginSource.getSettings("local");
    // console.log("SETTINGS: "+JSON.stringify(settings))
    settings.parameters.value.files.value.push(tmpData.path)

    // console.log("SETTINGS: "+JSON.stringify(settings, null, 2))
    // step 3: here the user is supposed to tweak the settings

    // step 4: when the user finalize the new source setup wizard, we create an
    //         instance with his settings
    const source = pluginSource.getInstance({
      bundleId    : "file",
      templateId  : "local",
      sourceId    : "test",
      sourceName  : "test",
      isActive    : true,
      settings    : settings,
      saveRecord  : record => {

        /*
       console.log(JSON.stringify(record, null, 2))

        {
      "uri": "file:///var/folders/2j/msj3cscj0s72lhhjxwjb482c0000gn/T/tmp-98646S6RAWIRlAe28/test.txt",
      "date": {
        "lastChanged": "2016-12-31T11:47:19.000Z",
        "elapsed": 895
      },
      "hash": "fa26be19de6bff93f70bc2308434e4a440bbad02",
      "bundleId": "file",
      "templateId": "local",
      "sourceId": "test",
      "name": "test.txt",
      "binary": {
        "buffer": {
          "type": "Buffer",
          "data": [
            116,
            104,
            105,
            115,
            32,
            105,
            115,
            32,
            97,
            32,
            116,
            101,
            115,
            116
          ]
        },
        "filename": "test.txt"
      }
    }
        */
        expect(record.hash)       .to.equal("fa26be19de6bff93f70bc2308434e4a440bbad02")
        expect(record.bundleId)   .to.equal("file")
        expect(record.templateId) .to.equal("local")
        expect(record.sourceId)   .to.equal("test")
        expect(record.name)       .to.equal("test.txt")

        // we need to return the promise first, then finalize the test
        setTimeout(() => {
          done()
          setTimeout(() => {
            process.exit(0)
          }, 50)
        }, 0)

        return Promise.resolve(true)
      },
      deleteRecord: record => {
        // console.log("delete: nothing to do")
        return Promise.resolve(false)
      }
    });
     // console.log("okay, we got a source")

    // step 5: should react when we add files
    fs.writeFile(`${tmpData.path}/test.txt`, "this is a test", err => {
      if (err) { console.error(err) }
      // console.log("wrote file")
    })

  })
})
