var AABB = require("./AABB")

var QTree = {
	NE: 0,
	SE: 1,
	SW: 2,
	NW: 3,

	//How to divide each subtree [TOP,RIGHT,BOTTOM,LEFT]
	_transformations: [
		//NE:
		[1,1,0.5,0.5],
		//SE:
		[0.5,1,1,0.5],
		//SW:
		[0.5,0.5,1,1],
		//NW:
		[1,0.5,0.5,0.5]
	],

	qtree: function(aabb){
		return {
			points: [],
			children: [],
			bounds: aabb ? (
				aabb.bounds ? aabb.bounds : aabb
			) : [-Infinity, Infinity, Infinity, -Infinity]
		}
	},

	_subdivision: function(qtree){

		return QTree._transformations.map(function(transformation){
			var bounds = qtree.bounds.map(function(bound, i){
				return bound * transformation[i]
			})
			return QTree.qtree(bounds)
		})
	},

	add: function (qtree, points, point_id) {
		var point_within_bounds = AABB.contains(qtree.bounds, points[point_id])
		var added_successfully = false;
		if(point_within_bounds){

			if( qtree.points.length < 4){
				qtree.points.push( point_id )
				return true;
			}
			else if(qtree.children.length == 0){
				qtree.children = QTree._subdivision(qtree)
			}
			for(var i = 0; i < qtree.children.length; i++){
				var added = QTree.add(qtree.children[i], points, point_id)
				if(added){
					return true;
				}
			}
		}

		return added_successfully
	},

	iterator: function* (qtree){
		var stack = [qtree]
		var found = false;

		while( !found ){
			tree = stack.shift()
			stack.push.apply(stack, tree.children)

			yield tree;
		}
	},

	remove: function (qtree, points, point_id){
		for( var tree of QTree.iterator(qtree)){
			var index = tree.points.indexOf(point_id)
			if(index > -1){
				tree.points.splice(index,1)
				return true;
			}

		}
		return false;
	},

	query: function(qtree, points, bounds){
		var results = [];

		if( !AABB.intersects(qtree.bounds, bounds) ){
			//abort
			return results;
		}

		qtree.points.forEach(function(point_id){
			if(AABB.contains(bounds, points[point_id])){
				results.push(point_id)
			}
		})

		var child_results = qtree.children.reduce(function(r, qtree){
			return r.concat(QTree.query(qtree, points, bounds))
		},[])

		return results.concat(child_results)
	},

	create: function(bounds){
		var qtree = QTree.qtree(bounds)
		qtree._points = {}
		qtree._sequence_id = 1

		qtree.add = function(point){
			var id = "point_"+ ++qtree._sequence_id
			point._id = id
			qtree._points[id] = point
			return QTree.add(qtree, qtree._points, id)
		}
		qtree.remove = function(point){
			return QTree.remove(qtree, qtree._points, point._id)
		}
		qtree.query = function(bounds){
			return QTree.query(qtree, qtree._points, bounds)
		}
		qtree.reset = function(bounds){
			qtree.bounds = bounds ? QTree.normalize(bounds) : qtree.bounds
			qtree.children = []
			qtree.points = []
			qtree._points = {}
			qtree._sequence_id = 1
			return qtree
		}
		return qtree
	}
}
module.exports = QTree