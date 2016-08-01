import invariant from 'invariant'
import createExtendable from './util/createExtendable'
import { wrappedMethods } from './constants/Set'

import {
  Set as ImmutableSet
  Map as ImmutableMap
} from 'immutable'

const EMPTY_MAP = new ImmutableMap()

// copy all attributes from an immutable.list to an extendable.list
function copy(val, immutable) {
  val.size = immutable.size
  val._map = immutable._map
  val.__ownerid = immutable.__ownerid

  return val
}

function empty(val) {
  val.size = 0
  val._map = EMPTY_MAP
  val.__ownerid = undefined

  return val
}

function Set(val) {
  if (!this) {
    return new Set(val)
  }

  return this.__wrap(new ImmutableSet(val))
}

Set.isSet = function isSet(obj) {
  return obj && obj instanceof Set
}

// Inherit methods from Immutable.List
Set.prototype = createExtendable(ImmutableSet, copy, empty, wrappedMethods)
Set.prototype.constructor = Set

Set.prototype.toString = function toString() {
  return this.__toString('Extendable.Set {', '}')
}

export default Set

