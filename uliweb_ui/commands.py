# coding:utf-8
from __future__ import print_function, absolute_import, unicode_literals
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
            print ('Error: Please use -d to specify output app')
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

        print ('jsmodules.js is saved in {} please check'.format(filename))
        with open(filename, 'wb') as f:
            f.write('var jsmodules = ')
            f.write(json_dumps(d))


# Generate a setting file which type is ini for gulp then call gulp cli to concat plugin file
# by Lihouxuan
class GulpPlugins(Command):

    name = 'gulpplugins'

    option_list = (
        make_option('-a', '--app', dest='app', help='App name which settings.ini will be parsed.'),
        make_option('-d', '--dest', help='Output file will be saved in this app/static directory'),
        make_option('--no-js', dest='no_js', default=False, action='store_true',
                    help='Not combine javascript files'),
    )

    help = 'Convert TEMPLATE_USE config to gulp_settings.ini, ' \
           'so that gulp can easily use to generate file of common which is concated'

    args = ''

    check_apps_dirs = True

    check_apps = True

    skip_options = False

    options_inherit = True

    def handle(self, options, global_options, *args):
        from uliweb.utils.pyini import Ini
        from uliweb.utils.common import pkg
        from uliweb.contrib.template.tags import find
        from uliweb.contrib.staticfiles import url_for_static
        from uliweb import json_dumps
        import ConfigParser

        if not options.dest and not options.app:
            print ("Error: Please use -d to specify output app")
            sys.exit(1)

        app = self.get_application(global_options)

        from uliweb import settings

        if options.dest:
            module = options.dest
            filename = pkg.resource_filename(options.dest, 'gulp_settings.ini')
        else:
            module = options.app
            filename = pkg.resource_filename(options.app, 'gulp_settings.ini')

        with open(filename, 'wb') as f:
            template_gulp = settings.get("TEMPLATE_GULP", {}) # 导出settings中的gulp配置
            template_use_keys = settings.get("TEMPLATE_USE", {}).keys() # 导出settings中的plugins的名字
            for dist,items in template_gulp.items():
                # 有序遍历gulp的concat配置
                item_dist = dist
                for name in items:
                    if name in template_use_keys:
                        # 如果plugins中有该插件则在ini中写入该配置
                        s = find(name)
                        m = s[0] + s[1]
                        f.write("[template_use." + name + "]\r\n")
                        for i in m:
                            #if no_js then skip javascript files
                            if options.no_js and (i.startswith('<!--') or i.endswith('.js')):
                                continue
                            if not i.startswith('<!--'):
                                f.write("toplinks[] = " + app.get_file(i, 'static') + "\r\n")
                        f.write("dist = " + item_dist + "\r\n")
                    f.write("\r\n")

        gulp_dist = pkg.resource_filename(module, '/static');
        gulp_settings = filename
        gulp_path = pkg.resource_filename("uliweb_ui","")
        import os
        terminal_command = "cd "+gulp_path+ " && gulp  --dist " + gulp_dist + " --settings " + gulp_settings
        print (">>> {}".format(terminal_command))
        os.system(terminal_command)
