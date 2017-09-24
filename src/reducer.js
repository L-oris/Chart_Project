export default function(state={},action){

  if(action.type==='GET_TABLES'){
    return Object.assign({},state,{
      tables: action.tables
    })
  }

  if(action.type==='GET_CHARTS'){
    return Object.assign({},state,{
      charts: action.charts
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

  if(action.type==='CREATE_CHART'){
    return Object.assign({},state,{
      charts: [...state.charts, action.chart],
      creatorTableId: '',
      creatorTableFields: '',
      creatorFields: '',
      creatorData: ''
    })
  }

  if(action.type==='SET_VISUALIZER_CHART'){
    return Object.assign({},state,{
      visualizerChart: action.visualizerChart
    })
  }

  if(action.type==='SET_VISUALIZER_CHART_DATA'){
    return Object.assign({},state,{
      visualizerChartData: action.visualizerChartData
    })
  }

  if(action.type==='SET_VISUALIZER_CHART_COMMENTS'){
    return Object.assign({},state,{
      visualizerChartComments: action.visualizerChartComments
    })
  }

  if(action.type==='DELETE_VISUALIZER'){
    return Object.assign({},state,{
      visualizerChart: '',
      visualizerChartData: '',
      visualizerChartComments: ''
    })
  }

  return state
}
