var AABB = {
	TOP: 0, RIGHT: 1, BOTTOM: 2, LEFT: 3,

	_swap: function(collection, indexA, indexB){
		var valueA = collection[indexA]
		collection[indexA] = collection[indexB]
		collection[indexB] = valueA
	},

	_point_as_bounds: function(point){
		return [ point.y, point.x, point.y, point.x]
	},

	normalize: function(bounds){
		//pure:bounds = bounds.slice()

		if( bounds[AABB.TOP] > bounds[AABB.BOTTOM] ){
			AABB._swap(bounds, AABB.TOP, AABB.BOTTOM)
		}
		if( bounds[AABB.LEFT] > bounds[AABB.RIGHT] ){
			AABB._swap(bounds, AABB.LEFT, AABB.RIGHT)
		}

		return bounds;
	},

	contains: function(bounds, point){
		return AABB.intersects(bounds, AABB._point_as_bounds(point) )
	},

	intersects: function(boundsA, boundsB){
		return !AABB.outside(boundsA, boundsB)
	},

	outside: function(boundsA, boundsB){
		var a = boundsA
		var b = boundsB
		return (
			b[AABB.RIGHT] < a[AABB.LEFT] ||
			b[AABB.LEFT] > a[AABB.RIGHT] ||
			b[AABB.TOP] > a[AABB.BOTTOM] ||
			b[AABB.BOTTOM] < a[AABB.TOP]
		)

	},

    create: function(bounds){


      return {
        bounds: AABB.normalize(bounds),
        contains: function(point){
          return AABB.contains(this.bounds, point)
        },
        intersects: function(bounds){
          if(bounds.bounds) bounds = bounds.bounds
          return AABB.intersects(this.bounds, bounds)
        },
        outside: function(bounds){
          if(bounds.bounds) bounds = bounds.bounds
          return AABB.outside(this.bounds,bounds)
        }
      }
    }
}

module.exports = AABB