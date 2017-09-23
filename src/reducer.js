export default function(state={},action){

  if(action.type==='GET_TABLES'){
    return Object.assign({},state,{
      tables: action.tables
    })
  }

  if(action.type==='SET_CREATOR_TABLE_ID'){
    return Object.assign({},state,{
      creatorTableId: action.tableId
    })
  }

  if(action.type==='GET_CREATOR_TABLE_FIELDS'){
    return Object.assign({},state,{
      creatorTableFields: action.creatorTableFields
    })
  }

  if(action.type==='SET_CREATOR_FIELDS'){
    return Object.assign({},state,{
      creatorFields: action.creatorFields
    })
  }

  if(action.type==='GET_CREATOR_DATA'){
    return Object.assign({},state,{
      creatorData: action.creatorData
    })
  }

  return state
}
