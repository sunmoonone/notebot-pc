import db from '@/datastore-notes'
import { DocType, SortMode, DirMutations } from '@/consts'
/**
 * TreeNode = {
 *   open: false
 *   type: DocType
 *   id: String
 *   name: String
 *   pid: String
 * }
 */
const state = {
  treeModel: {},
  currentNode: null,
  viewMode: 'tree',
  sortMode: SortMode.NAME_ASC,
  isLoading: false
}

const mutations = {
  [DirMutations.LOAD] (state, tree) {
    state.treeModel = tree
  },
  [DirMutations.ADD] (state, data) {
    state.treeModel.insert(data)
  },
  /**
   * @param {Object} payload {id:'', trim: true}
   */
  [DirMutations.DELETE] (state, payload) {
    this.treeModel.remove(node => node.data._id === payload.id, payload.trim)
  },
  [DirMutations.SELECT] (state, id) {
    var node = this.treeModel.select(n => n.data._id === id)
    if (node) {
      state.currentNode = node
    }
  },
  [DirMutations.TOGGLE] (state, id) {
    var node = this.treeModel.first(n => n.data._id === id)
    if (node && node.children.length > 0) {
      node.data.open = !node.data.open
    }
  },
  [DirMutations.RENAME] (state, payload) {
    let node = this.treeModel.first(n => n.data._id === payload.id)
    node.data.name = payload.name
  },
  [DirMutations.SELECT_VIEWMODE] (state, mode) {
    state.viewMode = mode
  },
  [DirMutations.SELECT_SORTMODE] (state, mode) {
    if (mode === state.sortMode) return
    state.sortMode = mode

    if (mode === SortMode.NAME_ASC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.name < n2.data.name ? -1 : n1.data.name > n2.data.name ? 1 : 0
      )
    } else if (mode === SortMode.NAME_DESC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.name < n2.data.name ? 1 : n1.data.name > n2.data.name ? -1 : 0
      )
    } else if (mode === SortMode.CTIME_ASC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.ctime < n2.data.ctime
            ? -1
            : n1.data.ctime > n2.data.ctime
              ? 1
              : 0
      )
    } else if (mode === SortMode.CTIME_DESC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.ctime < n2.data.ctime
            ? 1
            : n1.data.ctime > n2.data.ctime
              ? -1
              : 0
      )
    } else if (mode === SortMode.UTIME_ASC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.utime < n2.data.utime
            ? -1
            : n1.data.utime > n2.data.utime
              ? 1
              : 0
      )
    } else if (mode === SortMode.UTIME_DESC) {
      this.treeModel.sort(
        (n1, n2) =>
          n1.data.utime < n2.data.utime
            ? 1
            : n1.data.utime > n2.data.utime
              ? -1
              : 0
      )
    }
  },
  [DirMutations.SELECT_LOADING] (state, loading) {
    state.isLoading = loading
  }
}

const actions = {
  loadNotes (store) {
    store.commit('SELECT_LOADING', true)
    db.find({}, (err, notes) => {
      if (!err) {
        store.commit('LOAD_NOTES', notes)
        store.commit('SELECT_LOADING', false)
      }
    })
  },
  addNote (store, note) {
    store.commit('SELECT_LOADING', true)

    db.insert(note, (err, note) => {
      if (!err) {
        store.commit('ADD_NOTE', note)
        store.commit('SELECT_LOADING', false)
      }
    })
  },
  updateNote (store, note) {
    db.update({ _id: note._id }, note, {}, err => {
      if (!err) {
        store.dispatch('loadNotes')
      }
    })
  },
  deleteNote (store, note) {
    store.commit('SELECT_LOADING', true)

    db.remove({ _id: note._id }, {}, err => {
      if (!err) {
        store.commit('DELETE_NOTE', note)
        store.commit('SELECT_LOADING', false)
      }
    })
  }
}

const getters = {
  notes: state => state.notes,
  noteById: state => id => state.notes.find(note => note._id === id),
  nodeById: state => id => {},
  languages: state => {
    const map = new Map()

    if (state.notes.length > 0) {
      state.notes.forEach(note => {
        Object.keys(note.files).forEach(key => {
          if (map.has(note.files[key].language)) {
            map.set(
              note.files[key].language,
              map.get(note.files[key].language) + 1
            )
          } else {
            map.set(note.files[key].language, 1)
          }
        })
      })
    }
    return map
  },
  totalFiles () {
    let total = 0

    state.notes.forEach(note => {
      total += Object.keys(note.files).length
    })

    return total
  },
  languageSelected: state => state.languageSelected,
  gistsSelected: state => state.gistsSelected,
  isLoading: state => state.isLoading
}

export default {
  state,
  mutations,
  actions,
  getters
}
