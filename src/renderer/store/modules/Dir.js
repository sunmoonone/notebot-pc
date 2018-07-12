import db from '@/datastore-notes'
import { SortMode, DirMutations } from '@/consts'
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
  SELECT_LOADING (state, loading) {
    state.isLoading = loading
  }
}

const actions = {
  loadNotes (store) {
    if (store.state.gistsSelected) {
      if (store.rootState.Settings.settings.githubPersonalAccessToken) {
        store.commit('SELECT_LOADING', true)
        store.commit('LOAD_NOTES', [])

        octokit.authenticate({
          type: 'token',
          token: store.rootState.Settings.settings.githubPersonalAccessToken
        })

        octokit.gists.getAll().then(res => {
          const promises = []

          res.data.forEach(gist => {
            promises.push(octokit.gists.get({ id: gist.id }))
          })

          Promise.all(promises).then(values => {
            const notes = []

            values.forEach(gistDetailed => {
              notes.push(converter.gistToNote(gistDetailed.data))
            })

            store.commit('LOAD_NOTES', notes)
            store.commit('SELECT_LOADING', false)
          )
        })
      } else {
        store.commit('LOAD_NOTES', [])
      }
    } else {
      store.commit('SELECT_LOADING', true)
      db.find({}, (err, notes) => {
        if (!err) {
          store.commit('LOAD_NOTES', notes)
          store.commit('SELECT_LOADING', false)
        }
      })
    }
  },
  addNote (store, note) {
    store.commit('SELECT_LOADING', true)
    if (store.state.gistsSelected) {
      octokit.gists.create(note).then(() => {
        store.dispatch('loadNotes')
      })
    } else {
      db.insert(note, (err, note) => {
        if (!err) {
          store.commit('ADD_NOTE', note)
          store.commit('SELECT_LOADING', false)
        }
      })
    }
  },
  updateNote (store, note) {
    if (store.state.gistsSelected) {
      octokit.gists
        .edit({
          id: note.id,
          files: note.files,
          description: note.description
        })
        .then(() => store.dispatch('loadNotes'))
    } else {
      db.update({ _id: note._id }, note, {}, err => {
        if (!err) {
          store.dispatch('loadNotes')
        }
      })
    }
  },
  deleteNote (store, note) {
    store.commit('SELECT_LOADING', true)
    if (store.state.gistsSelected) {
      octokit.gists.delete({ id: note.id }).then(() => {
        store.commit('DELETE_NOTE', note)
        store.commit('SELECT_LOADING', false)
      })
    } else {
      db.remove({ _id: note._id }, {}, err => {
        if (!err) {
          store.commit('DELETE_NOTE', note)
          store.commit('SELECT_LOADING', false)
        }
      })
    }
  },
  selectLanguage (store, language) {
    store.commit('SELECT_LANGUAGE', language)
  },
  selectGists (store, gists) {
    store.commit('SELECT_GISTS', gists)
    store.dispatch('loadNotes')
  }
}

const getters = {
  notes: state => state.notes,
  noteById: state => id => state.notes.find(note => note._id === id),
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

