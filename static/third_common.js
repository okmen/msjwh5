(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer/index.js","/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer")
},{"At5rgb":4,"base64-js":2,"buffer":1,"ieee754":3}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer/node_modules/base64-js/lib/b64.js","/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer/node_modules/base64-js/lib")
},{"At5rgb":4,"buffer":1}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer/node_modules/ieee754/index.js","/../../../aflow/aflow/node_modules/_buffer@2.1.13@buffer/node_modules/ieee754")
},{"At5rgb":4,"buffer":1}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../aflow/aflow/node_modules/_process@0.7.0@process/browser.js","/../../../aflow/aflow/node_modules/_process@0.7.0@process")
},{"At5rgb":4,"buffer":1}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 16/6/13.
 * 核心功能  建立通信
 */

var os = require('../util/os');
var util = require('../util/util');
var webview = require('../util/webview_info');
/**
 * 高德地图客户端与js交互实现.
 * 此js会生成全局变量 callback
 *    callback 供客户端使用，不能直接调用
 * 如果页面中使用了 iframe，则页面和 iframe 不能同时引用此js
 */

/** js与客户端交互对象 */
var bridge;
/** 存储需要回调的客户端请求的回调函数 */
var handlerMap = {};
/** 存储客户端主动调用的数据的回调函数 */
var registerHandlerMap = {};
/** 存储客户端连接建立前发出的请求 */
var sendQueue = [];

/**
 * 客户端调用js的方法名称.
 * 客户端调用js均通过此方法，此方法会作为全局函数存在
 * 如果不同页面间有跳转关系，则这些页面的此方法名必须一致
 */
var CALLBACK_NAME = 'callback';

/** bridge是否建立 */
var isReady = false;
var connected = false;
var readyCallBack = [];


/**
 * 开始和客户端建立连接，如果客户端已建立好连接，则直接初始化.
 */
function init() {
    if (window.amapJsBridge) {
        bridge = window.amapJsBridge;
        return;
    }
    if (os.ios) {
        if (window.WebViewJavascriptBridge) {
            connect({bridge: window.WebViewJavascriptBridge});
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', connect, false);
        }
    } else if (os.android) {
        if (window.jsInterface) {
            connect();
        } else {
            document.addEventListener('DOMContentLoaded', connect, false);
        }
    }
}
/**
 * 客户端完成连接工作，js端保持连接对象，完成连接.
 * @param {Object} event iOS 连接成功后的事件对象
 */
function connect(event) {
    if (os.ios) {
        document.removeEventListener('WebViewJavascriptBridgeReady', connect, false);
        bridge = event.bridge;
        bridge.init();
        bridge.registerHandler('amapCallWebViewHandler', window[CALLBACK_NAME]);
    } else if (os.android) {
        document.removeEventListener('DOMContentLoaded', connect, false);
        bridge = {
            send: function (param) {
                param = [JSON.stringify(param)];
                if (arguments[1]) {
                    param[1] = arguments[1];
                }
                if (window.jsInterface) {
                    window.jsInterface.invokeMethod('send', param);
                }
            }
        };
        bridge.send({'action': 'registerCallback'}, CALLBACK_NAME);
    }

    window.amapJsBridge = bridge;
    connectComplete();
}
/**
 * js与客户端连接建立完成.
 */
function connectComplete() {
    isReady = true;
    connected = true;
    webview.setIsInAmap(true);
    util.addClass(window.document.documentElement, 'amap');
    fireReadyCallBack();
    // 处理连接建立前发起的请求
    while (sendQueue.length) {
        bridge.send(sendQueue.shift());
    }
}
/**
 * 接收客户端回调的方法.
 * @param {Object} res 客户端传回的数据
 */
function callback(res) {
    if ('string' === typeof res) {
        res = JSON.parse(res);
    }
    var _act = res._action;
    // 处理客户端主动调用的事件
    if (typeof registerHandlerMap[_act] === 'function') {
        registerHandlerMap[_act](res);
        return;
    }
    if ('[object Function]' === Object.prototype.toString.call(handlerMap[_act])) {
        handlerMap[_act](res);
        if (res.content && res.content.code != 1) handlerMap[_act] = undefined;
    }
    if (_act && 0 !== _act.indexOf('_HOLD_')) {
        handlerMap[_act] = undefined;
    }
}
window[CALLBACK_NAME] = callback;

/**
 * js向客户端发起请求.
 * @param {Object} param 请求参数
 * @param {Function} [handler] 可选，回调函数
 */
function send(param, handler) {
    if (handler) {
        if (!param._action) {
            var _actionStr = '_ACTION_TO_NATIVEAPI_' + Math.random();
            // 注册右上角按钮时，回调不止触发一次，触发后回调函数不删除
            if (param.hasOwnProperty('function')) {
                _actionStr = '_HOLD' + _actionStr;
                (param['function'])._action = _actionStr;
            }
            else {
                param._action = _actionStr;
            }
            // add by jinjin
            if ('needHold' in param) {
                _actionStr = "_HOLD" + _actionStr;
                param._action = _actionStr;
                try {
                    delete param.needHold
                } catch (e) {
                }
            }
            handlerMap[_actionStr] = handler;
        }
        else {
            handlerMap[param._action] = handler;
        }
    }
    if (bridge) {
        bridge.send(param);
    }
    else {
        sendQueue.push(param);
    }
}

/**
 * 向客户端注册供客户端主动调用的方法.
 * @param {String} _action 事件标识
 * @param {Function} handler 回调方法
 */
function registerCallback(_action, handler) {
    registerHandlerMap[_action] = handler;
}


// 触发ready
function fireReadyCallBack() {
    readyCallBack.forEach(function (fn) {
        fn();
    });
}

var hasSetTimeout = false;

init();

module.exports = {
    send: send,
    registerCallback: registerCallback,
    ready: function (fn) {
        fn();
    }
};
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/amap/bridge.js","/amap")
},{"../util/os":19,"../util/util":20,"../util/webview_info":21,"At5rgb":4,"buffer":1}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 16/6/13.
 * 
 * 对话框
 */

var Bridge = require('./bridge');

/**
 * 使用黑框显示提示信息.
 * @param {String} msg 信息内容
 * @param {Integer} [type=0] 显示类型
 *    0 3s后自动消失的框
 *    1 一直显示的提示框
 *    -1 关闭提示框
 */
function promptMessage(msg, type) {
    Bridge.send({action: 'promptMessage', message: msg, type: type || 0});
}

module.exports = {
    toast: promptMessage
};
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/amap/dialog.js","/amap")
},{"./bridge":5,"At5rgb":4,"buffer":1}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 16/6/13.
 *
 * 数据加载
 */

var Bridge = require('./bridge');
var Dialog = require('./dialog');
var util = require('../util/util');
var webview = require('../util/webview_info');

/**
 * aosrequest.
 * 参数为两种形式，分别为 aosrequest(obj, handler) 和
 * aosrequest(url, params, handler, progress, showNetErr, method)
 *
 * @param {String} url 请求url
 *    此参数为 obj 类型时，此参数为所有参数列表，此时第二个参数为回调方法
 *    此时 obj 的 key 应该和真实接口保持一致：
 *    urlPrefix，method，progress，params，alert，encrypt，goback，showNetErr
 * @param {Array.<Object>} params 请求参数列表
 * @param {Function} handler 回调方法，请求结果会以JSON格式传给方法的第一个参数
 * @param {Integer|String} [progress] 可选，请求时的提示信息，
 *    为数字1时显示默认的提示信息
 * @param {Boolean} [showNetErr=false] 网络异常时是否进行提示，默认不提示
 * @param {String} [method=POST] 可选，请求方式
 */
function aosrequest(url, params, handler, progress, showNetErr, method) {
    if (!url) return;
    var obj;
    // (obj, handler) 形式调用
    if (typeof url === 'object') {
        obj = url;
        handler = params;
        showNetErr = obj.showNetErr;
        delete obj.showNetErr;
    } else { // (url, params, handler, progress, showNetErr, method) 形式
        obj = {
            urlPrefix: url,
            method: method,
            progress: progress,
            params: params
        };
    }
    obj.action = 'aosrequest';
    obj.method = 'string' === typeof obj.method && 'GET' === obj.method.toUpperCase() ? 'GET' : 'POST';
    obj.headers = {"content-type": "application/x-www-form-urlencoded"};
    if (obj.progress) {
        obj.progress = 1 === obj.progress ? '正在加载' : obj.progress;
    } else {
        // ios 下 progress 为空字符串时会显示默认信息
        delete obj.progress;
    }
    Bridge.send(obj, function (res) {
        var result = JSON.parse(res.content);
        if (!result || result.code === undefined) {
            result = {code: -10};
        } else if (showNetErr && (result.code == -1 || result.code == -2)) {
            Dialog.toast('请检查网络后重试');
        }
        handler.call(this, result);
    });
}

/// JSONP
/** @type {Integer} jsonp请求计数器 */
var callbackId = 0;
/** @type {String} jsonp服务回调函数名称前缀 */
var aosJsonpName = '_aosJsonpRequest';
/**
 * 通过wb服务进行签名转发aos请求.
 * @param {String} urlname aos服务url
 * @param {Array.<Object>} param 请求参数，与客户端中请求参数相同
 * @param {Function} callback 回调函数
 * @param {String} method 请求方法，默认get
 */
function aosJsonp(urlname, param, callback, method) {
    var callbackName = aosJsonpName + (++callbackId);
    method = method || 'get';
    window[callbackName] = function (res) {
        callback(res);
    };
    var serverAddress = webview.isPublic() ? '//wb.amap.com/channel.php' : '//wb.testing.amap.com/channel.php';
    var scriptUrl = location.protocol + serverAddress + '?aoscommon=1&callback=' +
        callbackName + '&urlname=' + encodeURIComponent(urlname) +
        '&param=' + encodeURIComponent(JSON.stringify(param)) + '&method=' + method;
    util.addScript(scriptUrl, jsonpComplete, function (script) {
        window[callbackName]({content: {code: -2}});
        jsonpComplete(script);
    });
    
    function jsonpComplete(script) {
        script.remove();
        window[callbackName] = undefined;
    }
}


module.exports = {
    load: function () {
        aosrequest.apply(this, arguments);
    },
    aosJsonp: function () {
        aosJsonp.apply(this, arguments);
    },
    jsonp: function (url, params, handler) {
        aosJsonp.call(this, url, params, handler, 'get');
    },
    get: function (url, params, handler, progress) {
        aosrequest.call(this, url, params, handler, progress, true, 'get');
    },
    post: function (url, params, handler, progress) {
        aosrequest.call(this, url, params, handler, progress, true, 'post');
    }
};


}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/amap/loader.js","/amap")
},{"../util/util":20,"../util/webview_info":21,"./bridge":5,"./dialog":6,"At5rgb":4,"buffer":1}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 16/6/13.
 */

var Bridge = require('./bridge');
var os = require('../util/os');
var WebView = require('../util/webview_info');
var Loader = require('./loader');
var util = require('../util/util');


/** @type {String} 日志url */
var logServer = WebView.isPublic() ? location.protocol + '//oss.amap.com/ws/h5_log' :
location.protocol + '//oss.testing.amap.com/ws/h5_log';


var logApi = {
    
    PAGE_SOURCE_KEY: 'gd_from',
    
    LOG_TYPE_ONLINE_AND_OFFLINE: 0,  // 0: 默认,端内离线,端外在线
    LOG_TYPE_ONLINE_CHART: 1, // 1. 端内离线&pv实时看板、端外在线 
    
    type: 0,//埋点方式
    
    /* 页面埋点通用参数 */
    _commonParam: {
        source: util.getUrlParam('gd_from') || '-'
    }, 
    
    /**
     * 增加日志通用参数.
     * 调用此方法后，本页面所有埋点都会自动添加此参数
     * @param {Object} obj 如果为String类型，则表示page，否则按对应的键设置
     */
    addCommonParam: function (obj) {   
        if (!WebView.isInAmap()) {
            this._commonParam.os = os.ios ? 'ios' : 'and';
            this._commonParam.plat = WebView.isInWeixin() ? 'wx' : (WebView.isInWeibo() ? 'wb' : '-');
        }
        
        util.extend(this._commonParam, obj);   
    },
    
    /**
     * 初始化日志页面名称.
     * 端外页面会自动拼接平台（Android|iOS）及来源
     * @param {String} pageName 活动名称_页面名称
     * @param {number} type 日志类型
     */
    initLog: function (pageName, type) { 
        this.type = type || this.LOG_TYPE_ONLINE_AND_OFFLINE; 
        this.addCommonParam({page: pageName});
    },
    /**
     * 记录日志.
     * 端内记录离线日志，端外记录在线日志
     * @see _formatLogParam
     */
    log: function (click, otherInfo) { 
        if (WebView.isInAmap()) {//端内埋离线
            var param = this._formatLogParam(click, otherInfo); 
            Bridge.send({
                action: 'logUserAction',
                pageid: '1000',
                buttonid: 1,
                para: JSON.stringify(param)
            });
        } else {
            this.browserLog(click, otherInfo);
        }
        if (this.type == this.LOG_TYPE_ONLINE_CHART&&click=='pv') {//type=1且为pv时候要埋实时看板
            this.nativeOnlineLog(click+'_online', otherInfo);
        }
    },
    
    /**
     * 端外在线实时日志.
     */
    browserLog: function (click, otherInfo) {
        new Image().src = this._formatLogUrl(click, otherInfo);
    },
    /**
     * 端内在线实时日志.
     * 日志包含客户端信息的通用参数
     */
    nativeOnlineLog: function (click, otherInfo) {
        var url = this._formatLogUrl(click, otherInfo);
        Loader.get(url, [
            {id: this._commonParam.page, sign: 1},
            {timestamp: (new Date()).getTime() / 1000, sign: 1}
        ], function () {
        }, 0, 0, 'get');
    },
    /**
     * 埋点参数转换为对象格式.
     * 两个参数不能同时缺省
     * @param {String} [click] click值
     * @param {Object} [otherInfo] 其它参数
     * @return {Object} 合并后的键值对象
     */
    _formatLogParam: function (click, otherInfo) {
        var param = {}; 
        util.extend(param, this._commonParam); 
        if (typeof click === 'string') {
            if (otherInfo) {
                util.extend(param, otherInfo);
            }
            param.click = click;
        }
        else {
            util.extend(param, click);
        }
        return param;
    },
    /**
     * 将日志参数处理为完整的日志url.
     * @return {String}
     */
    _formatLogUrl: function (click, otherInfo) {
        var param = this._formatLogParam(click, otherInfo);
        // param.key = param.page;
        // param.value = param.click;
        return logServer + '?t=' + Math.random() +
            '&' + this._serializeParam(param);
    },
    /**
     * 序列化对象为url参数形式.
     * @param {Object} param 只有一层的对象
     * @return {String} 序列化后的字符串
     */
    _serializeParam: function (param) {
        var str = '';
        for (var key in param) {
            var value = param[key];
            if (value !== undefined) {
                str += '&' + key + '=' +
                    ( value == null ? '' : encodeURIComponent(value) );
            }
        }
        return str.substr(1);
    },
    /**
     * 记录日志并延迟执行跳转.
     * 因为记录日志为网络请求，如果记录日志后立即进行页面跳转可能造成记录失败，
     * 对于记录日志后发生跳转的问题，对跳转进行延迟处理
     * @param {String|Function} url 跳转的url或执行的方法
     */
    logJump: function (url, click, otherInfo) {
        this.log(click, otherInfo);
        setTimeout(function () {
            if (typeof url === 'function') {
                url();
            }
            else {
                Tools.locationRedirect(url);
            }
        }, 200);
    }
};

module.exports = {
    initLog: logApi.initLog.bind(logApi),
    log: logApi.log.bind(logApi),
    logJump: logApi.logJump.bind(logApi),
    nativeOnlineLog:logApi.nativeOnlineLog.bind(logApi)
};
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/amap/log.js","/amap")
},{"../util/os":19,"../util/util":20,"../util/webview_info":21,"./bridge":5,"./loader":7,"At5rgb":4,"buffer":1}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/2/6.
 * 地图相关基本功能
 */

var Bridge = require('./bridge');
var os = require('../util/os');

var native = {
    /**
     * 获取高德地图的基本信息.
     * @param {Function} handler 回调函数
     */
    getAppInfo: function (handler) {
        Bridge.send({action: 'getExtraUrl'}, function (res) {
            if (res && res.div) {
                res._div = res.div.match(/\d+/);
                res._div = res._div && res._div.toString().replace(/^0+/, '') * 1;
            }
            handler(res);
        });
    },

    /**
     * 比较地图版本号
     * @params     testdiv 需判断的版本号，如772版本请传'070702'
     * @params     handler 回调方法，使用如下
     * AmapApp.Native.compareDiv('070702', function(res){
     *   if(res){
     *      //当前版本大于等于772版本
     *   }else{       
     *   } 
     * })
     */
    compareDiv: function (testdiv, handler) {
        this.getAppInfo(function (res) {
            var comp_res = false;
            if (res && res.div) {
                comp_res = (Math.floor(res.div.substr(5, 5)) - Math.floor(testdiv)) >= 0;
            }
            handler(comp_res);
        });

    },
    /**
     * 获取用户id.
     * 获取用户id.
     * @param {Function} handler 回调函数。
     *    参数为对象，如果其属性 userid 为空则登录失败||未登录，否则登录成功||已登录
     * @param {Boolean} [默认onlyGetId=false] 可选，是否只获取id，false的话用户未登录时就会自动跳转登录面板
     * @param {Boolean} [默认needRelogin=false] 可选，是否强制重新登录
     */
    getUserId: function (handler, onlyGetId, needRelogin) {
        var param = {
            action: 'getAmapUserId'
        };
        param.onlyGetId = onlyGetId ? '1' : '0';
        param.needRelogin = needRelogin ? '1' : '0';
        Bridge.send(param, handler);
    },
    /**
     * 登陆并绑定相关账号.
     * @param {Function} handler 回调函数。
     --返回值{参数为对象}：
     userid－－－－－String－－－－－用户id
     phone －－－－－String－－－－－用户绑定的手机号
     taobao－－－－－String－－－－－淘宝账号
     tid   －－－－－String－－－－－阿里统一id
     * @param {string} type[默认type=0] 要绑定的账号类型，0为手机号，1为淘宝账号
     *使用如下：AmapApp.util.loginBind(function(res){
            //res.userid 已登陆返回该用户userid
            //res.phone  已绑定手机号返回相应手机号phone
      })
     */
    loginBind: function (handler, type) {
        type = type ? type : 0;
        var param = {
            action: 'loginBind',
            type: type ? 'taobao' : 'phone'
        };
        Bridge.send(param, handler);
    },
    /**解绑用户的账号绑定信息，如手机、支付宝等
     注意：接口只清除客户端的绑定状态，不涉及网络端数据登陆并绑定相关账号.
     * @param {Array} unbundling   要解绑的账号列表["phone", "taobao", "alipay", "weixin", "qq", "weibo", "email"]
     * @param {Function} handler 回调方法
     *使用如下：
     AmapApp.Native.userUnbundling(["phone","taobao"］,function(){
                //解绑后回调
            })
     */
    userUnbundling: function (mArray, handler) {
        if (!mArray || mArray.length == 0) {
            return;
        }
        var param = {
            action: 'userUnbundling',
            unbundling: mArray
        };
        Bridge.send(param, handler);
    },
    /**
     * 获取当前用户位置：城市，经纬度.
     * @param {Function} handler 回调方法
     */
    getMapLocation: function (handler) {
        var param = {
            action: 'getMapLocation',
            forceReturnValue: '1'
        };
        Bridge.send(param, handler);
    },
    /**
     * 打开poi页面.
     * @param {Object} poiInfo poi的基础信息
     * @param {Boolean} [status=false] 状态，默认打开tips形式，值为true时直接打开poi详情
     * @param {String|Integer} status 打开的状态
     *    0 或缺省打开主图显示tip样式
     *    1 直接打开poi详情页
     *    3 打开待tip的主图，但是poi必须为当前poi，用于poi详情页面地址栏点击
     * @param {String} module 打开酒店详情时此值需要为'hotel'
     */
    openPoi: function (poiInfo, status, module) {
        var obj = {
            action: 'openPoi',
            poiInfo: poiInfo
        };
        if (status) {
            obj.status = status + '';
        }
        if (module) {
            obj.module = module;
        }
        Bridge.send(obj);
    },
    /**
     * 执行路线规划.
     * @param {Object} start 起始poi点
     * @param {Object} end 结束poi点
     */
    searchRoute: function (start, end) {
        var param = {
            action: 'searchRoute'
        };
        if (start) {
            param.startPoi = start;
        }
        if (end) {
            param.endPoi = end;
        }
        Bridge.send(param);
    },
    /**
     * 设置title.
     * @param {String} title 标题内容
     */
    setWebViewTitle: function (title) {
        if (os.ios) {
            Bridge.send({
                action: 'setWebViewTitle',
                title: title
            });
        }
        document.title = title;
    },
    /**
     * 通过指定schema到客户端页面
     * @param {String} ios ios schema
     * @param {String} and and schema
     * 如果ios、and通用则只传一个参数即可
     * 常用schema：https://lark.alipay.com/activity/wiki/schema
     */
    loadSchema: function (ios, and) {
        if (!ios) {
            return;
        }
        try {
            var music = document.getElementsByTagName('audio')[0];
            music.pause();
        } catch (e) {

        }

        if (os.ios) {
            var doc = document,
                schemaIframe = doc.getElementById('loadSchemaIframe');
            // 不存在时创建iframe
            if (!schemaIframe) {
                schemaIframe = doc.createElement('iframe');
                schemaIframe.id = 'loadSchemaIframe';
                schemaIframe.style.cssText = 'display:none;width:0px;height:0px';
                doc.body.appendChild(schemaIframe);
            }
            schemaIframe.src = ios;
        } else {
            and = and ? and : ios;
            Bridge.send({
                action: 'loadSchema',
                url: and
            });
        }
    },
    /**
     * 调起客户端的分享面板.
     * @param {Array.<Object>} content 分享内容
     *    数组元素属性说明：
     *    shareType 788+分享类型： 0图文＋链接；1仅图片；2仅文字。默认0,目前只支持微信与钉钉。
     *    type 分享渠道： weixin 微信好友，pengyou 微信朋友圈，weibo 新浪微博
     *    url 分享的 url
     *    title 分享信息的标题，type=weibo时不需要
     *    message 分享信息的内容，type=pengyou时不需要
     *    imgUrl 分享信息显示的图片，微信朋友圈建议使用80*80，微博使用300*300的图片
     *    注：数组长度小于3时，将不显示对应的渠道按钮
     * @param {Function} handler(res) 分享后的回调。
     *     参数类型为对象， 属性 type 为用户选择的分享渠道
     AmapApp.Native.share([
     {
         "type"    : "weibo",
         "title"   : "标题",
         "url"     : "http://www.autonavi.com/",
         "imgUrl"  : "图片地址"
     }, {
            "type"    : "weixin",
            "shareType": "0",
            "title"   : "标题",
            "message" : "内容",
            "url"     : "http://www.autonavi.com/",
        }], function(res){
            //分享成功回调
            //该回调在780及以上点击各渠道触发，780以下点击分享即触发。
        })
     *   详细使用说明：http://gitlab.alibaba-inc.com/amap-h5/home/wikis/native-api-client#share
     */
    share: function (content, handler, hide) {
        var param = {
            action: 'share',
            urlType: 1,
            useCustomUrl: '1',
            content: content,
            loadDirectly: content.length === 1 ? '1' : '0'
        };
        if (hide) {
            param.hideLinkCopyBtn = 1;
            param.hideMoreBtn = 1;
        }

        //回调函数整理
        this.compareDiv('070800', function (high) {
            if (high) {
                param.callbackcase = 1;
                Bridge.send(param, function (res) {
                    setTimeout(function () {
                        handler && handler(res)
                    }, 600);
                });
            } else {
                Bridge.send(param);
                setTimeout(function () {
                    handler && handler(null)
                }, 600);
            }
        });
    },
    /**
     * 关闭当前webview（ios端有bug：不会触发上一个webview的pageshow，改用webviewgoback）
     * @param handler
     */
    closeCurretnWebview: function (handler) {
        Bridge.send({
            action: 'closeCurrentWebview'
        }, handler);
    },
    /*
     打开第三方h5页面
     * @param url 第三方h5页面
     * @param name loading的第三方h5页面名称（高德地图正在带你去{name}）
     * @param time loading时长，默认1500ms，为0时直接进入无loading动画
     * @param handler
     */
    openAppUrl: function (url, name, time, handler) {
        Bridge.send({
            action: 'openAppUrl',
            wapUrl: url,
            appName: name,
            loadingTime: time ? time : '1500'
        }, handler);
    },
    /**
     * 注册titlebar右侧按钮
     －－安卓离开页面时需要再次调用且‘text传空’去掉此按钮，否则有bug
     * @param type
     * @param text
     * @param handler
     */
    registRightButton: function (type, text, handler) {
        var action = os.ios ? 'registRightButton' : 'registRightButtonNew';
        Bridge.send({
            action: action,
            type: type,
            buttonText: text,
            function: {
                'action': 'jsCallBack'
            }
        }, handler);
    },
    /**
     * 注销titlebar右侧按钮
     －－安卓上跳转其他页面之前，需要调用此方法去掉titlebar右上角btn，否则有bug
     * @param type
     * @param text
     * @param handler
     */
    destroyRightButton: function (handler) {
        var action = os.ios ? 'registRightButton' : 'registRightButtonNew';
        Bridge.send({
            action: action,
            type: "",
            buttonText: "",
            function: {
                'action': 'jsCallBack'
            }
        }, handler);
    },
    /**
     * 使用XXTEA方式加密（ent2）
     * @param text[string] 必传，待加密字符串
     * @handler(res) 加密成功后的回调,res加密后的串
     */
    xxEncode: function (text, handler) {
        Bridge.send({
            action: 'xxEncode',
            text: text ? text : ''
        }, function (res) {
            handler && handler(res.result.in)
        });
    },
    /**
     * 使用XXTEA方式解密
     * @param  text[string] 必传，待解密字符串
     * @handler(res) 解密成功后的回调,res解密后的串
     */
    xxDecode: function (text, handler) {
        Bridge.send({
            action: 'xxDecode',
            text: text ? text : ''
        }, function (res) {
            handler && handler(res.result.de)
        });
    },
    /**
     * 关闭默认 'X'按钮
     * @param  ishidden[boolean] 是否隐藏关闭按钮，默认显示
     */
    setWebViewCloseBtn: function (ishidden) {
        Bridge.send({
            'action': 'setWebViewCloseBtn',
            'hidden': ishidden ? true : false,
        });
    },
    /**
     * 客户端回退
     * @param  step[number] 回退步数，默认为1（回退多步有bug）
     */
    webviewGoBack: function (step) {
        step ? step : 1;
        Bridge.send({
            action: 'webviewGoBack',
            step: step
        }, function (res) {
        });
    },
    getDeviceParamString: function (params, delimiting, encypt, handler) {
        Bridge.send({
            'action': 'getDeviceParamString',
            'params': params,
            'delimiting': delimiting,
            'encypt': encypt
        }, function (res) {
            handler(res);
        });
    }
};

module.exports = native;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/amap/native.js","/amap")
},{"../util/os":19,"./bridge":5,"At5rgb":4,"buffer":1}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/2/9.
 * 请勿手动修改此问题
 */

// 是否调试模式
var debug = true;
 
 
module.exports = {
    debug: debug
};

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/config/_ini.js","/config")
},{"At5rgb":4,"buffer":1}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/2/13.
 * 活动各种名称配置文件, 需要用户手动配置
 */
module.exports = {
    logname:'2017golf',//埋点名称&活动名称
    aosname:'volkswagen',//aos链接名称
    activity:'volkswagen',//aos通用模块活动名称
};

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/config/config.act.js","/config")
},{"At5rgb":4,"buffer":1}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/2/13.
 * URL配置文件, 需要用户手动配置
 */
var ini = require('./_ini');
var LINKURL = {};  // output
var linkURL = {  
    //我的奖品,AmapApp.util.goAward()
    awardlist: {
        test: '//group.testing.amap.com/public/activity/common/page/awardlist.html',
        public: '//cache.amap.com/activity/common/page/awardlist.html'
    },
    //编辑地址,AmapApp.util.goAddr()
    editaddr: {
        test: '//group.testing.amap.com/public/activity/common/page/editaddr.html',
        public: '//cache.amap.com/activity/common/page/editaddr.html'
    },
    //金币商城,AmapApp.util.pageJump(AmapApp.LINKURL.goldcoin+'?gd_from='+AmapApp.ACTNAME)
    goldcoin:{
        test: '//group.testing.amap.com/public/goldcoin/index.html',
        public: '//wap.amap.com/goldcoin/index.html'
    },
    //功能结束模块化弹窗跳转链接
    acturl:{
        test: '//group.testing.amap.com/public/activity/2017NewGold/page/index.html',
        public: '//cache.amap.com/activity/2017NewGold/page/index.html'
    }
};

var ONLINE_HOST = location.protocol + '//wap.amap.com';
var DEBUG_HOST = location.protocol + '//group.testing.amap.com/public';
var HOST = ini.debug ? DEBUG_HOST : ONLINE_HOST;
for (var k in linkURL) {
    if (linkURL[k].test) {
        LINKURL[k] = location.protocol + (ini.debug ? linkURL[k].test : linkURL[k].public)
    } else {
        LINKURL[k] = HOST + '/' + linkURL[k];
    }
}


module.exports = LINKURL;

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/config/config.url.js","/config")
},{"./_ini":10,"At5rgb":4,"buffer":1}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by hyr111276 on 2017/11/13.
 */
var log = require('./amap/log');
var Bridge = require('./amap/bridge');
var Native = require('./amap/native');
var Loader = require('./amap/loader');
var util = require('./util/util');
var os  = require('./util/os');
var webview = require('./util/webview_info');
var locat = require('./util/locat');
var openAmap = require('./util/openAmap');
var login = require('./util/needBind');
util.extend(util, openAmap);
util.extend(util, locat);
util.extend(util, webview);
util.extend(util, login);
util.os = os;

var thirdCommon = {
    ready: Bridge.ready,
    //广州交警获取tid+token
    getParams: function (handler) {
        var tid = 0x20;
        var token = 0x40;
        var params = tid | token;
        Native.getDeviceParamString(params, '@AMAP@', true, function (res) {
            var value = res.value;
            handler(value);
        })
    },
    addPhoto: function (businessName, titleText, maxLength, onlyCamera, cb) {
        Bridge.send({
            "action": "addPhoto",
            "businessName": businessName,
            "titleText": titleText,
            "maxLength": maxLength,
            "onlyCamera": onlyCamera //(是否直接调起摄像头拍照 （7.7.8+支持）),
        }, function (base64) {
            var value = base64.imgbase64;
            cb(value);
        });
    },
    /**
     * 获取用户id.
     * 获取用户id.
     * @param {Function} handler 回调函数。
     *    参数为对象，如果其属性 userid 为空则登录失败||未登录，否则登录成功||已登录
     * @param {Boolean} [默认onlyGetId=false] 可选，是否只获取id，false的话用户未登录时就会自动跳转登录面板
     * @param {Boolean} [默认needRelogin=false] 可选，是否强制重新登录
     */
    getUserID: function (handler, onlyGetId, needRelogin) {
        Native.getUserId(function (userInfo) {
            handler(userInfo.userid);
        }, onlyGetId, needRelogin)
    },
    //获取日历
    freshRoomData: function () {
        Bridge.send({
            "action": "openHotelCalendar",
            "type": "scenic",
            "date": "2017-11-29"
        }, function (obj) {
            alert(obj.date);
        });
    },
    //openApp
    openApp: function () {
        util.openApp.apply(util, arguments);
    },
    /**
     * 调起客户端的分享面板.
     *
     * @param {Array.<Object>} content 分享内容
     *    数组元素属性说明：
     *    type 分享渠道： weixin 微信好友，pengyou 微信朋友圈，weibo 新浪微博
     *    url 分享的 url
     *    title 分享信息的标题，type=weibo时不需要
     *    message 分享信息的内容，type=pengyou时不需要
     *    imgUrl 分享信息显示的图片，微信朋友圈建议使用80*80，微博使用300*300的图片
     *    示例：
     *    [
     *      {type: 'weixin', title: '分享标题', message: '分享内容', url: 'http://a.com', imgUrl: 'http://b.jpg'},
     *      {type: 'pengyou', title: '分享信息', url: 'http://a.com', imgUrl: 'http://b.jpg'},
     *      {type: 'weibo', message: '分享信息', url: 'http://a.com', imgUrl: 'http://b.jpg'}
     *    ]
     *    注：数组长度小于3时，将不显示对应的渠道按钮
     * @param {Function} handler 分享后的回调。
     *   参数类型未对象， 属性 type 为用户选择的分享渠道，
     *   属性result=ok 时表示分享成功
     *   注：分享成功后未点击回到高德地图时 result 为 fail
     */
    share: function(content, handler) {
        Bridge.send({
            action       : 'share',
            urlType      : '1',
            useCustomUrl : '1',
            content      : content,
            loadDirectly : 0,//只有1个时候传1，非1个传0
            hideLinkCopyBtn: 0,
            hideMoreBtn: 0
        }, handler);
    },
    Log: log,
    util: util,
    Native: Native,
    Loader: Loader,
    Bridge:Bridge,

};

window.AmapApp = thirdCommon;

module.exports = thirdCommon;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_6b0d9f4c.js","/")
},{"./amap/bridge":5,"./amap/loader":7,"./amap/log":8,"./amap/native":9,"./util/locat":16,"./util/needBind":17,"./util/openAmap":18,"./util/os":19,"./util/util":20,"./util/webview_info":21,"At5rgb":4,"buffer":1}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/** 
 *  HOW TO USE:
 *  require('./lib/msgbox'); 
    $.MsgBox({
        content: '提示文案',
        tips:'小字提示文案',
        cancelLabel: '取消按钮文案/点击后关闭弹窗',
        cancelFn: function () {
            //取消按钮点击回调
        },
        okLabel: '确定按钮文案/点击后关闭弹窗',
        okFn: function () {
            //确定按钮点击回调
        },
        shareLabel: '分享按钮文案/点击后不关闭弹窗',
        shareFn: function () {
            //分享按钮点击回调
        }, 
        hasClose: false //默认没有关闭按钮
        
    });
 */
var $ = require('./zepto');
var $layer = $('.layer');


var MsgBox = {

    init: function() { 
        this.$element = $('<div id="msgbox" class="msgbox-container"></div>');
        this.appendDom();
        this.bindEvent();
    },

    appendDom: function() { 
        $(document.body).append(this.$element);
        if (!$layer.length) {
            $layer = $('<div class="layer"></div>'); 
            $(document.body).append($layer);
            $layer.on('touchmove', false);
        } 
    },

    bindEvent: function() {
        var me = this; 
        this.$element.on('click', '[data-click-type=ok]', function() {
            me.hide();
            me.options.okFn && me.options.okFn.call(me);
        });
        this.$element.on('click', '[data-click-type=cancel]', function() {
            me.hide();
            me.options.cancelFn && me.options.cancelFn.call(me);
        });
        this.$element.on('click', '[data-click-type=close]', function() {
            me.hide();
            me.options.closeFn && me.options.closeFn.call(me);
        });
        this.$element.on('click', '[data-click-type=share]', function() {
            me.options.shareFn && me.options.shareFn.call(me);
        });
    },

    show: function(opts) {
        var html = '';
        this.options = opts;
        if (!this.$element) {
            this.init();
        }
        if (opts.title) {
            html += '<header><h3>' + opts.title + '</h3></header>'
        }
        if (opts.content) {
            html += '<div class="msgbox-body">' + opts.content + '</div>';
        }
        html += '<footer>';
        if (opts.shareLabel) {
            html += '<div class="msgbox-btn" data-click-type="share"><div>' + opts.shareLabel + '</div></div>';
        }
        if (opts.cancelLabel) {
            html += '<div class="msgbox-btn" data-click-type="cancel"><div>' + opts.cancelLabel + '</div></div>';
        }
        if (opts.okLabel) {
            html += '<div class="msgbox-btn" data-click-type="ok"><div>' + opts.okLabel + '</div></div>';
        }
        html += '</footer>';
        if (opts.tips) {
            html += '<div class="mstips"><div>' + opts.tips + '</div>';
        } 
        if (opts.hasClose) { 
            html += '<div class="closebtn" data-click-type="close"></div>';
        }
        this.$element.html(html);
        $layer.css('display', 'block');
        this.$element.css('display', 'block');
    },

    hide: function() {
        this.$element.hide();
        $layer.hide();
    }

};

var opts = {
    title: '',
    content: 'message body',
    okLabel: '',
    cancelLabel: '',
    shareLabel: '',
    okFn: function() {},
    cancelFn: function() {},
    shareFn: function() {},
    hasClose: false //默认没有关闭按钮
};

$.MsgBox = function(_opts) { 
    MsgBox.show($.extend({}, opts, _opts)); 
}; 

// module.exports = new MsgBox();
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/lib/msgbox.js","/lib")
},{"./zepto":15,"At5rgb":4,"buffer":1}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */
// (function(global, factory) {
//   if (typeof define === 'function' && define.amd)
//     define(function() { return factory(global) })
//   else
//     factory(global)
// }(this, function(window) {
var Zepto = (function() {
    var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,
        
        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
        
        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div'),
        propMap = {
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        },
        isArray = Array.isArray ||
            function(object){ return object instanceof Array }
    
    zepto.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.matches || element.webkitMatchesSelector ||
            element.mozMatchesSelector || element.oMatchesSelector ||
            element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }
    
    function type(obj) {
        return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object"
    }
    
    function isFunction(value) { return type(value) == "function" }
    function isWindow(obj)     { return obj != null && obj == obj.window }
    function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
    function isObject(obj)     { return type(obj) == "object" }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }
    
    function likeArray(obj) {
        var length = !!obj && 'length' in obj && obj.length,
            type = $.type(obj)
        
        return 'function' != type && !isWindow(obj) && (
                'array' == type || length === 0 ||
                (typeof length == 'number' && length > 0 && (length - 1) in obj)
            )
    }
    
    function compact(array) { return filter.call(array, function(item){ return item != null }) }
    function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
    camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }
    uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
    
    function classRE(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }
    
    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }
    
    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getComputedStyle(element, '').getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }
    
    function children(element) {
        return 'children' in element ?
            slice.call(element.children) :
            $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
    }
    
    function Z(dom, selector) {
        var i, len = dom ? dom.length : 0
        for (i = 0; i < len; i++) this[i] = dom[i]
        this.length = len
        this.selector = selector || ''
    }
    
    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overridden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function(html, name, properties) {
        var dom, nodes, container
        
        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))
        
        if (!dom) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
            if (!(name in containers)) name = '*'
            
            container = containers[name]
            container.innerHTML = '' + html
            dom = $.each(slice.call(container.childNodes), function(){
                container.removeChild(this)
            })
        }
        
        if (isPlainObject(properties)) {
            nodes = $(dom)
            $.each(properties, function(key, value) {
                if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                else nodes.attr(key, value)
            })
        }
        
        return dom
    }
    
    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. This method can be overridden in plugins.
    zepto.Z = function(dom, selector) {
        return new Z(dom, selector)
    }
    
    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overridden in plugins.
    zepto.isZ = function(object) {
        return object instanceof zepto.Z
    }
    
    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overridden in plugins.
    zepto.init = function(selector, context) {
        var dom
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // Optimize for string selectors
        else if (typeof selector == 'string') {
            selector = selector.trim()
            // If it's a html fragment, create nodes from it
            // Note: In both Chrome 21 and Firefox 15, DOM error 12
            // is thrown if the fragment doesn't begin with <
            if (selector[0] == '<' && fragmentRE.test(selector))
                dom = zepto.fragment(selector, RegExp.$1, context), selector = null
            // If there's a context, create a collection on that context first, and select
            // nodes from there
            else if (context !== undefined) return $(context).find(selector)
            // If it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
        }
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, just return it
        else if (zepto.isZ(selector)) return selector
        else {
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector)
            // Wrap DOM nodes.
            else if (isObject(selector))
                dom = [selector], selector = null
            // If it's a html fragment, create nodes from it
            else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
            // If there's a context, create a collection on that context first, and select
            // nodes from there
            else if (context !== undefined) return $(context).find(selector)
            // And last but no least, if it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector)
    }
    
    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, which makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function(selector, context){
        return zepto.init(selector, context)
    }
    
    function extend(target, source, deep) {
        for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {}
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
    }
    
    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
    }
    
    // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overridden in plugins.
    zepto.qsa = function(element, selector){
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
            isSimple = simpleSelectorRE.test(nameOnly)
        return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
            ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
            (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
                slice.call(
                    isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
                        maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
                            element.getElementsByTagName(selector) : // Or a tag
                        element.querySelectorAll(selector) // Or it's not simple, and we need to query all
                )
    }
    
    function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
    }
    
    $.contains = document.documentElement.contains ?
        function(parent, node) {
            return parent !== node && parent.contains(node)
        } :
        function(parent, node) {
            while (node && (node = node.parentNode))
                if (node === parent) return true
            return false
        }
    
    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }
    
    function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }
    
    // access className property while respecting SVGAnimatedString
    function className(node, value){
        var klass = node.className || '',
            svg   = klass && klass.baseVal !== undefined
        
        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }
    
    // "true"  => true
    // "false" => false
    // "null"  => null
    // "42"    => 42
    // "42.5"  => 42.5
    // "08"    => "08"
    // JSON    => parse if valid
    // String  => self
    function deserializeValue(value) {
        try {
            return value ?
            value == "true" ||
            ( value == "false" ? false :
                value == "null" ? null :
                    +value + "" == value ? +value :
                        /^[\[\{]/.test(value) ? $.parseJSON(value) :
                            value )
                : value
        } catch(e) {
            return value
        }
    }
    
    $.type = type
    $.isFunction = isFunction
    $.isWindow = isWindow
    $.isArray = isArray
    $.isPlainObject = isPlainObject
    
    $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
    }
    
    $.isNumeric = function(val) {
        var num = Number(val), type = typeof val
        return val != null && type != 'boolean' &&
            (type != 'string' || val.length) &&
            !isNaN(num) && isFinite(num) || false
    }
    
    $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
    }
    
    $.camelCase = camelize
    $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
    }
    
    // plugin compatibility
    $.uuid = 0
    $.support = { }
    $.expr = { }
    $.noop = function() {}
    
    $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i)
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback(elements[key], key)
                if (value != null) values.push(value)
            }
        return flatten(values)
    }
    
    $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }
        
        return elements
    }
    
    $.grep = function(elements, callback){
        return filter.call(elements, callback)
    }
    
    if (window.JSON) $.parseJSON = JSON.parse
    
    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
    })
    
    // Define methods that will be available on all
    // Zepto collections
    $.fn = {
        constructor: zepto.Z,
        length: 0,
        
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        splice: emptyArray.splice,
        indexOf: emptyArray.indexOf,
        concat: function(){
            var i, value, args = []
            for (i = 0; i < arguments.length; i++) {
                value = arguments[i]
                args[i] = zepto.isZ(value) ? value.toArray() : value
            }
            return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
        },
        
        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
            return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
            return $(slice.apply(this, arguments))
        },
        
        ready: function(callback){
            // need to check if document.body exists for IE as that browser reports
            // document ready when it hasn't yet created the body element
            if (readyRE.test(document.readyState) && document.body) callback($)
            else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
            return this
        },
        get: function(idx){
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
            return this.length
        },
        remove: function(){
            return this.each(function(){
                if (this.parentNode != null)
                    this.parentNode.removeChild(this)
            })
        },
        each: function(callback){
            emptyArray.every.call(this, function(el, idx){
                return callback.call(el, idx, el) !== false
            })
            return this
        },
        filter: function(selector){
            if (isFunction(selector)) return this.not(this.not(selector))
            return $(filter.call(this, function(element){
                return zepto.matches(element, selector)
            }))
        },
        add: function(selector,context){
            return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
            return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
            var nodes=[]
            if (isFunction(selector) && selector.call !== undefined)
                this.each(function(idx){
                    if (!selector.call(this,idx)) nodes.push(this)
                })
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                this.forEach(function(el){
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return $(nodes)
        },
        has: function(selector){
            return this.filter(function(){
                return isObject(selector) ?
                    $.contains(this, selector) :
                    $(this).find(selector).size()
            })
        },
        eq: function(idx){
            return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
            var el = this[0]
            return el && !isObject(el) ? el : $(el)
        },
        last: function(){
            var el = this[this.length - 1]
            return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
            var result, $this = this
            if (!selector) result = $()
            else if (typeof selector == 'object')
                result = $(selector).filter(function(){
                    var node = this
                    return emptyArray.some.call($this, function(parent){
                        return $.contains(parent, node)
                    })
                })
            else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
            else result = this.map(function(){ return zepto.qsa(this, selector) })
            return result
        },
        closest: function(selector, context){
            var nodes = [], collection = typeof selector == 'object' && $(selector)
            this.each(function(_, node){
                while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                    node = node !== context && !isDocument(node) && node.parentNode
                if (node && nodes.indexOf(node) < 0) nodes.push(node)
            })
            return $(nodes)
        },
        parents: function(selector){
            var ancestors = [], nodes = this
            while (nodes.length > 0)
                nodes = $.map(nodes, function(node){
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node)
                        return node
                    }
                })
            return filtered(ancestors, selector)
        },
        parent: function(selector){
            return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
            return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
            return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
        },
        siblings: function(selector){
            return filtered(this.map(function(i, el){
                return filter.call(children(el.parentNode), function(child){ return child!==el })
            }), selector)
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
            return $.map(this, function(el){ return el[property] })
        },
        show: function(){
            return this.each(function(){
                this.style.display == "none" && (this.style.display = '')
                if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                    this.style.display = defaultDisplay(this.nodeName)
            })
        },
        replaceWith: function(newContent){
            return this.before(newContent).remove()
        },
        wrap: function(structure){
            var func = isFunction(structure)
            if (this[0] && !func)
                var dom   = $(structure).get(0),
                    clone = dom.parentNode || this.length > 1
            
            return this.each(function(index){
                $(this).wrapAll(
                    func ? structure.call(this, index) :
                        clone ? dom.cloneNode(true) : dom
                )
            })
        },
        wrapAll: function(structure){
            if (this[0]) {
                $(this[0]).before(structure = $(structure))
                var children
                // drill down to the inmost element
                while ((children = structure.children()).length) structure = children.first()
                $(structure).append(this)
            }
            return this
        },
        wrapInner: function(structure){
            var func = isFunction(structure)
            return this.each(function(index){
                var self = $(this), contents = self.contents(),
                    dom  = func ? structure.call(this, index) : structure
                contents.length ? contents.wrapAll(dom) : self.append(dom)
            })
        },
        unwrap: function(){
            this.parent().each(function(){
                $(this).replaceWith($(this).children())
            })
            return this
        },
        clone: function(){
            return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
            return this.css("display", "none")
        },
        toggle: function(setting){
            return this.each(function(){
                var el = $(this)
                    ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
            })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
            return 0 in arguments ?
                this.each(function(idx){
                    var originHtml = this.innerHTML
                    $(this).empty().append( funcArg(this, html, idx, originHtml) )
                }) :
                (0 in this ? this[0].innerHTML : null)
        },
        text: function(text){
            return 0 in arguments ?
                this.each(function(idx){
                    var newText = funcArg(this, text, idx, this.textContent)
                    this.textContent = newText == null ? '' : ''+newText
                }) :
                (0 in this ? this.pluck('textContent').join("") : null)
        },
        attr: function(name, value){
            var result
            return (typeof name == 'string' && !(1 in arguments)) ?
                (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
                this.each(function(idx){
                    if (this.nodeType !== 1) return
                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
        },
        removeAttr: function(name){
            return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
                setAttribute(this, attribute)
            }, this)})
        },
        prop: function(name, value){
            name = propMap[name] || name
            return (1 in arguments) ?
                this.each(function(idx){
                    this[name] = funcArg(this, value, idx, this[name])
                }) :
                (this[0] && this[0][name])
        },
        removeProp: function(name){
            name = propMap[name] || name
            return this.each(function(){ delete this[name] })
        },
        data: function(name, value){
            var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()
            
            var data = (1 in arguments) ?
                this.attr(attrName, value) :
                this.attr(attrName)
            
            return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
            if (0 in arguments) {
                if (value == null) value = ""
                return this.each(function(idx){
                    this.value = funcArg(this, value, idx, this.value)
                })
            } else {
                return this[0] && (this[0].multiple ?
                        $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
                        this[0].value)
            }
        },
        offset: function(coordinates){
            if (coordinates) return this.each(function(index){
                var $this = $(this),
                    coords = funcArg(this, coordinates, index, $this.offset()),
                    parentOffset = $this.offsetParent().offset(),
                    props = {
                        top:  coords.top  - parentOffset.top,
                        left: coords.left - parentOffset.left
                    }
                
                if ($this.css('position') == 'static') props['position'] = 'relative'
                $this.css(props)
            })
            if (!this.length) return null
            if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
                return {top: 0, left: 0}
            var obj = this[0].getBoundingClientRect()
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
            }
        },
        css: function(property, value){
            if (arguments.length < 2) {
                var element = this[0]
                if (typeof property == 'string') {
                    if (!element) return
                    return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
                } else if (isArray(property)) {
                    if (!element) return
                    var props = {}
                    var computedStyle = getComputedStyle(element, '')
                    $.each(property, function(_, prop){
                        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
                    })
                    return props
                }
            }
            
            var css = ''
            if (type(property) == 'string') {
                if (!value && value !== 0)
                    this.each(function(){ this.style.removeProperty(dasherize(property)) })
                else
                    css = dasherize(property) + ":" + maybeAddPx(property, value)
            } else {
                for (key in property)
                    if (!property[key] && property[key] !== 0)
                        this.each(function(){ this.style.removeProperty(dasherize(key)) })
                    else
                        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
            }
            
            return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
            if (!name) return false
            return emptyArray.some.call(this, function(el){
                return this.test(className(el))
            }, classRE(name))
        },
        addClass: function(name){
            if (!name) return this
            return this.each(function(idx){
                if (!('className' in this)) return
                classList = []
                var cls = className(this), newName = funcArg(this, name, idx, cls)
                newName.split(/\s+/g).forEach(function(klass){
                    if (!$(this).hasClass(klass)) classList.push(klass)
                }, this)
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
            })
        },
        removeClass: function(name){
            return this.each(function(idx){
                if (!('className' in this)) return
                if (name === undefined) return className(this, '')
                classList = className(this)
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
                    classList = classList.replace(classRE(klass), " ")
                })
                className(this, classList.trim())
            })
        },
        toggleClass: function(name, when){
            if (!name) return this
            return this.each(function(idx){
                var $this = $(this), names = funcArg(this, name, idx, className(this))
                names.split(/\s+/g).forEach(function(klass){
                    (when === undefined ? !$this.hasClass(klass) : when) ?
                        $this.addClass(klass) : $this.removeClass(klass)
                })
            })
        },
        scrollTop: function(value){
            if (!this.length) return
            var hasScrollTop = 'scrollTop' in this[0]
            if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
            return this.each(hasScrollTop ?
                function(){ this.scrollTop = value } :
                function(){ this.scrollTo(this.scrollX, value) })
        },
        scrollLeft: function(value){
            if (!this.length) return
            var hasScrollLeft = 'scrollLeft' in this[0]
            if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
            return this.each(hasScrollLeft ?
                function(){ this.scrollLeft = value } :
                function(){ this.scrollTo(value, this.scrollY) })
        },
        position: function() {
            if (!this.length) return
            
            var elem = this[0],
                // Get *real* offsetParent
                offsetParent = this.offsetParent(),
                // Get correct offsets
                offset       = this.offset(),
                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()
            
            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
            offset.left -= parseFloat( $(elem).css('margin-left') ) || 0
            
            // Add offsetParent borders
            parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
            parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0
            
            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            }
        },
        offsetParent: function() {
            return this.map(function(){
                var parent = this.offsetParent || document.body
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                    parent = parent.offsetParent
                return parent
            })
        }
    }
    
    // for now
    $.fn.detach = $.fn.remove
    
    // Generate the `width` and `height` functions
    ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
            dimension.replace(/./, function(m){ return m[0].toUpperCase() })
        
        $.fn[dimension] = function(value){
            var offset, el = this[0]
            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
                isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
                (offset = this.offset()) && offset[dimension]
            else return this.each(function(idx){
                el = $(this)
                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
            })
        }
    })
    
    function traverseNode(node, fun) {
        fun(node)
        for (var i = 0, len = node.childNodes.length; i < len; i++)
            traverseNode(node.childNodes[i], fun)
    }
    
    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append
        
        $.fn[operator] = function(){
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType, nodes = $.map(arguments, function(arg) {
                    var arr = []
                    argType = type(arg)
                    if (argType == "array") {
                        arg.forEach(function(el) {
                            if (el.nodeType !== undefined) return arr.push(el)
                            else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
                            arr = arr.concat(zepto.fragment(el))
                        })
                        return arr
                    }
                    return argType == "object" || arg == null ?
                        arg : zepto.fragment(arg)
                }),
                parent, copyByClone = this.length > 1
            if (nodes.length < 1) return this
            
            return this.each(function(_, target){
                parent = inside ? target : target.parentNode
                
                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                    operatorIndex == 1 ? target.firstChild :
                        operatorIndex == 2 ? target :
                            null
                
                var parentInDocument = $.contains(document.documentElement, parent)
                
                nodes.forEach(function(node){
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $(node).remove()
                    
                    parent.insertBefore(node, target)
                    if (parentInDocument) traverseNode(node, function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src){
                            var target = el.ownerDocument ? el.ownerDocument.defaultView : window
                            target['eval'].call(target, el.innerHTML)
                        }
                    })
                })
            })
        }
        
        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
            $(html)[operator](this)
            return this
        }
    })
    
    zepto.Z.prototype = Z.prototype = $.fn
    
    // Export internal API functions in the `$.zepto` namespace
    zepto.uniq = uniq
    zepto.deserializeValue = deserializeValue
    $.zepto = zepto
    
    return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
    var _zid = 1, undefined,
        slice = Array.prototype.slice,
        isFunction = $.isFunction,
        isString = function(obj){ return typeof obj == 'string' },
        handlers = {},
        specialEvents={},
        focusinSupported = 'onfocusin' in window,
        focus = { focus: 'focusin', blur: 'focusout' },
        hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }
    
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'
    
    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
            return handler
                && (!event.e  || handler.e == event.e)
                && (!event.ns || matcher.test(handler.ns))
                && (!fn       || zid(handler.fn) === zid(fn))
                && (!selector || handler.sel == selector)
        })
    }
    function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }
    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }
    
    function eventCapture(handler, captureSetting) {
        return handler.del &&
            (!focusinSupported && (handler.e in focus)) ||
            !!captureSetting
    }
    
    function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
    }
    
    function add(element, events, fn, data, selector, delegator, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        events.split(/\s/).forEach(function(event){
            if (event == 'ready') return $(document).ready(fn)
            var handler   = parse(event)
            handler.fn    = fn
            handler.sel   = selector
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function(e){
                var related = e.relatedTarget
                if (!related || (related !== this && !$.contains(this, related)))
                    return handler.fn.apply(this, arguments)
            }
            handler.del   = delegator
            var callback  = delegator || fn
            handler.proxy = function(e){
                e = compatible(e)
                if (e.isImmediatePropagationStopped()) return
                e.data = data
                var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
                if (result === false) e.preventDefault(), e.stopPropagation()
                return result
            }
            handler.i = set.length
            set.push(handler)
            if ('addEventListener' in element)
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
    }
    function remove(element, events, fn, selector, capture){
        var id = zid(element)
            ;(events || '').split(/\s/).forEach(function(event){
            findHandlers(element, event, fn, selector).forEach(function(handler){
                delete handlers[id][handler.i]
                if ('removeEventListener' in element)
                    element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        })
    }
    
    $.event = { add: add, remove: remove }
    
    $.proxy = function(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return $.proxy.apply(null, args)
            } else {
                return $.proxy(fn[context], fn)
            }
        } else {
            throw new TypeError("expected function")
        }
    }
    
    $.fn.bind = function(event, data, callback){
        return this.on(event, data, callback)
    }
    $.fn.unbind = function(event, callback){
        return this.off(event, callback)
    }
    $.fn.one = function(event, selector, data, callback){
        return this.on(event, selector, data, callback, 1)
    }
    
    var returnTrue = function(){return true},
        returnFalse = function(){return false},
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        }
    
    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            source || (source = event)
            
            $.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name]
                event[name] = function(){
                    this[predicate] = returnTrue
                    return sourceMethod && sourceMethod.apply(source, arguments)
                }
                event[predicate] = returnFalse
            })
            
            event.timeStamp || (event.timeStamp = Date.now())
            
            if (source.defaultPrevented !== undefined ? source.defaultPrevented :
                    'returnValue' in source ? source.returnValue === false :
                    source.getPreventDefault && source.getPreventDefault())
                event.isDefaultPrevented = returnTrue
        }
        return event
    }
    
    function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]
        
        return compatible(proxy, event)
    }
    
    $.fn.delegate = function(selector, event, callback){
        return this.on(event, selector, callback)
    }
    $.fn.undelegate = function(selector, event, callback){
        return this.off(event, selector, callback)
    }
    
    $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
    }
    $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
    }
    
    $.fn.on = function(event, selector, data, callback, one){
        var autoRemove, delegator, $this = this
        if (event && !isString(event)) {
            $.each(event, function(type, fn){
                $this.on(type, selector, data, fn, one)
            })
            return $this
        }
        
        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = data, data = selector, selector = undefined
        if (callback === undefined || data === false)
            callback = data, data = undefined
        
        if (callback === false) callback = returnFalse
        
        return $this.each(function(_, element){
            if (one) autoRemove = function(e){
                remove(element, e.type, callback)
                return callback.apply(this, arguments)
            }
            
            if (selector) delegator = function(e){
                var evt, match = $(e.target).closest(selector, element).get(0)
                if (match && match !== element) {
                    evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                    return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                }
            }
            
            add(element, event, callback, data, selector, delegator || autoRemove)
        })
    }
    $.fn.off = function(event, selector, callback){
        var $this = this
        if (event && !isString(event)) {
            $.each(event, function(type, fn){
                $this.off(type, selector, fn)
            })
            return $this
        }
        
        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = selector, selector = undefined
        
        if (callback === false) callback = returnFalse
        
        return $this.each(function(){
            remove(this, event, callback, selector)
        })
    }
    
    $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
            // handle focus(), blur() by calling them directly
            if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
            // items in the collection might not be DOM elements
            else if ('dispatchEvent' in this) this.dispatchEvent(event)
            else $(this).triggerHandler(event, args)
        })
    }
    
    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function(event, args){
        var e, result
        this.each(function(i, element){
            e = createProxy(isString(event) ? $.Event(event) : event)
            e._args = args
            e.target = element
            $.each(findHandlers(element, event.type || event), function(i, handler){
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }
    
    // shortcut methods for `.bind(event, fn)` for each event type
    ;('focusin focusout focus blur load resize scroll unload click dblclick '+
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
    'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
            return (0 in arguments) ?
                this.bind(event, callback) :
                this.trigger(event)
        }
    })
    
    $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
    }
    
})(Zepto)

;(function($){
    var jsonpID = +new Date(),
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/,
        originAnchor = document.createElement('a')
    
    originAnchor.href = window.location.href
    
    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
    }
    
    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }
    
    // Number of active Ajax requests
    $.active = 0
    
    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }
    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }
    
    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
            return false
        
        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }
    function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
    }
    
    function ajaxDataFilter(data, type, settings) {
        if (settings.dataFilter == empty) return data
        var context = settings.context
        return settings.dataFilter.call(context, data, type)
    }
    
    // Empty function, used as default callback
    function empty() {}
    
    $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options)
        
        var _callbackName = options.jsonpCallback,
            callbackName = ($.isFunction(_callbackName) ?
                    _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,
            abort = function(errorType) {
                $(script).triggerHandler('error', errorType || 'abort')
            },
            xhr = { abort: abort }, abortTimeout
        
        if (deferred) deferred.promise(xhr)
        
        $(script).on('load error', function(e, errorType){
            clearTimeout(abortTimeout)
            $(script).off().remove()
            
            if (e.type == 'error' || !responseData) {
                ajaxError(null, errorType || 'error', xhr, options, deferred)
            } else {
                ajaxSuccess(responseData[0], xhr, options, deferred)
            }
            
            window[callbackName] = originalCallback
            if (responseData && $.isFunction(originalCallback))
                originalCallback(responseData[0])
            
            originalCallback = responseData = undefined
        })
        
        if (ajaxBeforeSend(xhr, options) === false) {
            abort('abort')
            return xhr
        }
        
        window[callbackName] = function(){
            responseData = arguments
        }
        
        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)
        
        if (options.timeout > 0) abortTimeout = setTimeout(function(){
            abort('timeout')
        }, options.timeout)
        
        return xhr
    }
    
    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json:   jsonType,
            xml:    'application/xml, text/xml',
            html:   htmlType,
            text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
        //Used to handle the raw response data of XMLHttpRequest.
        //This is a pre-filtering function to sanitize the response.
        //The sanitized response should be returned
        dataFilter: empty
    }
    
    function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
                mime == jsonType ? 'json' :
                    scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml' ) || 'text'
    }
    
    function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }
    
    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
            options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
            options.url = appendQuery(options.url, options.data), options.data = undefined
    }
    
    $.ajax = function(options){
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred(),
            urlAnchor, hashIndex
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
        
        ajaxStart(settings)
        
        if (!settings.crossDomain) {
            urlAnchor = document.createElement('a')
            urlAnchor.href = settings.url
            // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
            urlAnchor.href = urlAnchor.href
            settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
        }
        
        if (!settings.url) settings.url = window.location.toString()
        if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
        serializeData(settings)
        
        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (hasPlaceholder) dataType = 'jsonp'
        
        if (settings.cache === false || (
                (!options || options.cache !== true) &&
                ('script' == dataType || 'jsonp' == dataType)
            ))
            settings.url = appendQuery(settings.url, '_=' + Date.now())
        
        if ('jsonp' == dataType) {
            if (!hasPlaceholder)
                settings.url = appendQuery(settings.url,
                    settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
            return $.ajaxJSONP(settings, deferred)
        }
        
        var mime = settings.accepts[dataType],
            headers = { },
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout
        
        if (deferred) deferred.promise(xhr)
        
        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
        
        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader
        
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
                    
                    if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
                        result = xhr.response
                    else {
                        result = xhr.responseText
                        
                        try {
                            // http://perfectionkills.com/global-eval-what-are-the-options/
                            // sanitize response accordingly if data filter callback provided
                            result = ajaxDataFilter(result, dataType, settings)
                            if (dataType == 'script')    (1,eval)(result)
                            else if (dataType == 'xml')  result = xhr.responseXML
                            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
                        } catch (e) { error = e }
                        
                        if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
                    }
                    
                    ajaxSuccess(result, xhr, settings, deferred)
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
                }
            }
        }
        
        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            ajaxError(null, 'abort', xhr, settings, deferred)
            return xhr
        }
        
        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)
        
        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]
        
        for (name in headers) nativeSetHeader.apply(xhr, headers[name])
        
        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
        }, settings.timeout)
        
        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }
    
    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        if ($.isFunction(data)) dataType = success, success = data, data = undefined
        if (!$.isFunction(success)) dataType = success, success = undefined
        return {
            url: url
            , data: data
            , success: success
            , dataType: dataType
        }
    }
    
    $.get = function(/* url, data, success, dataType */){
        return $.ajax(parseArguments.apply(null, arguments))
    }
    
    $.post = function(/* url, data, success, dataType */){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }
    
    $.getJSON = function(/* url, data, success */){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
    }
    
    $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector)
                : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }
    
    var escape = encodeURIComponent
    
    function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
            type = $.type(value)
            if (scope) key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value)
            // recurse into nested objects
            else if (type == "array" || (!traditional && type == "object"))
                serialize(params, value, traditional, key)
            else params.add(key, value)
        })
    }
    
    $.param = function(obj, traditional){
        var params = []
        params.add = function(key, value) {
            if ($.isFunction(value)) value = value()
            if (value == null) value = ""
            this.push(escape(key) + '=' + escape(value))
        }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    }
})(Zepto)

;(function($){
    $.fn.serializeArray = function() {
        var name, type, result = [],
            add = function(value) {
                if (value.forEach) return value.forEach(add)
                result.push({ name: name, value: value })
            }
        if (this[0]) $.each(this[0].elements, function(_, field){
            type = field.type, name = field.name
            if (name && field.nodeName.toLowerCase() != 'fieldset' &&
                !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
                ((type != 'radio' && type != 'checkbox') || field.checked))
                add($(field).val())
        })
        return result
    }
    
    $.fn.serialize = function(){
        var result = []
        this.serializeArray().forEach(function(elm){
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
    }
    
    $.fn.submit = function(callback) {
        if (0 in arguments) this.bind('submit', callback)
        else if (this.length) {
            var event = $.Event('submit')
            this.eq(0).trigger(event)
            if (!event.isDefaultPrevented()) this.get(0).submit()
        }
        return this
    }
    
})(Zepto)

;(function(){
    // getComputedStyle shouldn't freak out when called
    // without a valid element as argument
    try {
        getComputedStyle(undefined)
    } catch(e) {
        var nativeGetComputedStyle = getComputedStyle
        window.getComputedStyle = function(element, pseudoElement){
            try {
                return nativeGetComputedStyle(element, pseudoElement)
            } catch(e) {
                return null
            }
        }
    }
})()
//   return Zepto
// }))

module.exports = Zepto;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/lib/zepto.js","/lib")
},{"At5rgb":4,"buffer":1}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by cindy.wy on 17/3/4.
 *
 * 页面跳转相关工具方法
 */
var util = require('./util');
var os = require('./os');
var Log = require('../amap/log');
var native = require('../amap/native');
var link = require('../config/config.url');  
var act = require('../config/config.act');

var locat = {
    /**
     *模拟a标签跳转
     *@param {string} url 要跳转的url
     *@param {Boolean} isReplace 是否替换当前页
     */
    locationRedirect: function(url,isReplace) {
        if (isReplace) {
            this.locationReplace(url);
        }
        if (os.ios) {
            var $lr = $("#locationRedirect"),
                ev = document.createEvent('HTMLEvents');
            ev.initEvent('click', false, true);
            if ($lr.length) {
                $lr.attr("href", url);
            } else {
                $lr = $('<a id="locationRedirect" href="' + url + '" style="display:none;"></a>');
                $(document.body).append($lr);
            }
            $lr[0].dispatchEvent(ev);
        } else {
            window.location.href = url;
        }
    },
    /**
     * 修复iOS 9.0和9.1 下 replace后 再次跳转页面后调用back会回到前2个页面.
     * @param {String} url replace 的url
     */
    locationReplace: function(url) {
        if (os.ios && /^9\.[01]/.test(os.version)) {
            history.replaceState({}, null, url);
            location.reload();
        } else {
            location.replace(url);
        }
    },
    /**
     *  跳转页面（从历史记录）
     *  @param {string} url 要跳转的url
     *  @param {Boolean} isReplace 是否替换当前页
     */
    locationRedirectForHistory: function(url, isReplace) {
        var _this = this; 
        if (!os.ios) _this.setlocationHistory();
        var locationHistory = _this.locationHistory;  
        var step = 0;
        var redirectName = url.match(/([\w\-]+)\.html(?:\?|\#|$)/);
        if (!redirectName || redirectName[1] == locationHistory[locationHistory.length - 1]) {
            if (isReplace) {
                _this.locationReplace(url);
            }
            return false;
        }
        redirectName = redirectName[1];
        for (var len = locationHistory.length, i = len - 2; i >= -1; i--) {
            step++;
            if (locationHistory[i] && redirectName == locationHistory[i].page) {
                locationHistory.length = i + 1;
                sessionStorage.setItem(_this.StorageName, JSON.stringify(locationHistory));
                break;
            }
        }
        if (step < len) {
            history.go(-step);
        } else {
            if (isReplace) {
                var page = (location.pathname.match(/([^\/]+).html/)|| location.pathname.match(/([^\/]+).htm/) || ['','index'])[1];
                if(!(page=='index'&&location.hash&&location.hash!='#/')){
                    locationHistory.length -= 1;
                    sessionStorage.setItem(_this.StorageName, JSON.stringify(locationHistory));
                }
                /*locationHistory.length -= 1;
                sessionStorage.setItem(_this.StorageName, JSON.stringify(locationHistory));*/
                _this.locationReplace(url);
            } else {
                _this.locationRedirect(url);
            }
        }
    },
    setlocationHistory: function() {
        var _this = this;
        var pageName = (_this.pathname.match(/\/([\w\-]+)\.html/) || _this.pathname.match(/\/([\w\-]+)\.htm/)) [1];
        var locationHistory = _this.locationHistory;
        for (var len = locationHistory.length, i = len - 1; i >= 0; i--) {
            if (pageName == locationHistory[i].page) {
                locationHistory.length = i;
                break;
            }
        }
        for (var len = locationHistory.length, i = 0; i < len; i++) {
            locationHistory[i].isUpdate = true;
        }
        locationHistory.push({
            page: pageName,
            isUpdate: false
        });
        sessionStorage.setItem(_this.StorageName, JSON.stringify(locationHistory));
    },
    locationHistoryInit: function() {
        //获取本地存储
        var _this = this;
        var pathname = location.pathname;
        pathname.search(/[\w\-]+\.html/) < 0 && (pathname += 'index.html');
        _this.pathname = pathname;
        _this.StorageName = pathname.replace(/(page\/|\/)[\w\-]+\.html/, '').replace(/(^\/|\/$)/g, '').replace(/\//g, '_');
        !_this.StorageName && (_this.StorageName = 'session_history');
        if (!sessionStorage.getItem(_this.StorageName)) {
            sessionStorage.setItem(_this.StorageName, JSON.stringify([]));
        }
        _this.locationHistory = JSON.parse(sessionStorage.getItem(_this.StorageName));
        _this.setlocationHistory();
        if (os.ios) {
            function checkReplace() {
                var pageName = (_this.pathname.match(/\/([\w\-]+)\.html/) || _this.pathname.match(/\/([\w\-]+)\.htm/)) [1];
                _this.locationHistory = JSON.parse(sessionStorage.getItem(_this.StorageName));
                var currentHistory = null;
                for (var len = _this.locationHistory.length, i = len - 1; i >= 0; i--) {
                    if (pageName == _this.locationHistory[i].page) {
                        currentHistory = _this.locationHistory[i];
                        if (currentHistory && currentHistory.isUpdate) {
                            if(AmapApp.util.v_router&&AmapApp.util.v_router.currentRoute.name!='home'){
                                AmapApp.util.v_router.back();
                            }
                            AmapApp.Log.log('pv');
                            $(window).trigger("updateData");
                        }
                        _this.locationHistory.length = i;
                        _this.locationHistory.push({
                            page: pageName,
                            isUpdate: false
                        });
                        sessionStorage.setItem(_this.StorageName, JSON.stringify(_this.locationHistory));
                        break;
                    }
                }
                requestAnimationFrame(checkReplace);
            }
            requestAnimationFrame(checkReplace);
        }
    },
    /**
     *  跳转页面
     *  @param {string} url 要跳转的url
     *  @param {Boolean} isReplace 是否替换当前页
     */
    pageJump:function(url, isReplace){
        if(url.indexOf('//')!=-1){//绝对路径&非项目内地址不计入历史记录
            locat.locationRedirect(url, isReplace);   
        }else{
            locat.locationRedirectForHistory(url, isReplace); 
        }
    },
    /**
     * [pageErr 接口错误跳error页面]
     * @param  {String} url  [aos url地址||actionname]
     * @param  {[type]} code [aos code||action出错则不传code]
     * @param  {boolean} onlytip 是否仅弹窗提示不跳转[默认false]
     */
    pageError: function(url, code, onlytip) {
        if(url.indexOf('/')!=-1){
            var inter = url.match(/[^\/]+\/[^\/]+$/); 
            inter = 'aos_'+(inter[0] ? inter[0].replace('/', '') : '');
        }else{
            var inter = 'action_'+url;
            code = 999;
        }   
        if(onlytip){
            locat.errorAlert(inter, code);
        }else{
            locat.interError(inter, code);
        } 
    },
    interError: function(inter,code, onlytip) {
        if(onlytip){
            this.errorAlert(code, inter);
        }else{
            var currentUrl = location.href;
            var gd_from = currentUrl.match(/[^\/]+$/) || [''];
            gd_from = gd_from[0].split('.')[0]; //获取页面名称 拼在error.html上
            var url = 'error.html?code=' + code + '&inter=' + encodeURIComponent(inter || '');

            url += '&gd_from=' + gd_from;
            this.pageJump(url,true);
        } 
    },
    errorAlert: function(inter, code) {
        require('../lib/msgbox');
        var _this = this;
        if (code < 0) {
            var content = '网络无法连接，刷新一下';  
        } else {
            var content = '剁手的人太多了，刷新试试';   
        }
        // var isReplace = (location.href.indexOf('index.html') != -1)?true:false;
        $.MsgBox({
            content: content, 
            shareLabel: '刷新',
            shareFn: function() { 
                // _this.locationRedirectForHistory('./index.html?gd_from=aoserror',isReplace); 
                location.reload();
            }
        });
        Log.log('aoserror', {
            type: inter + '_' + code
        });
    },
    /**
     * 去置入客户端的‘我的奖品’页面 
     * @param activity 活动标识
     * @param isdetail 是否去详情页，默认false去列表页
     * @param awardid 奖品id
     * @param coupon 券码 
     * @param recordid 用户获奖id
     1. 当去列表页：所有参数不传，如果传activity则仅展示该活动标识下的奖品；
     2. 当去奖品详情页：activity、isdetail、awardid必传，否则去列表。 
                  如果传recordid则展现用户在此奖品下的获奖信息(如收货地址、券码等)  
     */
    goAward: function(activity, isdetail, awardid, coupon,recordid){
        var url = link.awardlist+'?gd_from='+act.logname;
        coupon = coupon||"";
        if(isdetail&&activity&&awardid){//详情页
            if(recordid){
                url += '&act='+activity+'&aid=' + awardid + '&rid=' + recordid + '#&detail-normal'
            }else if(coupon){
                url += '&act='+activity+'&aid=' + awardid + '&coupon=' + coupon + '#&detail-normal'
            }
        }else{
            if(activity){
                url += '&act='+activity;
            }
        } 
        native.loadSchema(util.getSchema(url, false, true))
    },
    /**
     * 去通用的‘编辑地址’页面  
     * @param actname 活动标识 
     */
    goAddr: function(actname){
        if(!actname)return;
        var url = link.editaddr+'?gd_from='+act.logname+'&activity='+actname;
        native.loadSchema(util.getSchema(url, false, false))
    },
    /*
    * 带起终点的路线规划
    * @param type  t = 0 (驾车) t = 1(公交) t = 2(步行) t = 3(骑行 788版本) t = 4(火车 804版本)
    * AmapApp.util.routePlan(3,{},
    *   {
    *       poiid:'qwqqwdqe',
    *       name:'名称',
    *       x:'1224',
    *       y:2112
    *   }
    * )
    */
    routePlan:function(type,startPoi,endPoi){
        type = type?type:0;
        var schema = "amapuri://route/plan?t="+type;
        if(startPoi&&startPoi.name&&(startPoi.poiid||startPoi.x&&startPoi.y)){
            schema+= "&sid="+startPoi.poiid+"&slat="+startPoi.y+"&slon="+startPoi.x+"&sname="+encodeURIComponent(startPoi.name);
        }
        if(endPoi&&endPoi.name&&(endPoi.poiid||endPoi.x&&endPoi.y)){
            if(endPoi.poiid){
                schema += "&did="+endPoi.poiid;
            }else{
                schema += "&dlat="+endPoi.y+"&dlon="+endPoi.x;
            }
            schema += "&dname="+encodeURIComponent(endPoi.name);
        }
         // schema = 'amapuri://route/plan?t=3&did=B0FFG734TD&dname=%E9%A6%96%E5%BC%80%E5%B9%BF%E5%9C%BA';
        console.log(schema)

        native.loadSchema(schema);
    }
};
locat.locationHistoryInit();  
module.exports = {
    pageJump: locat.pageJump.bind(locat),
    pageError: locat.pageError.bind(locat),
    goAward: locat.goAward.bind(locat), 
    goAddr: locat.goAddr.bind(locat),
    routePlan:locat.routePlan.bind(locat)
};
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/locat.js","/util")
},{"../amap/log":8,"../amap/native":9,"../config/config.act":11,"../config/config.url":12,"../lib/msgbox":14,"./os":19,"./util":20,"At5rgb":4,"buffer":1}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by kongxiaojian on 2017/3/21.
 */
require('../lib/msgbox');
var native = require('../amap/native');
var loader = require('../amap/loader');
var os = require('./os');
var Log = require('../amap/log');
var activity = require('../config/config.act').activity;
var needBind = {
    tid:null,
    init:function (callback) {
        if(!this.tid){
            this.getTid(callback);
        }else{
            this.login(callback);
        }
    },
    getTid:function (callback) {
        var _this =this;
        native.getAppInfo(function (data) {
            if(data.tid){
                _this.tid = data.tid;
                _this.login(callback);
            } else {
                AmapApp.util.pageError(data.code, 'getExtraUrl');
            }
        });
    },
    login:function (callback,relogin) {
        var _this = this;
        var params = [
            {tid:_this.tid,sign:1},
            {force: 0, sign: 1},
            {activity:activity},
        ];
        native.getUserId(function (data) {
            if(data.userid){
                loader.get(AmapApp.AOSURL.game_bind, params, function (res) {
                    console.log('game_bind',res);
                    if(res.code==1){
                        if(callback)callback(true);//不需要绑定
                    } else if(res.code==2){//需要强制绑定
                        _this.needbind(callback);
                    }else{
                        AmapApp.util.pageError(AmapApp.AOSURL.game_bind, res.code);
                    }
                });
            }else{
                if(callback)callback(false);//没登录
            }
        },false,relogin||false);
    },
    needbind:function (callback) {
        var _this = this;
        var params = [
            {tid:_this.tid,sign:1},
            {force: 1, sign: 1},
            {activity:activity},
        ];
        $.MsgBox({
            content: '检测到您登录的账号已有游戏数据，是否同步？',
            okLabel: '同步',
            cancelLabel: '切换账号',
            cancelFn: function () {
                //切换账号点击回调
                $.MsgBox({
                    content: '将会为你退出当前账号登录，<br/>换一个别的账号再来吧',
                    okLabel: '好的',
                    cancelLabel: '取消',
                    okFn: function() { //强制同步
                        Log.log('reloginok');
                        _this.login(callback,true);
                    },
                    cancelFn: function() { //点击取消，再展示该弹框
                        Log.log('relogincancle');
                        _this.needbind(callback);
                    }
                });
            },
            okFn: function () {
                //同步点击回调
                $.MsgBox({
                    content: '继续同步将擦除当前设备的数据，恢复账号的游戏进度，是否继续？',
                    okLabel: '确认',
                    cancelLabel: '取消',
                    okFn: function() { //强制同步
                        Log.log('bindok');
                        loader.get(AmapApp.AOSURL.game_bind, params, function (res) {
                            console.log('game_bind',res);
                            if(res.code==1){
                                if(callback)callback(true);
                            }else{
                                AmapApp.util.pageError(AmapApp.AOSURL.game_bind, res.code);
                            }
                        });
                    },
                    cancelFn: function() { //点击取消，再展示该弹框
                        Log.log('bindcancle');
                        _this.needbind(callback);
                    }
                });
            }

        });
    }
};
module.exports= {
    login:needBind.init.bind(needBind)
};
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/needBind.js","/util")
},{"../amap/loader":7,"../amap/log":8,"../amap/native":9,"../config/config.act":11,"../lib/msgbox":14,"./os":19,"At5rgb":4,"buffer":1}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by maple on 17/3/12.
 */

var os = require('./os');
var webview = require('./webview_info');
var native = require('../amap/native');
var Log = require('../amap/log');

var openAmap = {

    /**
     * 生成schema
     * @param url {string} 需要在amap里打开的url\schema
     * @param noCommon {Boolean} 是否针对安卓ios使用不同协议iosamap、androidamap，默认false使用通用协议amapuri
     * @param hideTitleBar {Boolean} 是否隐藏titlebar，默认false不隐藏
     * @returns {string}
     */
    getSchema: function(url, noCommon, hideTitleBar) {
        noCommon = noCommon?true:false;
        var type = 'amapuri';
        // 检查是否schema
        var isSchema = /^(?:(?:ios|android)amap|amapuri):\/\//i.test(url);
        if (isSchema) {
            return /^(?:(?:ios|android)amap|amapuri)(:\/\/.*)$/i.exec(url)[0];
        }
        if(noCommon){
            var _os = os.ios ? 'ios' : 'android';
            type = _os + 'amap';
        }
        return type+'://openFeature?featureName=OpenURL&sa=1&sourceApplication=banner' +
            '&url=' + encodeURIComponent(url) +'&urlType=0&contentType=autonavi' + (hideTitleBar ? '&hide_title=1' : '');
    },
    /**
     * 生成通用呼起页面的地址
     * @param url {string} 需要在amap里打开的url\schema
     * @param noCommon {Boolean} 是否针对安卓ios使用不同协议iosamap、androidamap，默认false使用通用协议amapuri
     * @param hideTitleBar {Boolean} 是否隐藏titlebar，默认false不隐藏
     * @returns {string} 通用呼起页面的地址
     */
    getCallNative: function(url, noCommon, hideTitleBar) {
        noCommon = noCommon?true:false;
        var _url = '';
        // var _callUrl = 'http://wap.amap.com/callnative/?';
        var _callUrl = 'http://m.autonavi.com/callnative/?';
        _url = _callUrl +
            'schema=' + encodeURIComponent(this.getSchema(url,noCommon,hideTitleBar)) +
                '&title=高德地图'; 
        return _url;
    },
    /**
     * 呼起高德地图并在端内打开指定页面且需要一键呼起
     * @param {Object} dom 呼起按钮（呼起按钮（$dom对象，如 $('.openbtn')，必须为a标签，且只能呼起release版高德地图）
     * @param {String} url 要打开页面的url\schema 
     * @param {String} clicklog 该埋点的click值
     * @param hideTitleBar {Boolean} 是否隐藏titlebar，默认false不隐藏
     * @param type {String}  [非必传]渠道号:为满足wap站分渠道检测数据需求
     */
    openApp: function (dom, url, clicklog, hideTitleBar, type) { 
        if(!clicklog)clicklog="goamap";

        if(webview.isInAmap()){//在端内
            dom.on('click', function () {
                Log.logJump(function(){
                    if(!os.ios)native.destroyRightButton();//清除右上角btn
                    location.href = url;
                },clicklog);
            });  
        }else{
            var _scheme = this.getCallNative(url, true ,hideTitleBar); 
            if(type){
               _scheme += ('&type='+ type);
            }
            var $element = $('<a id="amapOpenApp" href="'+_scheme+'" style="display:none;"/>');
            $('body').append($element); 
            dom.on('click', function () {
                Log.logJump(function(){
                    $('#amapOpenApp').trigger('click');
                },clicklog);
            });     
        } 
    }
};

module.exports = openAmap;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/openAmap.js","/util")
},{"../amap/log":8,"../amap/native":9,"./os":19,"./webview_info":21,"At5rgb":4,"buffer":1}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/1/24.
 * 判断设备信息
 */


var os = {};
var util = require('./util');
// The <html> element.
var documentElement = window.document.documentElement;

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
var userAgent = window.navigator.userAgent.toLowerCase().split('amap/')[0];

// Simple UA string search
var find = function (needle) {
    return userAgent.indexOf(needle) !== -1;
};

// windows下浏览器
os.windows = find('windows');
os.iphone = !os.windows && find('iphone');
os.ipod = find('ipod');
os.ipad = find('ipad');
os.ios = os.iphone || os.ipod || os.ipad;
os.android = !os.windows && find('android');
os.androidPhone = os.android && find('mobile');
// 安卓平板
os.androidTablet = os.android && !find('mobile');


// Insert the appropriate CSS class based on the _user_agent.
if (os.ios) {
    if (os.ipad) {
        util.addClass(documentElement, "ios ipad tablet");
    } else if (os.iphone) {
        util.addClass(documentElement, "ios iphone mobile");
    } else if (os.ipod) {
        util.addClass(documentElement, "ios ipod mobile");
    } 
    var v = userAgent.match(/(iphone|ipad|ipod).*?os\s([\d_]+)\s/i);
    os.version = v[2];
} else if (os.android) {
    if (os.androidTablet) {
        util.addClass(documentElement, "android tablet");
    } else {
        util.addClass(documentElement, "android mobile");
    }
    os.version = userAgent.substr(userAgent.indexOf('android') + 8, 3);
}


module.exports = os;

}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/os.js","/util")
},{"./util":20,"At5rgb":4,"buffer":1}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/1/25.
 */ 

var util = {
    /**
     * 获取url参数.
     * @param {String} [name] 参数名称，无此参数时返回所有参数
     * @return {String|Object} name存在时返回相应的值，否则返回所有参数
     */
    getUrlParam: function(name) {
        var url = window.location.search.substr(1);
        if (!url) {
            return '';
        }
        if (name) {
            var value = new RegExp('(?:^|&)' + name + '=([^&]*)(&|$)', 'g').exec(url);
            return util.htmlEncodeAll(value && window.decodeURIComponent(value[1]) || '');
        }
        var result = {};
        var reg = /(?:^|&)([^&=]+)=([^&]*)(?=(&|$))/g;
        var item;
        /* jshint boss: true */
        while (item = reg.exec(url)) {
            result[item[1]] = util.htmlEncodeAll(window.decodeURIComponent(item[2]));
        }
        return result;
    },
    /**
     * 过滤html中的特殊符号
     * @param  {String} [e] 待过滤的html
     * @return {String}  返回过滤后的html
     */
    htmlEncodeAll: function(e) {
        return null == e ? "" : e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "'");
    },
    /**
     * 添加script.
     * @param {String} url js url
     * @param {Function} [onload] 加载成功回调
     * @param {Function} [onerror] 加载失败回调
     * @return {HTMLElement} script引用
     */
    addScript: function(url, onload, onerror) {
        var script = document.createElement('script');
        if (onload) {
            script.onload = function() {
                onload(script);
            };
        }
        script.onerror = function() {
            if(onerror){
                onerror(script);
            }else if(onload){
                onload(script);
            }
        };
        script.src = url;
        document.head.appendChild(script);
        return script;
    },
    /**
     * 复制对象属性.
     * @param {Object} toObj 复制到此对象
     * @param {Object} fromObj 要复制的对象
     */
    extend: function(toObj, fromObj) {
        for (var key in fromObj) {
            if (fromObj[key] !== 'undefined') {
                toObj[key] = fromObj[key];
            }
        }
    },
    /**
     * 为url添加变量.
     * @param {String} url
     * @param {String|Object} name
     *    为字符串类型时参数作为新增参数的名称，第三个参数不能缺省
     *    为对象类型时参数为要增加的参数集合，属性为参数名称，值为参数值
     * @param {String} value 变量值
     * @return {String} 新的url
     */
    urlAddParam: function(url, name, value) {
        // 分割url，arr[1] 为头部，arr[2]为参数，arr[3]为hash
        var arr = url.match(/([^\?#]*\??)([^#]*)?(#.*)?/);
        var prefix = arr[1];
        var param = arr[2];

        if (param) {
            prefix += param + '&';
        } else if (arr[1].indexOf('?') === -1) {
            prefix += '?';
        }
        var newParam = '';
        if (typeof name === 'object') {
            for (var key in name) {
                newParam += '&' + key + '=' + encodeURIComponent(name[key]);
            }
            newParam = newParam.substr(1);
        } else {
            newParam = name + '=' + encodeURIComponent(value);
        }
        return prefix + newParam + (arr[3] || '');
    },
    // Check if documentElement already has a given class.
    hasClass: function(node, className) {
        var regex;
        regex = new RegExp(className, 'i');
        return node.className.match(regex);
    },

    // Add one or more CSS classes to the <html> element.
    addClass: function(node, className) {
        var currentClassNames = null;
        if (!this.hasClass(node, className)) {
            currentClassNames = node.className.replace(/^\s+|\s+$/g, '');
            node.className = currentClassNames + " " + className;
        }
    },

    // Remove single CSS class from the <html> element.
    removeClass: function(node, className) {
        if (this.hasClass(node, className)) {
            node.className = node.className.replace(" " + className, "");
        }
    }
};

module.exports = util;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/util.js","/util")
},{"At5rgb":4,"buffer":1}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by qingye on 17/1/24.
 */
 
var os = require('./os');
var util = require('./util');
var userAgent = window.navigator.userAgent.toLowerCase(); 
var ini = require('../config/_ini');

// 作为一个私有变量
var _isInAmap = false;
if(userAgent.indexOf('amap/')!=-1){
    _isInAmap = true;
}
userAgent = userAgent.split('amap/')[0]


var webviewInfo = { 
    /**
     * 强制设置是否端内webview
     * @param isInAmap
     */
    setIsInAmap: function (isInAmap) {
        _isInAmap = !!isInAmap;
    },
    
    /**
     * 判断使用是否在高德地图客户端内webview打开 
     */
    isInAmap: function () { 
        return _isInAmap;
    },
    /**
     * 判断是否在微博中.
     * @return {Boolean} 在微博客户端中返回true
     */
    isInWeibo: function () {
        return / Weibo /i.test(userAgent);
    },
    /**
     * 判断是否在微信中.
     * @return {Boolean} 在微信中返回true
     */
    isInWeixin: function () {
        return /MicroMessenger/i.test(userAgent);
    },
    
    /**
     * 是否公网
     * @return {Boolean}
     */
    isPublic: function () {
        // todo 判断方式十分粗糙
        return /^[a-z]+\.amap\.com$/.test(location.host) || !ini.debug;
    },
    /*h5实现titlebar
     *titletext  标题内容
     *basewidth  [默认750]  640设计稿请传640
     */
    setTitlebar: function(titletext, basewidth) {
        basewidth = basewidth ? basewidth : '750';
        var myscale = basewidth / 750;
        var bodytop = os.ios ? "1.25"*myscale : "0.9"*myscale;
        if($('#titlebar').length==0){
            titletext = titletext?titletext:'请设置标题~';
            var str = "<div id=\"titlebar\"><div id=\"titleback\" onclick=\"javascript:AmapApp.Native.webviewGoBack();\"></div><span>" + titletext + "</span></div>";
            $('body').prepend(str);
        }else{
            if(titletext){//已有titlebar时，如果传了标题只改标题
                $('#titlebar').find('span').html(titletext);
            }
        }
        $('body').css("padding-top", bodytop + "rem");
        if (myscale != 1) {
            $('#titlebar').css('transform', 'scale(' + myscale + ')');
        }
    },
    /*h5实现titlebar
     *titletext  标题内容
     *basewidth  [默认750]  640设计稿请传640
     */
    setTransparentTitlebar: function (titletext, basewidth) {
        $('body').css('background','#4382ef'); 
        basewidth = basewidth ? basewidth : '750';
        var myscale = basewidth / 750;
        var bodytop = os.ios ? "1.25" * myscale : "0.9" * myscale;
        var $titleBar = $('#titlebar');
        if($titleBar.length <= 0){
            titletext = titletext?titletext:'请设置标题~';
            var str = '<div id="titlebar" class="titlebarTransparent"><div id="titleback" class="titlebackTransparent" onclick="javascript:AmapApp.Native.webviewGoBack();" ></div><span>' + titletext + '</span></div>';
            $('body').prepend(str)
        }else{
            if(titletext){//已有titlebar时，如果传了标题只改标题
                $('#titlebar').find('span').html(titletext);
            }
        }        
        if (myscale != 1) {
            $('#titlebar').css('transform', 'scale(' + myscale + ')');
        } 
        window.onscroll = function(){
            if(document.body.scrollTop > 10){
                $('#titlebar').removeClass('titlebarTransparent');
                $('#titleback').removeClass('titlebackTransparent');
                $('body').css('background','#f0f0f0'); //底部元素颜色(解决ios原声拉动下的视觉体验)
            }else{
                $('#titlebar').addClass('titlebarTransparent');
                $('#titleback').addClass('titlebackTransparent'); 
                $('body').css('background','#4382ef');  //顶部元素颜色(解决ios原声拉动下的视觉体验)
            }
        }
    },
};

module.exports = webviewInfo;
}).call(this,require("At5rgb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/webview_info.js","/util")
},{"../config/_ini":10,"./os":19,"./util":20,"At5rgb":4,"buffer":1}]},{},[13])