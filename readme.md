QTree
=====

A QuadTree that lets you store your points wherever you want.

Quick Start:
-----------

```
#install qtree from github
npm install JAForbes/qtree
```


Object Oriented Usage:

```js
var QTree = require("qtree")

var top, right, bottom, left ;
var bounds = [top = 0, right = 10, bottom = 10, left = 0]

var qtree = QTree.create(bounds)
var point = { x:0, y:0 }

qtree.add(point)

qtree.points.length //=> 1

qtree.query(bounds) //=> [{x:0, y:0}]

qtree.remove( point )

qtree.query(bounds) //=> []
```

Static Usage:

```js
var QTree = require("qtree")

var top, right, bottom, left;
var bounds = [top = 0, right = 10, bottom = 10, left = 0]

var qtree = QTree.qtree(bounds)

var points = { point_1: {x:0, y:0 } }

QTree.add(qtree, points, "point_1")

QTree.query(qtree, points, bounds) //=> ["point_1"]

QTree.remove(qtree, points, "point_1")

QTree.query(qtree, points, bounds).length //=> 0
```

Differences from other QuadTree libraries:
------------------------------------------

There are a lot of Javascript QuadTrees out there.
Here is a short list of why I wrote this library, and why it might be helpful to you.

####Static API allows you to store points elsewhere in your application.

This is very useful if you have already built a working app
and you do not want to change your data structure because some
quadtree implementation library tells you to.

####Static API only stores keys/indexes.  So it is trivial to serialise.

```js
var json = JSON.stringify(qtree)
var qtree = JSON.parse(qtree)
```

####Tests, tests, and more tests.

Verify this library does what it claims to do by just running `mocha` in your terminal.

###No dependencies (other than babel-runtime)

The source (in `/lib` ) is dependency free in an ES6 environment.

####ES6 Iterators!

You can iterate over the entire tree with a simple for loop thanks to ES6 Iterators

```js
for( var subtree of qtree) {
	//do stuff
}
```

####Open Architecture.  (Because, you know what you are doing.)

There are no closure vars used in this library.  Everything is public.
Internal properties are prefixed with an `_` to indicate you probably shouldn't touch them.
But if you _need_ to, you can!


####Documentation

Actual documentation.  That documents things.

####No weird, horrible, unnecessary build tools like grunt, and gulp, and burp and slurp.

Everything is in `package.json`

####Semantic Versioning

This library will follow semantic versioning.  So you know if/when you should update it.
And you can tell if it/when it is more mature.

API
---


### #create

A factory function that creates a `qtree` object that includes several Object Oriented functions
and internal points storage.

```js
var bounds = [0,10,10,0]
var qtree = QTree.create( bounds )
```

### #qtree

A convenience method for creating a qtree object.
Useful when using the Static API.  And used internally by the Object Oriented API

A `qtree` object has the following properties.

- `qtree.children`: An array of `qtree` objects that represent the subdividies boundary of the parent qtree.
- `qtree.points` : An array of point indexes found within the top level of this qtree.
- `qtree.bounds` : An array representing an Axis Aligned Bounding Box.

```js

//QTree.qtree( <bounds_array> )

var bounds = [0,10,10,0]
var qtree = QTree.qtree( bounds )

```

### #add

Add a point to a qtree.

The static API only adds the point to the qtree by referencing its key.
The Object Oriented API will mutate the point object, and store it within an internal `qtree._points` hash.

```js
//Static usage.
//QTree.add( <qtree_object>, <point_collection>, <point_id> )

var qtree = QTree.qtree()
var points = [{x:0, y:0}]

QTree.add(qtree, points, 0)
```

```js
//OO Usage
//qtree.add( <point> )

qtree = Qtree.create()
qtree.add({ x:0, y:0 })
```

### #remove

Remove a point from a qtree.

The static API only removes the point from the qtree by dereferencing its key.
The Object Oriented API will remove the point from both the qtree, and the internal `qtree._points` hash.

```js
//Static usage.
//Qtree.remove( <qtree_object>, <point_collection>, <point_id> )

QTree.remove( qtree, points, "point_1" )
```

```js
//OO Usage
//qtree.remove( <point> )

var point = {x:0, y:0}

//qtree will add an `_id` property to the point for fast removal.
qtree.add(point)

qtree.remove(point)
```

### #iterator

Inclusively iterate over all the trees within a qtree.

```js

for(var tree of QTree.iterator(qtree)){
	//do stuff with tree
}
```

### Quadrant Children and Quadrant Children Indexes

Every qtree object has 4 quadrants.  Each quadrant contains points that fit
within the bounds of that quadrant.  The quadrants are stored in the property `qtree.children` as an array.
The order of the quadrants is `[NE,SE,SW,NW]`.  But this ordering may change,
so it is recommended to use the index properties below to reference individual quadrants.

Example:

```js
var north_east = qtree.children[QTree.NE]
```

`QTree.NE`

The index of the qtree's children that represents the North East Quadrant

`QTree.SE`

The index of the qtree's children that represents the South East Quadrant

`QTree.SW`

The index of the qtree's children that represents the South West Quadrant

`QTree.NW`

The index of the qtree's children that represents the North West Quadrant

Using the Static API
--------------------

QTree is designed to let the developer control their own data structures.
Whether you are working on a web game that needs fast collision detection,
or a GIS app using LeafletJS.  You probably have a memory budget, and you do not
want to duplicate all your point data.

QTree lets you call all of its functions statically.  You can pass in your own point data as either
an array or a hash.  And all operations depend on the key/index of your point.

You add a point with the key/index.  And when you query the tree, you receive indexes of the points that were found.

```js
var pointCollection = {
	"point_1" : {x:2, y:3}
}

var boundingBox = [10, 0, 0, 10] //TOP, RIGHT, BOTTOM, LEFT

var qtree = QTree.qtree(boundingBox)

QTree.add(qtree, pointCollection, "point_1")

QTree.remove(qtree, pointCollection, "point_1")

Qtree.query(qtree, [0, 3, 4, 0]) //=> ["point_1"]
```

Using the Object Oriented API
-------------------

QTree provides an Object Oriented API for convenience.

The Object Oriented API is less verbose, but at the cost of control over memory usage and location.
The Object Oriented API can be accessed using the `QTree.create` function.

The Object Oriented API is calling the static API with a point collection and
qtree object stored on the instance.

```js
var boundingBox = [10, 0, 0, 10]
var qtree = QTree.create(boundingBox)

qtree.points //=> []

qtree.add( {x:0, y:0 })
qtree.points //=> ["point_1"]

qtree._points //=> { point_1: {x:0, y:0, _id: "point_1" }}

for(var i = 0; i < 4; i++){
	qtree.add( {x:i, y:i })
}

qtree.points // => ["point_1", "point_2", "point_3", "point_4"]
qtree._points /*

 => {
 	point_1: { x:0, y:0, id: "point_1" },
 	point_2: { x:1, y:1, id: "point_2" },
 	point_3: { x:2, y:2, id: "point_3" },
 	point_4: { x:3, y:3, id: "point_4" },
 	point_5: { x:4, y:4, id: "point_5" },
 }

*/

qtree.children //=> [qtree, qtree, qtree, qtree]

qtree.children[QTree.NE].points //=> ["point_5"]

```

Notice that the Object Oriented API does not rely on keys/indexes, but references.
Also note that that the qtree instance has added an `_id` property to the point object
for compatibility with static API.


Contributing
------------

The source is written in ES6 using [Babel](http://babeljs.io/)

To compile to ES5 run `npm run build`

To compile to ES5 automatically, and then run the tests.  run `npm run watch`

To run the tests.  `npm test`

Pull requests welcome.

To run the tests
----------------

```
#install dependencies
npm install

#run the test suite whenver you edit ./lib
npm run watch
```

Roadmap
-------

- Browser usage without browserify.
- Publishing on npm
- Browser demos
- Docs on gh-pages
- compress() function, that will shrink a qtree down after removing several points