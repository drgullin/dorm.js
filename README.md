# [Dorm.js](http://dorm.fronteed.com/) (in development)

**Will be available soon.**

### Device types

- desktop
- mobile
- phone
- tablet
- tv
- console
- bot

### Options

Options are fetched automatically from `<html data-dorm="...">` attribute (format: `"prefix:dorm,classes:true"`) and `window.dormOptions` object (should defined before dorm.js is initiated)

- `prefix: string/true/false`, default value: `dorm`
- `classes: true/false`, default value: `true`
- `desktopRedirect: string`, default value: `null`
- `mobileRedirect: string`, default value: `null`
- `phoneRedirect: string`, default value: `null`
- `tabletRedirect: string`, default value: `null`
- `tvRedirect: string`, default value: `null`
- `consoleRedirect: string`, default value: `null`
- `botRedirect: string`, default value: `null`
- `desktopCallback: function`, default value: `null`
- `mobileCallback: function`, default value: `null`
- `phoneCallback: function`, default value: `null`
- `tabletCallback: function`, default value: `null`
- `tvCallback: function`, default value: `null`
- `consoleCallback: function`, default value: `null`
- `botCallback: function`, default value: `null`
- `desktop: string/true/false/null` (device type), default value: `null`
- `mobile: string/true/false/null` (device type), default value: `null`
- `phone: string/true/false/null` (device type), default value: `null`
- `tablet: string/true/false/null` (device type), default value: `null`
- `tv: string/true/false/null` (device type), default value: `null`
- `console: string/true/false/null` (device type), default value: `null`
- `bot: string/true/false/null` (device type), default value: `null`

### Methods

- `init(options, domNode)` - initiates dorm.js with options
- `parse(string)` - parses userAgent string and returns object
- `assign(target, ...sources)` - internal `Object.assign()` cross-browser helper
- `trim(variable)` - internal `String.trim()` cross-browser helper

### Browser support

Almost every browser and device is supported.


