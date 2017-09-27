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
          <img src={profilePicUrl} alt={first + ' ' + last}/>
          <aside>
            <h6>{first} {last}</h6>
            <p>{comment}</p>
          </aside>
        </li>
      )
    })
  }

  render(){
    const {visualizerChartComments,user} = this.props
    return (
      <div className="chart-comments">
        <h3>Comments</h3>

        <ul>
          {visualizerChartComments && this.renderComments(visualizerChartComments)}
        </ul>

        <form onSubmit={this.createNewComment}>
          <div className="chart-comments__new">
            <img src={user.profilePicUrl} alt={`${user.first} ${user.last}`}/>
            <textarea required name="newComment" value={this.state.newComment} onChange={this.handleInputChange}></textarea>
          </div>
          <button type="submit">Send it</button>
        </form>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    visualizerChart: reduxState.visualizerChart,
    visualizerChartComments: reduxState.visualizerChartComments,
    user: reduxState.user
  }
}

export default connect(mapStateToProps)(ChartVisualizer_Comments)
