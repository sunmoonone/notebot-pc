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
  sortMode: SortMode.NAME_ASC
}

const mutations = {
  [DirMutations.LOAD] (state, notes) {
    state.languageSelected = 'all'

    state.notes = notes
  },
  [DirMutations.ADD] (state, note) {
    state.notes.push(note)
  },
  [DirMutations.DELETE] (state, note) {
    if (state.gistsSelected) {
      state.notes = state.notes.filter(n => n.id !== note.id)
    } else {
      state.notes = state.notes.filter(n => n._id !== note._id)
    }
    state.languageSelected = 'all'
  },
  [DirMutations.SELECT] (state, node) {
    state.currentNode = node
  },
  [DirMutations.TOGGLE] (state, node) {
    if (node.type === DocType.FOLDER) {
      node.open = !node.open
    }
  },
  [DirMutations.RENAME] (state, payload) {
    let theNode = state.notes.find(note => note._id === payload.id),
    payload.node.name = payload.name
  },
  [DirMutations.SELECT_VIEWMODE] (state, mode) {
    state.viewMode = mode
  },
  [DirMutations.SELECT_SORTMODE] (state, mode) {
    state.sortMode = mode
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
  nodeById: state => id => {

  },
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
