export default function(state={},action){

  if(action.type==='TEST'){
    return Object.assign({},state,{
      test: action.payload
    })
  }

  return state
}
