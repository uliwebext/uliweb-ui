def call(*args, **kwargs):
    from uliweb import settings
    
    a = []
    b = []
    version = settings.UI_VERSION.jQuery
    if version:
        a.append('modules/jquery/{0}/jquery.min.js'.format(version))
        _v = map(int, version.split('.'))
        if _v > [1, 9]:
            a.append('modules/jquery/jquery-migrate-1.2.1.min.js')

    if settings.UI_CONFIG.jquery_bootstrap:
        b.append(settings.UI_CONFIG.jquery_bootstrap)
        
    return {'toplinks':a, 'bottomlinks':b}
