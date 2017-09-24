import React,{Component} from 'react'
import {connect} from 'react-redux'

import {addVisualizerChartComment} from '../actions'


class ChartVisualizer_Comments extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.handleInputChange = this.handleInputChange.bind(this)
    this.createNewComment = this.createNewComment.bind(this)
  }

  handleInputChange(e){
    this.setState({
      newComment: e.target.value
    })
  }

  createNewComment(e){
    e.preventDefault()
    const {id:chartId} = this.props.visualizerChart
    const {newComment} = this.state
    this.props.dispatch(addVisualizerChartComment(chartId,newComment))
    //clear the input field
    this.setState({
      newComment: ''
    })
  }

  renderComments(comments){
    return comments.map(_comment=>{
      const {comment,first,last,profilePicUrl,timestamp} = _comment
      return (
        <li>
          <h6>{first} {last}</h6>
          <img className="small-img" src={profilePicUrl} alt={first + ' ' + last}/>
          <p>{comment}</p>
        </li>
      )
    })
  }

  render(){
    const {visualizerChartComments} = this.props
    return (
      <div>
        <h3>Comments</h3>

        {visualizerChartComments && this.renderComments(visualizerChartComments)}

        <form onSubmit={this.createNewComment}>
          Your comment:
          <textarea required name="newComment" value={this.state.newComment} onChange={this.handleInputChange}></textarea>
          <button type="submit">Save it!</button>
        </form>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    visualizerChart: reduxState.visualizerChart,
    visualizerChartComments: reduxState.visualizerChartComments
  }
}

export default connect(mapStateToProps)(ChartVisualizer_Comments)
