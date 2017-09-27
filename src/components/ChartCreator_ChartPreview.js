import React,{Component} from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

import {Chart} from '.'
import {getCreatorData,createChart} from '../actions'

class ChartCreator_ChartPreview extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.createChart = this.createChart.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const {dispatch,creatorTableId,creatorFields} = nextProps
    //make sure action is dispatched only once
    creatorTableId && creatorFields && !this.props.creatorFields && dispatch(getCreatorData(creatorTableId,creatorFields))
  }

  shouldComponentUpdate(nextProps,nextState){
    //prevent component re-rendering every time 'name' or 'description' fields change
    const {name:previousName,description:previousDescription,file:previousFile} = this.state
    const {name:nextName,description:nextDescription,file:nextFile} = nextState
    if(previousName !== nextName || previousDescription !== nextDescription || previousFile !== nextFile){
      return false
    }
    return true
  }

  handleInputChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleFileChange(e){
    this.setState({
      file:e.target.files[0]
    })
  }

  createChart(e){
    e.preventDefault()
    const {dispatch,creatorTableId,creatorFields,creatorData} = this.props
    const {name,description,file} = this.state
    if(creatorData && name && description && file){
      //use built-in FormData API
      const formData = new FormData()
      formData.append('file',file)
      formData.append('tableId',creatorTableId)
      formData.append('XAxis',creatorFields.XAxis)
      formData.append('YAxis',creatorFields.YAxis)
      formData.append('type',creatorFields.type)
      formData.append('name',name)
      formData.append('description',description)

      dispatch(createChart(formData))
      browserHistory.push('/')
    }
  }

  render(){
    const {creatorFields,creatorData} = this.props
    return (
      <div>

        {creatorData && <Chart type={creatorFields.type} XData={creatorData.XData} YData={creatorData.YData} YLabel={creatorFields.YAxis}/>}

        <form onSubmit={this.createChart}>
          Name:
          <input required name="name" onChange={this.handleInputChange}/>
          Description:
          <textarea required name="description" onChange={this.handleInputChange}></textarea>
          <input required type="file" onChange={this.handleFileChange}/>
          <button type="submit">Create it!</button>
        </form>

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
