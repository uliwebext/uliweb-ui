
/*
 * $.query_string
 */

(function ($) {
    QueryString = function (url) {
        this.urlParams = {};
        this.load(url);
    }
    QueryString.prototype = {
        load: function (param) {
            this.urlParams = {};
            this.url = param;
            var e, k, v, i,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {
                    return decodeURIComponent(s.replace(a, " "));
                }
            if (!param) {
                param = window.location.search;
            }
            if (param.charAt(0) == '?') {
                param = param.substring(1);
                this.url = '';
            } else {
                i = param.indexOf('?');
                if (i > -1) {
                    this.url = param.substring(0, i);
                    param = param.substring(i + 1);
                } else
                    param = '';
            }
            while (e = r.exec(param)) {
                k = d(e[1]);
                v = d(e[2]);
                this.set(k, v, false);
            }
            return this;
        },
        toString: function (options) {
            var settings = {
                'hash': false,
                'traditional': true
            };
            if (options) {
                $.extend(settings, options);
            }
            var old = jQuery.ajaxSettings.traditional;
            jQuery.ajaxSettings.traditional = settings.traditional;
            var result = '?' + $.param(this.urlParams);
            jQuery.ajaxSettings.traditional = old;
            if (settings.hash)
                result = result + window.location.hash;
            return result;
        },
        merge: function (data) {
          for(var k in data) {
            if (k[0] == '-') //first char is '-' means this key will be removed
              this.remove(k.substr(1))
            else {
              this.set(k, data[k], true)
            }
          }
          return this
        },
        set: function (k, v, replace) {
            replace = replace || false;
            if (replace)
                this.urlParams[k] = v;
            else {
                if (k in this.urlParams) {
                    if ($.type(this.urlParams[k]) === 'array') {
                        this.urlParams[k].push(v);
                    }
                    else {
                        this.urlParams[k] = [this.urlParams[k], v];
                    }
                }
                else
                    this.urlParams[k] = v;
            }
            return this;
        },
        get: function (k) {
            return this.urlParams[k];
        },
        remove: function (k) {
            if (k in this.urlParams) {
                delete this.urlParams[k];
            }
            return this;
        }
    }
    $.query_string = new QueryString();
})(jQuery);

/*
 * get_url(url, {a:1})
 * get_url({a:1}) == get_url(window.location.search, {a:1})
 */
function get_url(url, data) {
  if (url instanceof Object) {
    data = url
    url = ''
  }
  var query = new QueryString(url)
  query.merge(data)
  return query.url+query.toString()
}
