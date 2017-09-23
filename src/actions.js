import axios from './axios'

export function getTables(){
  return axios.get('/api/get_tables')
  .then((serverResponse)=>{
    return {
      type: 'GET_TABLES',
      tables: serverResponse.data
    }
  })
}

export function getTableFields(){
  return axios.get('/api/get_table_fields')
  .then((serverResponse)=>{
    return {
      type: 'GET_TABLE_FIELDS',
      creatorFields: serverResponse.data
    }
  })
}
