var QTree = require("../qtree")
var AABB = require("../aabb")
var assert = require("assert")
var _ = require("lodash-fp")
var havePoints = function(qtree){
	return qtree.points.length
}

describe("QTree", function () {
	describe("qtree", function(){
		it("should return an empty qtree data structure", function(){
			assert.equal(QTree.qtree().children.length, 0)
		})
		it("should have an Infinite bounding box if not specified", function(){
			var qtree = QTree.qtree()
			assert.equal(qtree.bounds[AABB.TOP], -Infinity)
			assert.equal(qtree.bounds[AABB.BOTTOM], Infinity)
			assert.equal(qtree.bounds[AABB.LEFT], -Infinity)
			assert.equal(qtree.bounds[AABB.RIGHT], Infinity)
		})
	})
	describe("add", function(){
		it("should subdivide when there are more than 4 points in a quadrant", function(){
			var qtree = QTree.qtree([0,10,10,0])
			var points = { a: {x:1, y:1}, b: {x:2, y:2}, c: {x:3, y:3}, d: {x:4, y:4}, e: {x:5, y: 5} }
			var addPoint = QTree.add.bind(null, qtree, points)

			//add all 5 points
			Object.keys(points)
				.forEach(addPoint)

			//top level is fully populated
			assert.equal(qtree.points.length,4)

			//one of the children must have children
			assert(
				qtree.children.some(havePoints)
			)

			var ne = qtree.children[QTree.NE]
			assert.equal(
				ne.bounds[AABB.BOTTOM], qtree.bounds[AABB.BOTTOM] / 2
			)
			assert.equal(
				ne.bounds[AABB.TOP],qtree.bounds[AABB.TOP]
			)
			assert.equal(
				ne.bounds[AABB.LEFT],qtree.bounds[AABB.LEFT] / 2
			)
			assert.equal(
				ne.bounds[AABB.RIGHT],qtree.bounds[AABB.RIGHT]
			)

		})
		it("should not accept a point if it lies outside its bounding box", function(){
			var qtree = QTree.qtree([0,10,10,0])
			var points = {a: {x:100, y:100} }
			assert.equal(
				QTree.add( qtree, points, "a"), false
			)
		})
	})
	describe("remove", function(){
		it("should remove the point from the qtree", function(){

			var qtree = QTree.qtree([0,10,10,0])
			//Add 5 points to the qtree

				var points = { a: {x:1, y:1}, b: {x:2, y:2}, c: {x:3, y:3}, d: {x:4, y:4}, e: {x:5, y: 5} }
				var addPoint = QTree.add.bind(null, qtree, points)

				//add all 5 points
				Object.keys(points)
					.forEach(addPoint)

			//remove from second level
			QTree.remove(qtree, points, "e")

			//a,b,c,d are in the top level
			assert.equal( qtree.points.join(""), "abcd" )

			assert.equal( qtree.children[0].points.length, 0)

		})
	})
	describe("query", function(){
		it("should return a list of points within a bounding box", function(){
			var qtree = QTree.qtree([0,10,10,0])

			var points = _.times(function(i){
				return {x: i, y: i }
			},10)
			points.forEach(function(point, i){

				QTree.add(qtree, points, i)
			})

			var results = QTree.query(qtree, points, [1,5,5,1] )
			assert.equal(
				results.length, 5
			)
		})
	})
	describe("create", function(){
		it("should create a qtree instance with an internal points hash")
		it("instance should have a working query function")
		it("instance should have a working add function")
		it("instance should have a working remove function")
		it("instance should have a reset function that clears the tree")
	})
})