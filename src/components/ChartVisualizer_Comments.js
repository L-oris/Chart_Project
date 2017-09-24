import React,{Component} from 'react'
import {connect} from 'react-redux'


class ChartVisualizer_Comments extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderComments = this.renderComments.bind(this)
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

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    visualizerChartComments: reduxState.visualizerChartComments
  }
}

export default connect(mapStateToProps)(ChartVisualizer_Comments)
