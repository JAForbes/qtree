var assert = require("assert")
var AABB = require("../aabb")
var _ = require("lodash-fp")
var rand = _.random.bind(_, -10, 10)
var randomAABB = _.times.bind(_, rand, 4)

describe("AABB", function () {
	describe("normalize", function(){
		it("should swap TOP/BOTTOM when TOP > BOTTOM", function(){
			var normalized = AABB.normalize(randomAABB())
			assert( normalized[AABB.TOP] <= normalized[AABB.BOTTOM] )
		})

		it("should swap LEFT/RIGHT when LEFT > RIGHT", function(){
			var normalized = AABB.normalize(randomAABB())
			assert( normalized[AABB.LEFT] <= normalized[AABB.RIGHT] )
		})
	})

	describe("contains", function(){
		it("should return true if a point lies inside a bounding box", function(){
			var normalized = AABB.normalize(randomAABB())
			var dx = normalized[AABB.RIGHT] - normalized[AABB.LEFT]
			var dy = normalized[AABB.BOTTOM] - normalized[AABB.TOP]
			var point = {
				x: normalized[AABB.RIGHT] - dx/2,
				y: normalized[AABB.BOTTOM]- dy/2
			}
			assert(
				AABB.contains(normalized, point)
			)
		})
		it("should return false if a point lies outside a bounding box", function(){
			var normalized = AABB.normalize(randomAABB())
			var point = {
				x: normalized[AABB.RIGHT] * 2,
				y: normalized[AABB.BOTTOM] * 2
			}
			assert(
				!AABB.contains(normalized, point)
			)

		})
	})

	describe("intersects", function(){
		it("should return true if two bounding boxes overlap", function(){
			var a = AABB.normalize([0,20,20,0])
			var b = AABB.normalize([-10,10,20,-10])

			assert(
				AABB.intersects(a,b)
			)

			assert(
				!AABB.outside(a,b)
			)
		})

		it("should return false if two bounding boxes do not overlap", function(){
			var a = AABB.normalize([-20,0,0,-20])
			var b = AABB.normalize([0,20,0,20])

			assert(
				!AABB.intersects(a,b)
			)

			assert(
				AABB.outside(a,b)
			)
		})
	})

	describe("create", function(){
		it("should create an object containing a normalized bounding box", function(){
			var aabb = AABB.create( randomAABB() )
			var normalized = aabb.bounds;

			assert( normalized[AABB.TOP] <= normalized[AABB.BOTTOM] )
			assert( normalized[AABB.LEFT] <= normalized[AABB.RIGHT] )
		})

		it("should have a stateful intersects function", function(){
			var a = AABB.create([0,20,20,0])
			var b = AABB.create([-10,10,20,-10])

			assert(
				a.intersects(b)
			)

			assert(
				!a.outside(b)
			)
		})

		it("should have a stateful contains function", function(){
			var a = AABB.create(randomAABB())

			var normalized = a.bounds
			var dx = normalized[AABB.RIGHT] - normalized[AABB.LEFT]
			var dy = normalized[AABB.BOTTOM] - normalized[AABB.TOP]
			var point = {
				x: normalized[AABB.RIGHT] - dx/2,
				y: normalized[AABB.BOTTOM] - dy/2
			}
			assert(
				a.contains(point)
			)
		})
	})
})
