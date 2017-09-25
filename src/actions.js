import axios from './axios'
import {store} from './start'


export function getUser(){
  return axios.get('/api/get_current_user')
  .then(serverResponse=>{
    return {
      type: 'GET_USER',
      user: serverResponse.data
    }
  })
}


export function getTables(){
  return axios.get('/api/get_tables')
  .then(serverResponse=>{
    return {
      type: 'GET_TABLES',
      tables: serverResponse.data
    }
  })
}


export function addTable(formData){
  return axios.post('/api/upload_table',formData)
  .then(serverResponse=>{
    console.log('action correctly dispatched, serverResponse',serverResponse);
    return {
      type: 'ADD_TABLE',
      table: serverResponse.data
    }
  })
}


export function getCharts(){
  return axios.get('/api/get_charts')
  .then(serverResponse=>{
    return {
      type: 'GET_CHARTS',
      charts: serverResponse.data
    }
  })
}


export function createChart(chartObj){
  return axios.post('/api/create_chart',chartObj)
  .then(serverResponse=>{
    return {
      type: 'CREATE_CHART',
      chart: serverResponse.data
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


export function setCreatorFields(creatorFields){
  return {
    type: 'SET_CREATOR_FIELDS',
    creatorFields
  }
}


export function getCreatorData(creatorTableId,creatorFields){
  const {XAxis,YAxis,type} = creatorFields
  return axios.post('/api/get_unsaved_chart_data',{
    XAxis,YAxis,
    tableId: creatorTableId
  })
  .then(serverResponse=>{
    return {
      type: 'GET_CREATOR_DATA',
      creatorData: serverResponse.data
    }
  })
}


export function setVisualizerChart(chartId){
  //get chart from Redux store if there already, otherwise get from server
  const reduxChart = store.getState().charts && store.getState().charts.find(chart=>chart.id==chartId)

  if(!reduxChart){
    return axios.get(`/api/get_chart/${chartId}`)
    .then(serverResponse=>{
      return {
        type: 'SET_VISUALIZER_CHART',
        visualizerChart: serverResponse.data
      }
    })
  }

  return {
    type: 'SET_VISUALIZER_CHART',
    visualizerChart: reduxChart
  }
}


export function setVisualizerChartData(chartId){
  return axios.get(`/api/get_chart_data/${chartId}`)
  .then(serverResponse=>{
    return {
      type: 'SET_VISUALIZER_CHART_DATA',
      visualizerChartData: serverResponse.data
    }
  })
}


export function setVisualizerChartComments(chartId){
  return axios.get(`/api/get_chart_comments/${chartId}`)
  .then(serverResponse=>{
    return {
      type: 'SET_VISUALIZER_CHART_COMMENTS',
      visualizerChartComments: serverResponse.data
    }
  })
}

export function addVisualizerChartComment(chartId,comment){
  return axios.post('/api/add_chart_comment',{chartId,comment})
  .then(serverResponse=>{
    return {
      type: 'ADD_VISUALIZER_CHART_COMMENT',
      comment: serverResponse.data
    }
  })
}


export function deleteVisualizer(){
  return {
    type: 'DELETE_VISUALIZER'
  }
}
