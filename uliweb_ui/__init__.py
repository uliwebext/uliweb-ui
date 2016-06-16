__version__ = '1.0'
__url__ = ''
__author__ = 'limodou'
__email__ = 'limodou@gmail.com'

def load_jquery(**kwargs):
    a = []
    version = kwargs.get('version', '')
    a.append('modules/jquery/{0}/jquery.min.js'.format(version))
    _v = map(int, version.split('.'))
    if _v > [1, 9]:
        a.append('modules/jquery/jquery-migrate-1.2.1.min.js')

    return a
