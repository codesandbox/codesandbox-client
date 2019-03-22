// handles parsing positional arguments,
// and populating argv with said positional
// arguments.
module.exports = function (yargs, usage, validation) {
  const self = {}

  var handlers = {}
  self.addHandler = function (cmd, description, builder, handler) {
    // allow a module to define all properties
    if (typeof cmd === 'object' && typeof cmd.command === 'string' && cmd.builder && typeof cmd.handler === 'function') {
      self.addHandler(cmd.command, extractDesc(cmd), cmd.builder, cmd.handler)
      return
    }

    // allow a module to be provided instead of separate builder and handler
    if (typeof builder === 'object' && builder.builder && typeof builder.handler === 'function') {
      self.addHandler(cmd, description, builder.builder, builder.handler)
      return
    }

    if (description !== false) {
      usage.command(cmd, description)
    }

    // we should not register a handler if no
    // builder is provided, e.g., user will
    // handle command themselves with '_'.
    var parsedCommand = parseCommand(cmd)
    handlers[parsedCommand.cmd] = {
      original: cmd,
      handler: handler,
      builder: builder,
      demanded: parsedCommand.demanded,
      optional: parsedCommand.optional
    }
  }

  function extractDesc (obj) {
    for (var keys = ['describe', 'description', 'desc'], i = 0, l = keys.length, test; i < l; i++) {
      test = obj[keys[i]]
      if (typeof test === 'string' || typeof test === 'boolean') return test
    }
    return false
  }

  function parseCommand (cmd) {
    var splitCommand = cmd.split(/\s/)
    var bregex = /\.*[\][<>]/g
    var parsedCommand = {
      cmd: (splitCommand.shift()).replace(bregex, ''),
      demanded: [],
      optional: []
    }
    splitCommand.forEach(function (cmd, i) {
      var variadic = false
      if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1) variadic = true
      if (/^\[/.test(cmd)) {
        parsedCommand.optional.push({
          cmd: cmd.replace(bregex, ''),
          variadic: variadic
        })
      } else {
        parsedCommand.demanded.push({
          cmd: cmd.replace(bregex, ''),
          variadic: variadic
        })
      }
    })
    return parsedCommand
  }

  self.getCommands = function () {
    return Object.keys(handlers)
  }

  self.getCommandHandlers = function () {
    return handlers
  }

  self.runCommand = function (command, yargs, parsed) {
    var argv = parsed.argv
    var commandHandler = handlers[command]
    var innerArgv = argv
    var currentContext = yargs.getContext()
    var parentCommands = currentContext.commands.slice()
    currentContext.commands.push(command)
    if (commandHandler.builder && typeof commandHandler.builder === 'function') {
      // a function can be provided, which interacts which builds
      // up a yargs chain and returns it.
      innerArgv = commandHandler.builder(yargs.reset(parsed.aliases))
      // if the builder function did not yet parse argv with reset yargs
      // and did not explicitly set a usage() string, then apply the
      // original command string as usage() for consistent behavior with
      // options object below
      if (yargs.parsed === false && typeof yargs.getUsageInstance().getUsage() === 'undefined') {
        yargs.usage('$0 ' + (parentCommands.length ? parentCommands.join(' ') + ' ' : '') + commandHandler.original)
      }
      innerArgv = innerArgv ? innerArgv.argv : argv
    } else if (commandHandler.builder && typeof commandHandler.builder === 'object') {
      // as a short hand, an object can instead be provided, specifying
      // the options that a command takes.
      innerArgv = yargs.reset(parsed.aliases)
      innerArgv.usage('$0 ' + (parentCommands.length ? parentCommands.join(' ') + ' ' : '') + commandHandler.original)
      Object.keys(commandHandler.builder).forEach(function (key) {
        innerArgv.option(key, commandHandler.builder[key])
      })
      innerArgv = innerArgv.argv
    }

    populatePositional(commandHandler, innerArgv, currentContext)

    if (commandHandler.handler) {
      commandHandler.handler(innerArgv)
    }
    currentContext.commands.pop()
    return innerArgv
  }

  function populatePositional (commandHandler, argv, context) {
    argv._ = argv._.slice(context.commands.length) // nuke the current commands
    var demanded = commandHandler.demanded.slice(0)
    var optional = commandHandler.optional.slice(0)

    validation.positionalCount(demanded.length, argv._.length)

    while (demanded.length) {
      var demand = demanded.shift()
      if (demand.variadic) argv[demand.cmd] = []
      if (!argv._.length) break
      if (demand.variadic) argv[demand.cmd] = argv._.splice(0)
      else argv[demand.cmd] = argv._.shift()
    }

    while (optional.length) {
      var maybe = optional.shift()
      if (maybe.variadic) argv[maybe.cmd] = []
      if (!argv._.length) break
      if (maybe.variadic) argv[maybe.cmd] = argv._.splice(0)
      else argv[maybe.cmd] = argv._.shift()
    }

    argv._ = context.commands.concat(argv._)
  }

  self.reset = function () {
    handlers = {}
    return self
  }

  return self
}
