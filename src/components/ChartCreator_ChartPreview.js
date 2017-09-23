import React,{Component} from 'react'
import {connect} from 'react-redux'

import {Chart} from '.'
import {store} from '../start'
import {getCreatorData} from '../actions'

class ChartCreator_ChartPreview extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderChart = this.renderChart.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const {creatorTableId,creatorFields} = nextProps
    //make sure action is dispatched only once
    creatorTableId && creatorFields && !this.props.creatorFields && store.dispatch(getCreatorData(creatorTableId,creatorFields))
  }

  renderChart(chartData){
    console.log('data for chart',chartData);
  }

  render(){
    const {creatorData} = this.props
    return (
      <div>
        {creatorData && this.renderChart(creatorData)}
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    creatorTableId: reduxState.creatorTableId,
    creatorFields: reduxState.creatorFields,
    creatorData: reduxState.creatorData
  }
}

export default connect(mapStateToProps)(ChartCreator_ChartPreview)
