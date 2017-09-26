export default function(state={},action){

  if(action.type==='GET_USER'){
    return Object.assign({},state,{
      user: action.user
    })
  }

  if(action.type==='UPDATE_USER_PROFILE_PIC'){
    return Object.assign({},state,{
      user: Object.assign({},state.user,{
        profilePicUrl: action.profilePicUrl
      })
    })
  }

  if(action.type==='GET_TABLES'){
    return Object.assign({},state,{
      tables: action.tables
    })
  }

  if(action.type==='ADD_TABLE'){
    return Object.assign({},state,{
      tables: [...state.tables,action.table]
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

  if(action.type==='ADD_VISUALIZER_CHART_COMMENT'){
    return Object.assign({},state,{
      visualizerChartComments: [...state.visualizerChartComments, action.comment]
    })
  }

  if(action.type==='DELETE_VISUALIZER_CHART'){
    return Object.assign({},state,{
      visualizerChart: '',
      visualizerChartData: '',
      visualizerChartComments: ''
    })
  }

  if(action.type==='SET_VISUALIZER_TABLE'){
    return Object.assign({},state,{
      visualizerTable: action.visualizerTable
    })
  }

  if(action.type==='GET_VISUALIZER_TABLE_PREVIEW'){
    return Object.assign({},state,{
      visualizerTablePreview: action.visualizerTablePreview
    })
  }

  if(action.type==='DELETE_VISUALIZER_TABLE'){
    return Object.assign({},state,{
      visualizerTable: '',
      visualizerTablePreview: ''
    })
  }

  if(action.type==='SET_TABLE_UPLOADER_IS_VISIBLE'){
    return Object.assign({},state,{
      tableUploaderIsVisible: !state.tableUploaderIsVisible
    })
  }

  if(action.type==='GET_USER_TABLES'){
    return Object.assign({},state,{
      userTables: action.userTables
    })
  }

  if(action.type==='GET_USER_CHARTS'){
    return Object.assign({},state,{
      userCharts: action.userCharts
    })
  }

  if(action.type==='GET_SEARCH_CHART_RESULTS'){
    return Object.assign({},state,{
      searchChartResults: action.searchChartResults
    })
  }

  if(action.type==='DELETE_SEARCH_CHART_RESULTS'){
    return Object.assign({},state,{
      searchChartResults: ''
    })
  }

  if(action.type==='GET_SEARCH_TABLE_RESULTS'){
    return Object.assign({},state,{
      searchTableResults: action.searchTableResults
    })
  }

  if(action.type==='DELETE_SEARCH_TABLE_RESULTS'){
    return Object.assign({},state,{
      searchTableResults: ''
    })
  }

  return state
}
