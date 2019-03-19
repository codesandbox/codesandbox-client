# MessagePack specification

MessagePack is an object serialization specification like JSON.

MessagePack has two concepts: **type system** and **formats**.

Serialization is conversion from application objects into MessagePack formats via MessagePack type system.

Deserialization is conversion from MessagePack formats into application objects via MessagePack type system.

    Serialization:
        Application objects
        -->  MessagePack type system
        -->  MessagePack formats (byte array)

    Deserialization:
        MessagePack formats (byte array)
        -->  MessagePack type system
        -->  Application objects

This document describes the MessagePack type system, MesagePack formats and conversion of them.

## Table of contents

* MessagePack specification
  * [Type system](#types)
      * [Limitation](#types-limitation)
      * [Extension type](#types-extension-type)
  * [Formats](#formats)
      * [Overview](#formats-overview)
      * [Notation in diagrams](#formats-notation)
      * [nil format family](#formats-nil)
      * [bool format family](#formats-bool)
      * [int format family](#formats-int)
      * [float format family](#formats-float)
      * [str format family](#formats-str)
      * [bin format family](#formats-bin)
      * [array format family](#formats-array)
      * [map format family](#formats-map)
      * [ext format family](#formats-ext)
  * [Serialization: type to format conversion](#serialization)
  * [Deserialization: format to type conversion](#deserialization)
  * [Future discussion](#future)
    * [Profile](#future-profiles)
  * [Implementation guidelines](#impl)
    * [Upgrade MessagePack specification](#impl-upgrade)

<a name="types"/>
## Type system

* Types
  * **Integer** represents an integer
  * **Nil** represents nil
  * **Boolean** represents true or false
  * **Float** represents a floating point number
  * **Raw**
      * **String** extending Raw type represents a UTF-8 string
      * **Binary** extending Raw type represents a byte array
  * **Array** represents a sequence of objects
  * **Map** represents key-value pairs of objects
  * **Extended** implements Extension interface: represents a tuple of type information and a byte array where type information is an integer whose meaning is defined by applications
* Interfaces
  * **Extension** represents a tuple of an integer and a byte array where the integer represents type information and the byte array represents data. The format of the data is defined by concrete types

<a name="types-limitation"/>
### Limitation

* a value of an Integer object is limited from `-(2^63)` upto `(2^64)-1`
* a value of a Float object is IEEE 754 single or double precision floating-point number
* maximum length of a Binary object is `(2^32)-1`
* maximum byte size of a String object is `(2^32)-1`
* String objects may contain invalid byte sequence and the behavior of a deserializer depends on the actual implementation when it received invalid byte sequence
    * Deserializers should provide functionality to get the original byte array so that applications can decide how to handle the object
* maximum number of elements of an Array object is `(2^32)-1`
* maximum number of key-value associations of a Map object is `(2^32)-1`

<a name="types-extension-type"/>
### Extension type

MessagePack allows applications to define application-specific types using the Extended type.
Extended type consists of an integer and a byte array where the integer represents a kind of types and the byte array represents data.

Applications can assign `0` to `127` to store application-specific type information.

MessagePack reserves `-1` to `-128` for future extension to add predefined types which will be described in separated documents.

    [0, 127]: application-specific types
    [-1, -128]: reserved for predefined types


<a name="formats"/>
## Formats

<a name="formats-overview"/>
### Overview

<table>
  <tr><th>format name</th><th>first byte (in binary)</th><th>first byte (in hex)</th></th></tr>
  <tr><td>positive fixint</td><td>0xxxxxxx</td><td>0x00 - 0x7f</td></tr>
  <tr><td>fixmap</td><td>1000xxxx</td><td>0x80 - 0x8f</td></tr>
  <tr><td>fixarray</td><td>1001xxxx</td><td>0x90 - 0x9f</td></tr>
  <tr><td>fixstr</td><td>101xxxxx</td><td>0xa0 - 0xbf</td></tr>
  <tr><td>nil</td><td>11000000</td><td>0xc0</td></tr>
  <tr><td>(never used)</td><td>11000001</td><td>0xc1</td></tr>
  <tr><td>false</td><td>11000010</td><td>0xc2</td></tr>
  <tr><td>true</td><td>11000011</td><td>0xc3</td></tr>
  <tr><td>bin 8</td><td>11000100</td><td>0xc4</td></tr>
  <tr><td>bin 16</td><td>11000101</td><td>0xc5</td></tr>
  <tr><td>bin 32</td><td>11000110</td><td>0xc6</td></tr>
  <tr><td>ext 8</td><td>11000111</td><td>0xc7</td></tr>
  <tr><td>ext 16</td><td>11001000</td><td>0xc8</td></tr>
  <tr><td>ext 32</td><td>11001001</td><td>0xc9</td></tr>
  <tr><td>float 32</td><td>11001010</td><td>0xca</td></tr>
  <tr><td>float 64</td><td>11001011</td><td>0xcb</td></tr>
  <tr><td>uint 8</td><td>11001100</td><td>0xcc</td></tr>
  <tr><td>uint 16</td><td>11001101</td><td>0xcd</td></tr>
  <tr><td>uint 32</td><td>11001110</td><td>0xce</td></tr>
  <tr><td>uint 64</td><td>11001111</td><td>0xcf</td></tr>
  <tr><td>int 8</td><td>11010000</td><td>0xd0</td></tr>
  <tr><td>int 16</td><td>11010001</td><td>0xd1</td></tr>
  <tr><td>int 32</td><td>11010010</td><td>0xd2</td></tr>
  <tr><td>int 64</td><td>11010011</td><td>0xd3</td></tr>
  <tr><td>fixext 1</td><td>11010100</td><td>0xd4</td></tr>
  <tr><td>fixext 2</td><td>11010101</td><td>0xd5</td></tr>
  <tr><td>fixext 4</td><td>11010110</td><td>0xd6</td></tr>
  <tr><td>fixext 8</td><td>11010111</td><td>0xd7</td></tr>
  <tr><td>fixext 16</td><td>11011000</td><td>0xd8</td></tr>
  <tr><td>str 8</td><td>11011001</td><td>0xd9</td></tr>
  <tr><td>str 16</td><td>11011010</td><td>0xda</td></tr>
  <tr><td>str 32</td><td>11011011</td><td>0xdb</td></tr>
  <tr><td>array 16</td><td>11011100</td><td>0xdc</td></tr>
  <tr><td>array 32</td><td>11011101</td><td>0xdd</td></tr>
  <tr><td>map 16</td><td>11011110</td><td>0xde</td></tr>
  <tr><td>map 32</td><td>11011111</td><td>0xdf</td></tr>
  <tr><td>negative fixint</td><td>111xxxxx</td><td>0xe0 - 0xff</td></tr>
</table>


<a name="formats-notation"/>
### Notation in diagrams

    one byte:
    +--------+
    |        |
    +--------+
    
    a variable number of bytes:
    +========+
    |        |
    +========+
    
    variable number of objects stored in MessagePack format:
    +~~~~~~~~~~~~~~~~~+
    |                 |
    +~~~~~~~~~~~~~~~~~+
    
`X`, `Y`, `Z` and `A` are the symbols that will be replaced by an actual bit.

<a name="formats-nil"/>
### nil format

Nil format stores nil in 1 byte.

    nil:
    +--------+
    |  0xc0  |
    +--------+

<a name="formats-bool"/>
### bool format family

Bool format family stores false or true in 1 byte.

    false:
    +--------+
    |  0xc2  |
    +--------+
    
    true:
    +--------+
    |  0xc3  |
    +--------+

<a name="formats-int"/>
### int format family

Int format family stores an integer in 1, 2, 3, 5, or 9 bytes.

    positive fixnum stores 7-bit positive integer
    +--------+
    |0XXXXXXX|
    +--------+
    
    negative fixnum stores 5-bit negative integer
    +--------+
    |111YYYYY|
    +--------+
    
    * 0XXXXXXX is 8-bit unsigned integer
    * 111YYYYY is 8-bit signed integer

    uint 8 stores a 8-bit unsigned integer
    +--------+--------+
    |  0xcc  |ZZZZZZZZ|
    +--------+--------+
    
    uint 16 stores a 16-bit big-endian unsigned integer
    +--------+--------+--------+
    |  0xcd  |ZZZZZZZZ|ZZZZZZZZ|
    +--------+--------+--------+
    
    uint 32 stores a 32-bit big-endian unsigned integer
    +--------+--------+--------+--------+--------+
    |  0xce  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ
    +--------+--------+--------+--------+--------+
    
    uint 64 stores a 64-bit big-endian unsigned integer
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+
    |  0xcf  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+

    int 8 stores a 8-bit signed integer
    +--------+--------+
    |  0xd0  |ZZZZZZZZ|
    +--------+--------+
    
    int 16 stores a 16-bit big-endian signed integer
    +--------+--------+--------+
    |  0xd1  |ZZZZZZZZ|ZZZZZZZZ|
    +--------+--------+--------+
    
    int 32 stores a 32-bit big-endian signed integer
    +--------+--------+--------+--------+--------+
    |  0xd2  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|
    +--------+--------+--------+--------+--------+
    
    int 64 stores a 64-bit big-endian signed integer
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+
    |  0xd3  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+

<a name="formats-float"/>
### float format family

Float format family stores an floating point number in 5 bytes or 9 bytes.

    float 32 stores a floating point number in IEEE 754 single precision floating point number format:
    +--------+--------+--------+--------+--------+
    |  0xca  |XXXXXXXX|XXXXXXXX|XXXXXXXX|XXXXXXXX
    +--------+--------+--------+--------+--------+
    
    float 64 stores a floating point number in IEEE 754 double precision floating point number format:
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+
    |  0xcb  |YYYYYYYY|YYYYYYYY|YYYYYYYY|YYYYYYYY|YYYYYYYY|YYYYYYYY|YYYYYYYY|YYYYYYYY|
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+
    
    where
    * XXXXXXXX_XXXXXXXX_XXXXXXXX_XXXXXXXX is a big-endian IEEE 754 single precision floating point number
    * YYYYYYYY_YYYYYYYY_YYYYYYYY_YYYYYYYY_YYYYYYYY_YYYYYYYY_YYYYYYYY_YYYYYYYY is a big-endian
      IEEE 754 double precision floating point number


<a name="formats-str"/>
### str format family

Str format family stores an byte array in 1, 2, 3, or 5 bytes of extra bytes in addition to the size of the byte array.

    fixstr stores a byte array whose length is upto 31 bytes:
    +--------+========+
    |101XXXXX|  data  |
    +--------+========+
    
    str 8 stores a byte array whose length is upto (2^8)-1 bytes:
    +--------+--------+========+
    |  0xd9  |YYYYYYYY|  data  |
    +--------+--------+========+
    
    str 16 stores a byte array whose length is upto (2^16)-1 bytes:
    +--------+--------+--------+========+
    |  0xda  |ZZZZZZZZ|ZZZZZZZZ|  data  |
    +--------+--------+--------+========+
    
    str 32 stores a byte array whose length is upto (2^32)-1 bytes:
    +--------+--------+--------+--------+--------+========+
    |  0xdb  |AAAAAAAA|AAAAAAAA|AAAAAAAA|AAAAAAAA|  data  |
    +--------+--------+--------+--------+--------+========+

    where
    * XXXXX is a 5-bit unsigned integer which represents N
    * YYYYYYYY is a 8-bit unsigned integer which represents N
    * ZZZZZZZZ_ZZZZZZZZ is a 16-bit big-endian unsigned integer which represents N
    * AAAAAAAA_AAAAAAAA_AAAAAAAA_AAAAAAAA is a 32-bit big-endian unsigned integer which represents N
    * N is the length of data

<a name="formats-bin"/>
### bin format family

Bin format family stores an byte array in 2, 3, or 5 bytes of extra bytes in addition to the size of the byte array.

    bin 8 stores a byte array whose length is upto (2^8)-1 bytes:
    +--------+--------+========+
    |  0xc4  |XXXXXXXX|  data  |
    +--------+--------+========+
    
    bin 16 stores a byte array whose length is upto (2^16)-1 bytes:
    +--------+--------+--------+========+
    |  0xc5  |YYYYYYYY|YYYYYYYY|  data  |
    +--------+--------+--------+========+
    
    bin 32 stores a byte array whose length is upto (2^32)-1 bytes:
    +--------+--------+--------+--------+--------+========+
    |  0xc6  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|  data  |
    +--------+--------+--------+--------+--------+========+

    where
    * XXXXXXXX is a 8-bit unsigned integer which represents N
    * YYYYYYYY_YYYYYYYY is a 16-bit big-endian unsigned integer which represents N
    * ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ is a 32-bit big-endian unsigned integer which represents N
    * N is the length of data

<a name="formats-array"/>
### array format family

Array format family stores a sequence of elements in 1, 3, or 5 bytes of extra bytes in addition to the elements.

    fixarray stores an array whose length is upto 15 elements:
    +--------+~~~~~~~~~~~~~~~~~+
    |1001XXXX|    N objects    |
    +--------+~~~~~~~~~~~~~~~~~+
    
    array 16 stores an array whose length is upto (2^16)-1 elements:
    +--------+--------+--------+~~~~~~~~~~~~~~~~~+
    |  0xdc  |YYYYYYYY|YYYYYYYY|    N objects    |
    +--------+--------+--------+~~~~~~~~~~~~~~~~~+
    
    array 32 stores an array whose length is upto (2^32)-1 elements:
    +--------+--------+--------+--------+--------+~~~~~~~~~~~~~~~~~+
    |  0xdd  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|    N objects    |
    +--------+--------+--------+--------+--------+~~~~~~~~~~~~~~~~~+
    
    where
    * XXXX is a 4-bit unsigned integer which represents N
    * YYYYYYYY_YYYYYYYY is a 16-bit big-endian unsigned integer which represents N
    * ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ is a 32-bit big-endian unsigned integer which represents N
        N is the size of a array

<a name="formats-map"/>
### map format family

Map format family stores a sequence of key-value pairs in 1, 3, or 5 bytes of extra bytes in addition to the key-value pairs.

    fixmap stores a map whose length is upto 15 elements
    +--------+~~~~~~~~~~~~~~~~~+
    |1000XXXX|   N*2 objects   |
    +--------+~~~~~~~~~~~~~~~~~+
    
    map 16 stores a map whose length is upto (2^16)-1 elements
    +--------+--------+--------+~~~~~~~~~~~~~~~~~+
    |  0xde  |YYYYYYYY|YYYYYYYY|   N*2 objects   |
    +--------+--------+--------+~~~~~~~~~~~~~~~~~+
    
    map 32 stores a map whose length is upto (2^32)-1 elements
    +--------+--------+--------+--------+--------+~~~~~~~~~~~~~~~~~+
    |  0xdf  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|   N*2 objects   |
    +--------+--------+--------+--------+--------+~~~~~~~~~~~~~~~~~+
    
    where
    * XXXX is a 4-bit unsigned integer which represents N
    * YYYYYYYY_YYYYYYYY is a 16-bit big-endian unsigned integer which represents N
    * ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ is a 32-bit big-endian unsigned integer which represents N
    * N is the size of a map
    * odd elements in objects are keys of a map
    * the next element of a key is its associated value

<a name="formats-ext"/>
### ext format family

Ext format family stores a tuple of an integer and a byte array.

    fixext 1 stores an integer and a byte array whose length is 1 byte
    +--------+--------+--------+
    |  0xd4  |  type  |  data  |
    +--------+--------+--------+
    
    fixext 2 stores an integer and a byte array whose length is 2 bytes
    +--------+--------+--------+--------+
    |  0xd5  |  type  |       data      |
    +--------+--------+--------+--------+
    
    fixext 4 stores an integer and a byte array whose length is 4 bytes
    +--------+--------+--------+--------+--------+--------+
    |  0xd6  |  type  |                data               |
    +--------+--------+--------+--------+--------+--------+
    
    fixext 8 stores an integer and a byte array whose length is 8 bytes
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
    |  0xd7  |  type  |                                  data                                 |
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
    
    fixext 16 stores an integer and a byte array whose length is 16 bytes
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
    |  0xd8  |  type  |                                  data                                  
    +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
    +--------+--------+--------+--------+--------+--------+--------+--------+
                                  data (cont.)                              |
    +--------+--------+--------+--------+--------+--------+--------+--------+

    ext 8 stores an integer and a byte array whose length is upto (2^8)-1 bytes:
    +--------+--------+--------+========+
    |  0xc7  |XXXXXXXX|  type  |  data  |
    +--------+--------+--------+========+
    
    ext 16 stores an integer and a byte array whose length is upto (2^16)-1 bytes:
    +--------+--------+--------+--------+========+
    |  0xc8  |YYYYYYYY|YYYYYYYY|  type  |  data  |
    +--------+--------+--------+--------+========+
    
    ext 32 stores an integer and a byte array whose length is upto (2^32)-1 bytes:
    +--------+--------+--------+--------+--------+--------+========+
    |  0xc9  |ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|ZZZZZZZZ|  type  |  data  |
    +--------+--------+--------+--------+--------+--------+========+

    where
    * XXXXXXXX is a 8-bit unsigned integer which represents N
    * YYYYYYYY_YYYYYYYY is a 16-bit big-endian unsigned integer which represents N
    * ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ_ZZZZZZZZ is a big-endian 32-bit unsigned integer which represents N
    * N is a length of data
    * type is a signed 8-bit signed integer
    * type < 0 is reserved for future extension including 2-byte type information


<a name="serialization"/>
## Serialization: type to format conversion

MessagePack serializers convert MessagePack types into formats as following:

<table>
  <tr><th>source types</th><th>output format</th></tr>
  <tr><td>Integer</td><td>int format family (positive fixint, negative fixint, int 8/16/32/64 or uint 8/16/32/64)</td></tr>
  <tr><td>Nil</td><td>nil</td></tr>
  <tr><td>Boolean</td><td>bool format family (false or true)</td></tr>
  <tr><td>Float</td><td>float format family (float 32/64)</td></tr>
  <tr><td>String</td><td>str format family (fixstr or str 8/16/32)</td></tr>
  <tr><td>Binary</td><td>bin format family (bin 8/16/32)</td></tr>
  <tr><td>Array</td><td>array format family (fixarray or array 16/32)</td></tr>
  <tr><td>Map</td><td>map format family (fixmap or map 16/32)</td></tr>
  <tr><td>Extended</td><td>ext format family (fixext or ext 8/16/32)</td></tr>
</table>

If an object can be represented in multiple possible output formats, serializers SHOULD use the format which represents the data in the smallest number of bytes.


<a name="deserialization"/>
## Deserialization: format to type conversion

MessagePack deserializers convert convert MessagePack formats into types as following:

<table>
  <tr><th>source formats</th><th>output type</th></tr>
  <tr><td>positive fixint, negative fixint, int 8/16/32/64 and uint 8/16/32/64</td><td>Integer</td></tr>
  <tr><td>nil</td><td>Nil</td></tr>
  <tr><td>false and true</td><td>Boolean</td></tr>
  <tr><td>float 32/64</td><td>Float</td></tr>
  <tr><td>fixstr and str 8/16/32</td><td>String</td></tr>
  <tr><td>bin 8/16/32</td><td>Binary</td></tr>
  <tr><td>fixarray and array 16/32</td><td>Array</td></tr>
  <tr><td>fixmap map 16/32</td><td>Map</td></tr>
  <tr><td>fixext and ext 8/16/32</td><td>Extended</td></tr>
</table>

<a name="future"/>
## Future discussion

<a name="future-profiles"/>
### Profile

Profile is an idea that Applications restrict the semantics of MessagePack while sharing the same syntax to adapt MessagePack for certain use cases.

For example, applications may remove Binary type, restrict keys of map objects to be String type, and put some restrictions to make the semantics compatible with JSON. Applications which use schema may remove String and Binary types and deal with byte arrays as Raw type. Applications which use hash (digest) of serialized data may sort keys of maps to make the serialized data deterministic.

<a name="impl"/>
## implementation guidelines

<a name="impl-upgrade"/>
### Upgrading MessagePack specification

MessagePack specification is changed at this time.
Here is a guideline to upgrade existent MessagePack implementations:

* In a minor release, deserializers support the bin format family and str 8 format. The type of deserialized objects should be same with raw 16 (== str 16) or raw 32 (== str 32)
* In a major release, serializers distinguish Binary type and String type using bin format family and str format family
  * At the same time, serializers should offer "compatibility mode" which doesn't use bin format family and str 8 format


___

    MessagePack specification
    Last modified at 2013-04-21 21:52:33 -0700
    Sadayuki Furuhashi © 2013-04-21 21:52:33 -0700
