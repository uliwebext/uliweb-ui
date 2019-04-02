__version__ = '0.1.0'
__url__ = 'https://github.com/uliwebext/uliweb-ui'
__author__ = 'limodou'
__email__ = 'limodou@gmail.com'
__license__ = 'BSD'

def load_jquery(**kwargs):
    a = []
    version = kwargs.get('version', '')
    a.append('modules/jquery/{0}/jquery.min.js'.format(version))
    _v = list(map(int, version.split('.')))
    if _v > [1, 9]:
        a.append('modules/jquery/jquery-migrate-1.2.1.min.js')

    return a

def init_static_combine():

    from uliweb import settings
    from hashlib import md5
    import os

    PLUGINS = settings.get_var("TEMPLATE_GULP")

    d = {}


    if settings.get_var('STATIC_COMBINE_CONFIG/enable', False):
        include_js = settings.get_var('STATIC_COMBINE_CONFIG/include_js', False)
        # for k, v in settings.get('STATIC_COMBINE', {}).items():
        #     key = '_cmb_' + md5(''.join(v)).hexdigest() + os.path.splitext(v[0])[1]
        #     d[key] = v
        from uliweb.contrib.template.tags import find
        for k, v in PLUGINS.items():
            js_list = []
            css_list = []
            for x in v:
                s = find(x)
                m = s[0] + s[1]
                for i in m:
                    if not include_js and (i.startswith('<!--') or i.endswith('.js')):
                        continue
                    if not i.startswith('<!--'):
                        e = os.path.splitext(i)[1]
                        if e == ".css":
                            css_list.append(i)
                        elif e == ".js":
                            js_list.append(i)
            if js_list:
                d[k+".js"] = js_list
            if css_list:
                d[k + ".css"] = css_list
    return d