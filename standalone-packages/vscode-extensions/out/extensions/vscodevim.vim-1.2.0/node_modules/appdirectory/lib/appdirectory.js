var path = require('path')
var helpers = require('./helpers')

var userData = function(roaming, platform) {
    var dataPath
      , platform = platform || process.platform
    if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Application Support', '{0}')
    } else if (platform === "win32") {
        var sysVariable
        if (roaming) {
            sysVariable = "APPDATA"
        } else {
            sysVariable = "LOCALAPPDATA" // Note, on WinXP, LOCALAPPDATA doesn't exist, catch this later
        }
        dataPath = path.join(process.env[sysVariable] || process.env.APPDATA /*catch for XP*/, '{1}', '{0}')
    } else {
        if (process.env.XDG_DATA_HOME) {
            dataPath = path.join(process.env.XDG_DATA_HOME, '{0}')
        } else {
            dataPath = path.join(process.env.HOME, ".local", "share", "{0}")
        }
    }
    return dataPath
}

/*var siteData = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin") {
        dataPath = path.join("/Library", "Application Support", "{0}")
    } else if (platform === "win32") {
        dataPath = path.join(process.env.PROGRAMDATA, "{1}", "{0}")
    } else {
        if (process.env.XDG_DATA_DIRS) {
            dataPath = process.env.XDG_DATA_DIRS.split((path.delimiter || ':'))[0]
        } else {
            dataPath = path.join("/usr", "local", "share")
        }

        dataPath = path.join(dataPath, "{0}")
    }
    return dataPath
}*/

var userConfig = function(roaming, platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin" || platform === "win32") {
        dataPath = userData(roaming, platform)
    } else {
        if (process.env.XDG_CONFIG_HOME) {
            dataPath = path.join(process.env.XDG_CONFIG_HOME, "{0}")
        } else {
            dataPath = path.join(process.env.HOME, ".config", "{0}")
        }
    }

    return dataPath
}

/*var siteConfig = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin" || platform === "win32") {
        dataPath = siteData(platform)
    } else {
        if (process.env.XDG_CONFIG_HOME) {
            dataPath = process.env.XDG_CONFIG_HOME.split((path.delimiter || ':'))[0]
        } else {
            dataPath = path.join("/etc", "xdg")
        }

        dataPath = path.join(dataPath, "{0}")
    }
    return dataPath
}*/

var userCache = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "win32") {
        dataPath = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, '{1}', '{0}', 'Cache')
    } else if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Caches', '{0}')
    } else {
        if (process.env.XDG_CACHE_HOME) {
            dataPath = path.join(process.env.XDG_CACHE_HOME, '{0}')
        } else {
            dataPath = path.join(process.env.HOME, '.cache', '{0}')
        }
    }
    return dataPath
}

var userLogs = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "win32") {
        dataPath = path.join(userData(false, platform), 'Logs')
    } else if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Logs', '{0}')
    } else {
        dataPath = path.join(userCache(platform), 'log')
    }
    return dataPath
}

function AppDirectory(options) {
    if (helpers.instanceOf(options, String)) {
        options = {appName: options}
    }

    // substitution order:
    // {0} - appName
    // {1} - appAuthor

    this.appName = options.appName
    this.appAuthor = options.appAuthor || options.appName
    this.appVersion = options.appVersion || null
    this._useRoaming = options.useRoaming || false
    this._platform  = options.platform || null

    this._setTemplates()
}

AppDirectory.prototype = {
    _setTemplates: function() {
        this._userDataTemplate = userData(this._useRoaming, this._platform)
        /*this._siteDataTemplate = siteData(this._platform)*/
        this._userConfigTemplate = userConfig(this._useRoaming, this._platform)
        /*this._siteConfigTempalte = siteConfig(this._platform)*/
        this._userCacheTemplate = userCache(this._platform)
        this._userLogsTemplate = userLogs(this._platform)
    },
    get useRoaming() {
        return this._useRoaming
    },
    set useRoaming(bool) {
        this._useRoaming = bool
        this._setTemplates()
    },
    get platform() {
        return this._platform
    },
    set platform(str) {
        this._platform = str
        this._setTemplates()
    },
    userData: function() {
        var dataPath = this._userDataTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    siteData: function() {
        var dataPath = this._siteDataTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userConfig: function() {
        var dataPath = this._userConfigTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    siteConfig: function() {
        var dataPath = this._siteConfigTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userCache: function() {
        var dataPath = this._userCacheTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userLogs: function() {
        var dataPath = this._userLogsTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    }

}

module.exports = AppDirectory
