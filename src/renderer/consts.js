export const DocType = {
  RICH: 'richtext',
  MD: 'markdown',
  TIMEPLAN: 'timeplan',
  TOPICPLAN: 'topicplan'
}

/** doc in tabs **/
export const EditMode = {
  VIM: 'VIM',
  NORMAL: 'NORMAL'
}

/** folder or list sort mode */
export const SortMode = {
  NAME_ASC: 'NAME_ASC',
  NAME_DESC: 'NAME_DESC',
  CTIME_ASC: 'CTIME_ASC',
  CTIME_DESC: 'CTIME_DESC',
  UTIME_ASC: 'UTIME_ASC',
  UTIME_DESC: 'UTIME_DESC'
}

export const NoteMutations = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  MOVE: 'MOVE',
  LOAD: 'LOAD'
}

/** doc in tabs **/
export const DocMutations = {
  LOAD: 'LOAD',
  ADD: 'ADD',
  CLOSE: 'CLOSE',
  SELECT: 'SELECT',
  SELECT_LOADING: 'SELECT_LOADING',
  SELECT_EDITMODE: 'SELECT_EDITMODE'
}

/** node in folder pane **/
export const DirMutations = {
  LOAD: 'LOAD',
  ADD: 'ADD',
  DELETE: 'DELETE',
  SELECT: 'SELECT', // select a node
  TOGGLE: 'TOGGLE', // expland collapse node
  RENAME: 'RENAME', // rename node
  SELECT_LOADING: 'SELECT_LOADING',
  SELECT_VIEWMODE: 'SELECT_VIEWMODE', // tree or list
  SELECT_SORTMODE: 'SELECT_SORTMODE' // sort
}
