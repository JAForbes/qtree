"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _Symbol$iterator = require("babel-runtime/core-js/symbol/iterator")["default"];

var AABB = require("./AABB");

var QTree = {
	NE: 0,
	SE: 1,
	SW: 2,
	NW: 3,

	//How to divide each subtree [TOP,RIGHT,BOTTOM,LEFT]

	qtree: function qtree(aabb) {
		return {
			points: [],
			children: [],
			bounds: aabb ? aabb.bounds ? aabb.bounds : aabb : [-Infinity, Infinity, Infinity, -Infinity]
		};
	},

	_subdivision: function _subdivision(qtree) {
		var N = qtree.bounds[0];
		var E = qtree.bounds[1];
		var S = qtree.bounds[2];
		var W = qtree.bounds[3];

		var dx_half = (W - E) / 2;
		var dy_half = (S - N) / 2;

		return [
		//NE
		QTree.qtree([N, E, S - dy_half, W - dx_half]),
		//SE
		QTree.qtree([N + dy_half, E, S, W - dx_half]),
		//SW
		QTree.qtree([N + dy_half, E + dx_half, S, W]),
		//NW
		QTree.qtree([N, E + dx_half, S - dy_half, W])];
	},

	add: function add(qtree, points, point_id) {
		var point_within_bounds = AABB.contains(qtree.bounds, points[point_id]);
		var added_successfully = false;
		if (point_within_bounds) {

			if (qtree.points.length < 4) {
				qtree.points.push(point_id);
				return true;
			} else if (qtree.children.length == 0) {
				qtree.children = QTree._subdivision(qtree);
			}
			for (var i = 0; i < qtree.children.length; i++) {
				var added = QTree.add(qtree.children[i], points, point_id);
				if (added) {
					return true;
				}
			}
		}

		return added_successfully;
	},

	iterator: _regeneratorRuntime.mark(function iterator(qtree) {
		var stack, found, tree;
		return _regeneratorRuntime.wrap(function iterator$(context$1$0) {
			while (1) switch (context$1$0.prev = context$1$0.next) {
				case 0:
					stack = [qtree];
					found = false;

				case 2:
					if (found) {
						context$1$0.next = 9;
						break;
					}

					tree = stack.shift();
					stack.push.apply(stack, tree.children);

					context$1$0.next = 7;
					return tree;

				case 7:
					context$1$0.next = 2;
					break;

				case 9:
				case "end":
					return context$1$0.stop();
			}
		}, iterator, this);
	}),

	remove: function remove(qtree, points, point_id) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _getIterator(QTree.iterator(qtree)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var tree = _step.value;

				var index = tree.points.indexOf(point_id);
				if (index > -1) {
					tree.points.splice(index, 1);
					return true;
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return false;
	},

	query: function query(qtree, points, bounds) {
		var results = [];

		if (!AABB.intersects(qtree.bounds, bounds)) {
			//abort
			return results;
		}

		qtree.points.forEach(function (point_id) {
			if (AABB.contains(bounds, points[point_id])) {
				results.push(point_id);
			}
		});

		var child_results = qtree.children.reduce(function (r, qtree) {
			return r.concat(QTree.query(qtree, points, bounds));
		}, []);

		return results.concat(child_results);
	},

	create: function create(bounds) {
		var qtree = QTree.qtree(bounds);
		qtree._points = {};
		qtree._sequence_id = 0;

		qtree.add = function (point) {
			var id = "point_" + ++qtree._sequence_id;
			point._id = id;
			qtree._points[id] = point;
			return QTree.add(qtree, qtree._points, id);
		};
		qtree.remove = function (point) {
			var result = QTree.remove(qtree, qtree._points, point._id);
			delete qtree._points[point._id];
			return result;
		};
		qtree.query = function (bounds) {
			return QTree.query(qtree, qtree._points, bounds).map(function (point_id) {
				return qtree._points[point_id];
			});
		};
		qtree.reset = function (bounds) {
			qtree.bounds = bounds ? QTree.normalize(bounds) : qtree.bounds;
			qtree.children = [];
			qtree.points = [];
			qtree._points = {};
			qtree._sequence_id = 1;
			qtree[_Symbol$iterator] = function () {
				return QTree.iterator(qtree);
			};
			return qtree;
		};
		return qtree;
	}
};
module.exports = QTree;