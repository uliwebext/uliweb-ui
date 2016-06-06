import sys
from uliweb.core.commands import Command, CommandManager, get_commands
from optparse import make_option

class JsmoduleCommand(Command):
    #change the name to real command name, such as makeapp, makeproject, etc.
    name = 'jsmodule'
    #command line parameters definition
    option_list = (
        make_option('-a', '--app', dest='app',
            help='App name which settings.ini will be parsed.'),
        make_option('-d', '--dest', dest='dest',
            help='Output file will be saved in this app/static directory'),
    )
    #help information
    help = 'Convert TEMPLATE_USE config to jsmodule.js, so that head.js can easily use'
    #args information, used to display show the command usage message
    args = ''
    #if True, it'll check the current directory should has apps directory
    check_apps_dirs = True
    #if True, it'll check args parameters should be valid apps name
    check_apps = True
    #if True, it'll skip not predefined parameters in options_list, otherwise it'll
    #complain not the right parameters of the command, it'll used in subcommands or
    #passing extra parameters to a special command
    skip_options = False
    #if inherit the base class option_list, default True is inherit
    options_inherit = True


    def handle(self, options, global_options, *args):
        from uliweb.utils.pyini import Ini
        from uliweb.utils.common import pkg
        from uliweb.contrib.template.tags import find
        from uliweb.contrib.staticfiles import url_for_static
        from uliweb import json_dumps

        if not options.dest and not options.app:
            print 'Error: Please use -d to specify output app'
            sys.exit(1)

        app = self.get_application(global_options)

        if options.app:
            settings_file = pkg.resource_filename(options.app, 'settings.ini')
            x = Ini(settings_file)

        else:
            x = app.settings

        if options.dest:
            filename = pkg.resource_filename(options.dest, '/static/jsmodules.js')
        else:
            filename = pkg.resource_filename(options.app, '/static/jsmodules.js')

        d = {}
        for name in x.get('TEMPLATE_USE', {}).keys():
            s = find(name)
            m = s[0] + s[1]
            d[name] = [url_for_static(i) for i in m if not i.startswith('<!--')]

        print 'jsmodules.js is saved in {} please check'.format(filename)
        with open(filename, 'wb') as f:
            f.write('var jsmodules = ')
            f.write(json_dumps(d))


