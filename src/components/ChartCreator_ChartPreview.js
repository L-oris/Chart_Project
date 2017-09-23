import React,{Component} from 'react'
import {connect} from 'react-redux'

import {Chart} from '.'
import {store} from '../start'
import {getCreatorData} from '../actions'

class ChartCreator_ChartPreview extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  componentWillReceiveProps(nextProps){
    const {creatorTableId,creatorFields} = nextProps
    //make sure action is dispatched only once
    creatorTableId && creatorFields && !this.props.creatorFields && store.dispatch(getCreatorData(creatorTableId,creatorFields))
  }

  render(){
    const {creatorFields,creatorData} = this.props
    return (
      <div>
        {creatorData && <Chart type={creatorFields.type} XData={creatorData.XData} YData={creatorData.YData} YLabel={creatorFields.YAxis}/>}
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
