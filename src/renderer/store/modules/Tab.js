import db from '@/datastore-notes'
import { EditMode, DocMutations } from '@/consts'

const state = {
  docs: [],
  editMode: EditMode.NORMAL,
  currentDoc: null,
  isLoading: false
}

const mutations = {
  [DocMutations.LOAD] (state, docs) {
    state.docs = docs
  },
  [DocMutations.ADD] (state, doc) {
    state.docs.push(doc)
  },
  [DocMutations.ClOSE] (state, doc) {
    state.docs = state.docs.filter(n => n._id !== doc._id)
  },
  [DocMutations.SELECT] (state, doc) {
    state.currentDoc = doc
  },
  [DocMutations.SELECT_LOADING] (state, loading) {
    state.isLoading = loading
  },
  [DocMutations.SELECT_EDITMODE] (state, mode) {
    state.editMode = mode
  }
}

const actions = {
  loadDocs (store, docs) {
    store.commit(DocMutations.SELECT_LOADING, true)
    store.commit(DocMutations.LOAD, docs)
    store.commit(DocMutations.SELECT_LOADING, false)
  },
  addDoc (store, doc) {
    store.commit(DocMutations.SELECT_LOADING, true)
    store.commit(DocMutations.ADD, doc)
    store.commit(DocMutations.SELECT_LOADING, false)
  },
  saveDoc (store, doc) {
    db.update({ _id: doc._id }, doc, {}, err => {
      if (err) {
        console.log(err)
      }
    })
  },
  closeDoc (store, doc) {
    store.commit(DocMutations.SELECT_LOADING, true)
    store.commit(DocMutations.ClOSE, doc)
    store.commit(DocMutations.SELECT_LOADING, false)
  }
}

const getters = {
  docs: state => state.docs,
  docById: state => id => state.docs.find(doc => doc._id === id),
  isLoading: state => state.isLoading
}

export default {
  state,
  mutations,
  actions,
  getters
}
