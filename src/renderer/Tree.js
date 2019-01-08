function exportRecur (node) {
  var exported = node.matchCriteria(criteria)
  if (!exported || typeof exported !== 'object') {
    throw new Error(
      'Export criteria should always return an object and it cannot be null.'
    )
  } else {
    exported.children = []
    node._childNodes.forEach(function (_child) {
      exported.children.push(exportRecur(_child))
    })

    return exported
  }
}
// todo: rewrite using es6
export class TreeNode {
  constructor (data) {
    this._data = data
    this._parent = null
    this._children = []
  }

  get data () {
    return this._data
  }

  get children () {
    return this._children
  }

  get siblings () {
    var thiss = this
    return !this._parent
      ? []
      : this._parent._children.filter(function (_child) {
        return _child !== thiss
      })
  }

  /**
   * Exports the node data in format specified. It maintains herirachy by adding
   * additional "children" property to returned value of `criteria` callback.
   *
   * @method export
   * @memberof TreeNode
   * @instance
   * @param {TreeNode~criteria} criteria - Callback function that receives data in parameter
   * and MUST return a formatted data that has to be exported. A new property "children" is added to object returned
   * that maintains the heirarchy of nodes.
   * @return {object} - {@link TreeNode}.
   * @example
   *
   * var rootNode = tree.insert({
   *   key: '#apple',
   *   value: { name: 'Apple', color: 'Red'}
   * });
   *
   * tree.insert({
   *   key: '#greenapple',
   *   value: { name: 'Green Apple', color: 'Green'}
   * });
   *
   * tree.insertToNode(rootNode,  {
   *  key: '#someanotherapple',
   *  value: { name: 'Some Apple', color: 'Some Color' }
   * });
   *
   * // Export the tree
   * var exported = rootNode.export(function(data){
   *  return { name: data.value.name };
   * });
   *
   * // Result in `exported`
   * {
   * "name": "Apple",
   * "children": [
   *   {
   *     "name": "Green Apple",
   *     "children": []
   *   },
   *   {
   *     "name": "Some Apple",
   *     "children": []
   *  }
   * ]
   *}
   *
   */
  export (node) {
    
  var exported = _.cloneDeep(node._data)
  if (!exported || typeof exported !== 'object') {
    throw new Error(
      'Export criteria should always return an object and it cannot be null.'
    )
  } else {
    exported.children = []
    node._childNodes.forEach(function (_child) {
      exported.children.push(exportRecur(_child))
    })

    return exported
  }
    return exportRecur(this)
  }
}

export class Tree {
  constructor (data) {
    this._root = new TreeNode(data)
    this._searchStrategy = 'df'
    this._current = this._root
  }

  static DF = 'df'
  static BF = 'bf'

  get currentNode () {
    return this._current
  }

  get rootNode () {
    return this._root
  }

  get isEmpty () {
    return this._root === null
  }

  set searchStrategy (strategy) {
    this._searchStrategy = strategy
  }

  traverseDF (matcher) {
    // Hold the node when found
    var foundNode = null

    // Find node recursively
    ;(function recur (node) {
      if (matcher(node)) {
        foundNode = node
        return foundNode
      } else {
        node._children.some(recur)
      }
    })(this._root)

    return foundNode
  }

  traverseBF (matcher) {
    var foundNode = null
    // Find nodes recursively
    ;(function expand (queue) {
      while (queue.length) {
        var current = queue.splice(0, 1)[0]
        if (matcher(current)) {
          foundNode = current
          return
        }
        current._children.forEach(function (_child) {
          queue.push(_child)
        })
      }
    })([this._root])

    return foundNode
  }

  first (matcher) {
    if (this._searchStrategy === Tree.DF) {
      return this.traverseDF(matcher)
    } else {
      return this.traverseDF(matcher)
    }
  }

  select (matcher) {
    var node = this.first(matcher)
    if (node !== null) {
      this._current = node
    }
    return node
  }

  contains (matcher) {
    return this.first(matcher) !== null
  }

  /**
   * @param {function} cmpFn  required Specifies a function that defines the sort order.
   * a < b returns a value less than 0
   * a > b returns a value greater than 0
   * a == b returns 0
   * the smaller elements get lower index in the sorted array of children
   */
  sort (cmpFn) {
    ;(function expand (queue) {
      while (queue.length) {
        var current = queue.splice(0, 1)[0]
        current._children.forEach(function (_child) {
          queue.push(_child)
        })
        if (current._children.length > 0) {
          current.children.sort(cmpFn)
        }
      }
    })([this._root])
  }

  pruneAll () {
    if (this._root) this.trimBranchFrom(this._root)
    return this
  }

  /**
   * Remove an entire branch starting with specified node.
   * @param {TreeNode} node
   */
  trimBranchFrom (node) {
    var thiss = this

    // trim brach recursively
    ;(function recur (node) {
      node._children.forEach(recur)
      node._children = []
      node._data = null
    })(node)

    // Update Current Node
    if (node._parent) {
      node._parent._children.splice(node._parent._children.indexOf(node), 1)
      thiss._current = node._parent
    } else {
      thiss._root = thiss._current = null
    }
  }

  /**
   * Creates a {@link TreeNode} that contains the data provided and insert it in a tree.
   * New node gets inserted to the `_currentNode` which updates itself upon every insertion and deletion.
   *
   * @method insert
   * @memberof Tree
   * @instance
   * @param {object} data - data that has to be stored in tree-node.
   * @return {object} - instance of {@link TreeNode} that represents node inserted.
   * @example
   *
   * // Insert single value
   * tree.insert(183);
   *
   * // Insert array of values
   * tree.insert([34, 565, 78]);
   *
   * // Insert complex data
   * tree.insert({
   *   key: '#berries',
   *   value: { name: 'Apple', color: 'Red'}
   * });
   */
  insert (data) {
    var node = new TreeNode(data)
    if (this._root === null && this._current === null) {
      this._root = this._current = node
    } else {
      node._parent = this._current
      this._current._children.push(node)
      this._current = node
    }
    return node
  }

  /**
   * Inserts node to a particular node present in the tree. Particular node here is searched
   * in the tree based on the criteria provided.
   *
   * @method insertTo
   * @memberof Tree
   * @instance
   * @param {function} matcher - Callback function that specifies the search criteria
   * for node to which new node is to be inserted. Criteria callback here receives {@link TreeNode#_data}
   * in parameter and MUST return boolean indicating whether that data satisfies your criteria.
   * @param {object} data - that has to be stored in tree-node.
   * @return {object} - instance of {@link TreeNode} that represents node inserted.
   * @example
   *
   * // Insert data
   * tree.insert({
   *   key: '#apple',
   *   value: { name: 'Apple', color: 'Red'}
   * });
   *
   * // New Data
   * var greenApple = {
   *  key: '#greenapple',
   *  value: { name: 'Green Apple', color: 'Green' }
   * };
   *
   * // Insert data to node which has `key` = #apple
   * tree.insertTo(function(data){
   *  return data.key === '#apple'
   * }, greenApple);
   */
  insertTo (matcher, data) {
    var node = this.first(matcher)
    if (node === null) return null
    return this.insertToNode(node, data)
  }

  /**
   * Inserts node to a particular node present in the tree. Particular node here is an instance of {@link TreeNode}
   *
   * @method insertToNode
   * @memberof Tree
   * @instance
   * @param {function} node -  {@link TreeNode} to which data node is to be inserted.
   * @param {object} data - that has to be stored in tree-node.
   * @return {object} - instance of {@link TreeNode} that represents node inserted.
   * @example
   *
   * // Insert data
   * var node = tree.insert({
   *   key: '#apple',
   *   value: { name: 'Apple', color: 'Red'}
   * });
   *
   * // New Data
   * var greenApple = {
   *  key: '#greenapple',
   *  value: { name: 'Green Apple', color: 'Green' }
   * };
   *
   * // Insert data to node
   * tree.insertToNode(node, greenApple);
   */
  insertToNode (node, data) {
    var newNode = new TreeNode(data)
    newNode._parent = node
    node._children.push(newNode)
    this._current = newNode
    return newNode
  }

  remove (matcher, trim) {
    var node = this.first(matcher)
    if (node === null) return
    return this.removeNode(node, trim)
  }

  /**
   * Removes a node from tree and updates `_currentNode` to parent node of node removed.
   *
   * @method removeNode
   * @memberof Tree
   * @instance
   * @param {object} node - {@link TreeNode} that has to be removed.
   * @param {boolean} trim - indicates whether to remove entire branch from the specified node.
   */
  removeNode (node, trim) {
    if (trim || node === this._root) {
      // Trim Entire branch
      this.trimBranchFrom(node)
    } else {
      // Upate children's parent to grandparent
      node._children.forEach(function (_child) {
        _child._parent = node._parent
        node._parent._child.push(_child)
      })

      // Delete itslef from parent child array
      node._parent._children.splice(node._parent._children.indexOf(node), 1)

      // Update Current Node
      this._current = node._parent

      // Clear Child Array
      node._child = []
      node._parent = null
      node._data = null
    }
  }

  /**
   * Imports the JSON data into a tree using the criteria provided.
   * A property indicating the nesting of object must be specified.
   *
   * @method import
   * @memberof Tree
   * @instance
   * @param {object} data - JSON data that has be imported
   * @param {string} childProperty - Name of the property that holds the nested data.
   * @param {Tree~criteria} converter - Callback function that receives data in parameter
   * and MUST return a formatted data that has to be imported in a tree.
   * @return {object} - {@link Tree}.
   * @example
   *
   * var data = {
   *   "trailId": "h2e67d4ea-f85f40e2ae4a06f4777864de",
   *   "initiatedAt": 1448393492488,
   *   "snapshots": {
   *      "snapshotId": "b3d132131-213c20f156339ea7bdcb6273",
   *      "capturedAt": 1448393495353,
   *      "thumbnail": "data:img",
   *      "children": [
   *       {
   *        "snapshotId": "yeb7ab27c-b36ff1b04aefafa9661243de",
   *        "capturedAt": 1448393499685,
   *        "thumbnail": "data:image/",
   *        "children": [
   *          {
   *            "snapshotId": "a00c9828f-e2be0fc4732f56471e77947a",
   *            "capturedAt": 1448393503061,
   *            "thumbnail": "data:image/png;base64",
   *            "children": []
   *          }
   *        ]
   *      }
   *     ]
   *   }
   * };
   *
   *  // Import
   *  // This will result in a tree having nodes containing `id` and `thumbnail` as data
   *  tree.import(data, 'children', function(nodeData){
   *    return {
   *      id: nodeData.snapshotId,
   *      thumbnail: nodeData.thumbnail
   *     }
   *  });
   *
   */
  import (data, childProperty, converter) {
    // Empty all tree
    if (this._root) this.trimBranchFrom(this._root)

    // Set Current Node to root node as null
    this._current = this._root = null

    // Hold `this`
    var thiss = this

    // Import recursively
    ;(function importRecur (node, recurData) {
      // Format data from given criteria
      var _data = converter(recurData)

      // Create Root Node
      if (!node) {
        node = thiss.insert(_data)
      } else {
        node = thiss.insertToNode(node, _data)
      }

      // For Every Child
      recurData[childProperty].forEach(function (_child) {
        importRecur(node, _child)
      })
    })(this._root, data)

    this._current = this._root

    return this
  }
}
