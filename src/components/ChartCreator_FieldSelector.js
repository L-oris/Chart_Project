import React,{Component} from 'react'
import {connect} from 'react-redux'

import {getCreatorTableFields,setCreatorFields} from '../actions'


class ChartCreator_FieldSelector extends Component {

  constructor(props){
    super(props)
    this.state={
      chartTypes: ['line','bar','radar','doughnut']
    }
    this.renderFields = this.renderFields.bind(this)
    this.chooseField = this.chooseField.bind(this)
    this.saveFields = this.saveFields.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const {dispatch,creatorTableId} = nextProps
    //make sure action is dispatched only once
    creatorTableId && !this.props.creatorTableId && dispatch(getCreatorTableFields(creatorTableId))
  }

  renderFields(selectedAxis,fieldsList){
    return fieldsList.map(field=>(
      <li className={`${this.state[selectedAxis] === field ? 'active' : ''}`} onClick={e=>this.chooseField(selectedAxis,field)}>{field}</li>
    ))
  }

  chooseField(selectedAxis,fieldName){
    this.setState({
      [selectedAxis]: fieldName
    })
  }

  saveFields(){
    const {dispatch} = this.props
    const {XAxis,YAxis,type} = this.state
    if(XAxis && YAxis && type){
      dispatch(setCreatorFields({XAxis,YAxis,type}))
    }
  }

  render(){
    const {creatorTableFields,creatorData} = this.props
    const {chartTypes} = this.state
    return (
      <div className="chart-creator__field-selector">

        {creatorTableFields && !creatorData &&
          <div>

            <h4>Select the type</h4>
            <ul className="type">
              <li className={`${this.state.type === 'line' ? 'active' : ''}`} onClick={e=>this.chooseField('type','line')}>
                <i className="fa fa-line-chart" aria-hidden="true"></i>
              </li>
              <li className={`${this.state.type === 'bar' ? 'active' : ''}`} onClick={e=>this.chooseField('type','bar')}>
                <i className="fa fa-bar-chart" aria-hidden="true"></i>
              </li>
              <li className={`${this.state.type === 'radar' ? 'active' : ''}`} onClick={e=>this.chooseField('type','radar')}>
                <i className="fa fa-connectdevelop" aria-hidden="true"></i>
              </li>
              <li className={`${this.state.type === 'doughnut' ? 'active' : ''}`} onClick={e=>this.chooseField('type','doughnut')}>
                <i className="fa fa-pie-chart" aria-hidden="true"></i>
              </li>
            </ul>

            <ul className="x-axis">
              <h4>Select X Axis</h4>
              {this.renderFields('XAxis',creatorTableFields)}
            </ul>

            <ul className="y-axis">
              <h4>Select Y Axis</h4>
              {this.renderFields('YAxis',creatorTableFields)}
            </ul>

            <button onClick={this.saveFields}>Next</button>
          </div>
        }
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    creatorTableId: reduxState.creatorTableId,
    creatorTableFields: reduxState.creatorTableFields,
    creatorData: reduxState.creatorData
  }
}

export default connect(mapStateToProps)(ChartCreator_FieldSelector)
