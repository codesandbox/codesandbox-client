var should = require('should')
var path = require('path') // *always* use the correct pathseps!

var helpers = require('../lib/helpers')
var AppDirectory = require('../lib/appdirectory')

var oldEnv = {}

function monkeyPatchEnvironment(xdg) {
    oldEnv.HOME = process.env.HOME
    process.env.HOME = path.join("/home", "awesomeuser")

    oldEnv.APPDATA = process.env.APPDATA
    process.env.APPDATA = path.join("C:", "Users", "awesomeuser", "AppData", "Roaming")
    oldEnv.LOCALAPPDATA = process.env.LOCALAPPDATA
    process.env.LOCALAPPDATA = path.join("C:", "Users", "awesomeuser", "AppData", "Local")
    oldEnv.PROGRAMDATA = process.env.PROGRAMDATA
    process.env.PROGRAMDATA = path.join("C:", "ProgramData")


    if (xdg) {
        oldEnv.XDG_DATA_HOME = process.env.XDG_DATA_HOME
        process.env.XDG_DATA_HOME = path.join("/home", "awesomeuser", "xdg", "share") // I don't know what an XDG_DATA_HOME directory should look like...
        oldEnv.XDG_DATA_DIRS = process.env.XDG_DATA_DIRS
        xdgDataDirs = path.join("/usr", "xdg", "share") + (path.delimiter || ':') + path.join("/usr", "local", "xdg", "share")
        process.env.XDG_DATA_DIRS = xdgDataDirs // I also don't know what an XDG_DATA_DIRS directory should look like...
        oldEnv.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME
        process.env.XDG_CONFIG_HOME = path.join("/home", "awesomeuser", "xdg", ".config")
    } else {
        oldEnv.XDG_DATA_HOME = process.env.XDG_DATA_HOME
        process.env.XDG_DATA_HOME = ''
        oldEnv.XDG_DATA_DIRS = process.env.XDG_DATA_DIRS
        process.env.XDG_DATA_DIRS = ''
        oldEnv.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME
        process.env.XDG_CONFIG_HOME = ''
    }
}

function unPatchEnvironment() {
    process.env.HOME = oldEnv.HOME
    process.env.APPDATA = oldEnv.APPDATA
    process.env.LOCALAPPDATA = oldEnv.LOCALAPPDATA
    process.env.XDG_DATA_HOME = oldEnv.XDG_DATA_HOME
    process.env.XDG_CONFIG_HOME = oldEnv.XDG_CONFIG_HOME
}

describe('helpers.js', function() {
    describe('instanceOf', function() {
        it('should correctly work out if an object is a subtype of a prototype', function() {

            helpers.instanceOf('sampleString', String).should.be.true
            helpers.instanceOf(new String(), String).should.be.true

            helpers.instanceOf({}, Object).should.be.true
            helpers.instanceOf(new Object(), Object).should.be.true
            helpers.instanceOf('string', Object).should.be.true // Potentially confusing behaviour

            helpers.instanceOf([], Array).should.be.true
            helpers.instanceOf(new Array(), Array).should.be.true

            helpers.instanceOf('', Array).should.be.false
            helpers.instanceOf({'hello': 'goodbye'}, String).should.be.false

        })
    })

    describe('formatStr', function() {
        it('should format strings correctly', function() {

            helpers.formatStr('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET').should.equal('ASP is dead, but ASP.NET is alive! ASP {2}')
            helpers.formatStr('{1} string does not have an index 0', 'uncalled', 'This').should.equal('This string does not have an index 0')

        })
    })
})

describe('appdirectory.js', function() {
    describe('AppDirectory', function() {
        it('should handle instantiation options object', function() {
            monkeyPatchEnvironment() // needed to ensure *APPDATA vars are present
            var ad = new AppDirectory({
                appName: "myapp",
                appAuthor: "Johz",
                appVersion: "0.1.1",
                useRoaming: true,
                platform: "win32"
            })

            ad.should.containEql({appName: 'myapp'})
            ad.should.containEql({appAuthor: 'Johz'})
            ad.should.containEql({appVersion: '0.1.1'})
            ad.should.containEql({useRoaming: true})
            ad.should.containEql({_platform: "win32"})

            ad.platform.should.equal("win32") // test getters here as well

            unPatchEnvironment()
        })

        it('should handle default instantiations', function() {
            var ad = new AppDirectory({
                appName: "myapp",
            })

            ad.should.containEql({appName: 'myapp'})
            ad.should.containEql({appAuthor: 'myapp'})
            ad.should.containEql({appVersion: null})
            ad.should.containEql({useRoaming: false})
            ad.should.containEql({_platform: null})
        })

        it('should handle instatiation with string', function() {
            var ad = new AppDirectory("myapp")

            ad.should.containEql({appName: 'myapp'})
            ad.should.containEql({appAuthor: 'myapp'})
            ad.should.containEql({appVersion: null})
            ad.should.containEql({useRoaming: false})
            ad.should.containEql({_platform: null})
        })

        describe("#userData", function() {
            it('should return the correct format string', function() {

                monkeyPatchEnvironment(false) // get the correct system vars in place

                var ad = new AppDirectory({
                    appName: "myapp",
                    appAuthor: "Johz",
                    appVersion: "0.1.1",
                    useRoaming: true,
                    platform: "win32"
                })

                ad.userData().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Roaming", "Johz", "myapp", "0.1.1"))

                ad = new AppDirectory({
                    appName: "myapp",
                    useRoaming: false,
                    platform: "win32"
                })

                ad.userData().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Local", "myapp", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "darwin"
                })

                ad.userData().should.equal(path.join("/home", "awesomeuser", "Library", "Application Support", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.userData().should.equal(path.join("/home", "awesomeuser", ".local", "share", "myapp"))

                unPatchEnvironment()
                monkeyPatchEnvironment(true) // set XDG variables

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.userData().should.equal(path.join("/home", "awesomeuser", "xdg", "share", "myapp"))

                unPatchEnvironment() // return everything to how it was in case something weird's happening afterwards

            })

            it('should be modifiable using getters and setters', function() {
                monkeyPatchEnvironment(false)

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "win32"
                })

                ad.userData().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Local", "myapp", "myapp"))

                ad.useRoaming = true

                ad.userData().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Roaming", "myapp", "myapp"))

                ad.platform = "linux"

                ad.platform.should.equal("linux")

                ad.userData().should.equal(path.join("/home", "awesomeuser", ".local", "share", "myapp"))

                unPatchEnvironment()
            })
        })

        describe('#siteData', function() {
            it('should return the correct paths on different OSs'/*, function() {

                monkeyPatchEnvironment(false) // get the correct system vars in place

                var ad = new AppDirectory({
                    appName: "myapp",
                    appAuthor: "Johz",
                    appVersion: "0.1.1",
                    useRoaming: true,
                    platform: "win32"
                })

                ad.siteData().should.equal(path.join("C:", "ProgramData", "Johz", "myapp", "0.1.1"))

                ad = new AppDirectory({
                    appName: "myapp",
                    useRoaming: false,
                    platform: "win32"
                })

                ad.siteData().should.equal(path.join("C:", "ProgramData", "myapp", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "darwin"
                })

                ad.siteData().should.equal(path.join("/Library", "Application Support", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.siteData().should.equal(path.join("/usr", "local", "share", "myapp"))

                unPatchEnvironment()
                monkeyPatchEnvironment(true) // set XDG variables

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.siteData().should.equal(path.join("/usr", "xdg", "share", "myapp"))

                unPatchEnvironment() // return everything to how it was in case something weird's happening afterwards

            }*/)
        })

        describe('#userConfig', function() {
            it('should return the correct paths on different OSs', function() {

                monkeyPatchEnvironment(false) // get the correct system vars in place

                var ad = new AppDirectory({
                    appName: "myapp",
                    appAuthor: "Johz",
                    appVersion: "0.1.1",
                    useRoaming: true,
                    platform: "win32"
                })

                ad.userConfig().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Roaming", "Johz", "myapp", "0.1.1"))

                ad = new AppDirectory({
                    appName: "myapp",
                    useRoaming: false,
                    platform: "win32"
                })

                ad.userConfig().should.equal(path.join("C:", "Users", "awesomeuser", "AppData", "Local", "myapp", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "darwin"
                })

                ad.userConfig().should.equal(path.join("/home", "awesomeuser", "Library", "Application Support", "myapp"))

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.userConfig().should.equal(path.join("/home", "awesomeuser", ".config", "myapp"))

                unPatchEnvironment()
                monkeyPatchEnvironment(true) // set XDG variables

                ad = new AppDirectory({
                    appName: "myapp",
                    platform: "linux"
                })

                ad.userConfig().should.equal(path.join("/home", "awesomeuser", "xdg", ".config", "myapp"))

                unPatchEnvironment() // return everything to how it was in case something weird's happening afterwards

            })
        })
    })
})