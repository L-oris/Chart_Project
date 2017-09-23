import axios from './axios'

export function getTables(){
  return axios.get('/api/get_tables')
  .then(serverResponse=>{
    return {
      type: 'GET_TABLES',
      tables: serverResponse.data
    }
  })
}

export function setCreatorTableId(tableId){
  return {
    type: 'SET_CREATOR_TABLE_ID',
    tableId
  }
}

export function getCreatorTableFields(tableId){
  return axios.get(`/api/get_table_fields/${tableId}`)
  .then(serverResponse=>{
    return {
      type: 'GET_CREATOR_TABLE_FIELDS',
      creatorTableFields: serverResponse.data
    }
  })
}

export function setCreatorFields(){
  return {
    type: 'SET_CREATOR_FIELDS'
  }
}
