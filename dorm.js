/* dorm.js v0.0.1, (c) Damir Sultanov - http://fronteed.com, http://git.io/vCUlz */

/* global define, module */
(function (isNode, nil) {
  // detect node.js env
  try {
    isNode = Object.prototype.toString.call(global.process) === '[object process]'
  } catch (exception) {}

  // cache globals
  var root = isNode ? global : window
  var rootNode = !isNode && document ? document.documentElement : nil
  var types = {desktop: nil, mobile: nil, phone: nil, tablet: nil, tv: nil, console: nil, bot: nil}

  // dorm.js instance
  var Dorm = function (init) {
    init && this.init({}, rootNode)
  }

  // initiate dorm.js
  Dorm.prototype.init = function (options, domNode) {
    if (domNode && domNode.nodeType && !(domNode.nodeType === 1 || domNode.nodeType === 9)) {
      domNode = nil
    }

    options = this.assign({
      prefix: 'dorm',
      classes: true,
      // tv: nil,
      // console: nil,
      // bot: nil,
      useragent: !isNode && root.navigator ? root.navigator.userAgent : null,
    },
      this.getAttribute(),
      this.getOptions(),
      this.getOptions(options)
    )

    // parse current userAgent
    var result = this.parse(options.useragent, options)
    var resultHelper

    // normalize according options
    for (var type in types) {
      if (options[type] === false || options[type] === nil) {
        result[type] = nil
      } else if (typeof options[type] === 'string') {
        result[type] = result[options[type]]
      }
    }

    for (var resultItem in result) {
      if (result[resultItem] === true && types[resultItem] !== undefined) {
        // redirects
        if (!isNode && root.location) {
          resultHelper = options[resultItem + 'redirect']

          if (resultHelper) {
            root.location.replace(resultHelper)
          }
        }

        // callbacks
        resultHelper = options[resultItem + 'callback']
        if (resultHelper && typeof (resultHelper) === 'function') {
          resultHelper(result, options)
        }
      }
    }

    if (rootNode && options.classes) {
      var rootClass = this.trim(rootNode.className)

      for (var resultClass in result) {
        if (result[resultClass] !== nil) {
          rootClass += ' ' + (options.prefix ? options.prefix + '-' : '') + (!result[resultClass] ? 'not-' : '') + (resultClass === 'os' ? result[resultClass] : resultClass)
        }
      }

      rootNode.className = this.trim(rootClass)
    }

    return result
  }

  // parse userAgent and return object
  Dorm.prototype.parse = function (string, options, result) {
    string = typeof (string) === 'string' ? this.trim(string) : nil
    result = {}

    if (string) {
      var os
      var phone
      var tablet
      var secondary
      var legacy = 'amoi|bada|jasmine|maemo|meego|nokia\\D\\d{2}|palm|pocket|sailfish|series.[10-90]|symb'
      var check = function (keyword) {
        return new RegExp(keyword, 'i').test(string)
      }

      // detect consoles
      if (check('car(.*?)sys|func(.*?)titan|nintendo|playstation|sony(.*?)ps|wii|xbox')) {
        result.console = secondary = true

      // detect tvs
      } else if (check('aftb|(apple|google|hbb|internet.|net|pov_|power|smart|sonyd|web)(.*?)tv|boxee|ce-html|dlink(.*?)dsm|dlnadoc|dongle|espial|kylo|loewe|net(box|cast)|roku|thom|tube|tv |viera')) {
        result.tv = secondary = true

      // detect bots
      } else if (check('anonym|bot|cisco|crawl|gr(a|u)b|http|search|seek|spider|worm')) {
        result.bot = true
      }

      // detect os
      if (check('ios|ip(ad|hone|od)')) {
        os = 'ios'

        if (!secondary) {
          if (check('pad')) {
            tablet = true
          } else {
            phone = true
          }
        }

      // android
      } else if (check('android|kindle|silk')) {
        if (secondary) {
          if (check('android')) {
            os = 'android'
          }
        } else {
          os = 'android'

          if ((check('mobile|opera (mini|mobi)|(xl|xm)\\d{2}\\D') &&
            !check('Odys(.*?)(space|xpress)|allview(.*?)(speed|city)|kobo|msi enjoy|nabi|nook|note|pocketbook|t-hub|xelio') &&
            !check('gt-p\\d{2}|sc-\\d{2}\\D')) ||
            check('sdk b')) {
            phone = true
          } else {
            tablet = true
          }
        }

      // blackberry
      } else if (check('blackberry|bb10|rim(?!ent)')) {
        os = 'blackberry'

        if (!secondary) {
          if (check('tablet')) {
            tablet = true
          } else {
            phone = true
          }
        }

      // firefox os
      } else if (check('\\((mobile|tablet);') && check('; rv:')) {
        os = 'foxos'

        if (!secondary) {
          if (check('tablet')) {
            tablet = true
          } else {
            phone = true
          }
        }

      // windows
      // } else if (check('cygwin|windows|win[ \\d]') && !check('darwin')) {
      } else if (check('os\\/2|win') && !check('darwin')) {
        os = 'windows'

        if (!secondary) {
          if (check(legacy)) {
            phone = true
          } else {
            if (check('phone|wpdesktop')) {
              phone = true
            } else if (check('tablet') || (check('touch') && check('iemobile'))) {
              tablet = true
            } else if (check('mobi')) {
              phone = true
            }
          }
        }

      // mac
      } else if (check('darwin|mac|os[ _-]?x')) {
        os = 'mac'

      // third-party os
      } else {
        if (!secondary && (check(legacy) || check('midp|mobi|puffin'))) {
          phone = true
        }

        if (check('bada|\\D{3}bsd|hp(.*?)ux|(ir|un)ix|linux|maemo|meego|sailfish|sunos|tizen')) {
          os = 'nix'
        }
      }

      // specific ids
      if (check('folio|pad|slate|tab(?!out|rec)')) {
        phone = false
        tablet = true
      } else if (check('juc|(pad|voda)fone')) {
        phone = true
        tablet = false
      }

      // specific brands
      if (!secondary && !phone && !tablet && (!os || os === 'nix') && check('htc|mot[o -]|nokia|samsung|sonyeric|xda')) {
        phone = true
      }

      // desktop
      if (os === 'windows' && check('(win|wow|x)64') || result.bot && !check('mobi')) {
        phone = tablet = false
      }

      // detect phones and tablets
      if (phone || tablet || secondary) {
        result.mobile = true

        if (phone) {
          result.phone = phone
        } else if (tablet) {
          result.tablet = tablet
        }
      } else {
        if (!check('mac|nix|win', os)) {
          os = nil
        }

        result.desktop = true
      }

      // save os
      if (os) {
        result.os = os
      }
    }

    for (var type in types) {
      result[type] = !!result[type]
    }

    return result
  }

  // get data-dorm attribute
  Dorm.prototype.getAttribute = function (data) {
    data = {}

    if (rootNode) {
      var attribute = rootNode.getAttribute('data-dorm')

      if (attribute) {
        attribute = this.trim(attribute).split(/\s*,\s*/)

        for (var i = 0; i < attribute.length; i++) {
          var attributeItem = attribute[i].split(/\s*:\s*/)
          var attributeName = attributeItem[0].toLowerCase()
          var attributeValue = attributeItem[1]

          if (attributeItem.length > 1) {
            if (attributeName === 'prefix') {
              attributeValue = attributeValue === 'false' || !attributeValue ? '' : (attributeValue === 'true' ? nil : attributeValue)
            } else if (attributeName === 'classes') {
              attributeValue = attributeValue === 'true'
            }

            attributeValue === 'null' && (attributeValue = nil)
            attributeValue !== nil && (data[attributeName] = attributeValue)
          }
        }
      }
    }

    return data
  }

  // get window.dormOptions or custom options
  Dorm.prototype.getOptions = function (options, result) {
    options = options || (!isNode ? (root.dormOptions || {}) : {})
    result = {}

    for (var option in options) {
      result[option.toLowerCase()] = options[option]
    }

    return result
  }

  // cross-browser Object.assign() replacement
  Dorm.prototype.assign = function (target) {
    for (var index = 1, key, src; index < arguments.length; ++index) {
      src = arguments[index]

      for (key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
          target[key] = src[key]
        }
      }
    }

    return target
  }

  // cross-browser String.trim() replacement
  Dorm.prototype.trim = function (variable) {
    return (variable + '').replace(/^\s+|\s+$/g, '')
  }

  // exports
  if (typeof define === 'function' && define.amd) {
    // export for amd fans
    define(function () {
      return new Dorm()
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    // export in Node.js style
    module.exports = new Dorm()
  } else {
    // export to global and launch
    !isNode && (root.dorm = new Dorm(true))
  }
})(false, null)
