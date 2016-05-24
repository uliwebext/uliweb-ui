def call(*args, **kwargs):
    from uliweb import settings
    
    a = []
    b = []
    version = settings.UI_VERSION.ui_jquery
    if version:
        a.append('modules/jquery/{0}/jquery.min.js'.format(version))
        _v = map(int, version.split('.'))
        if _v > [1, 9]:
            a.append('modules/jquery/jquery-migrate-1.2.1.min.js')

    return {'toplinks':a, 'bottomlinks':b}
