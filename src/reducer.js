export default function(state={},action){

  if(action.type==='GET_TABLES'){
    return Object.assign({},state,{
      tables: action.tables
    })
  }

  return state
}
