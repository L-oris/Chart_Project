import React,{Component} from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

import {addTable,setTableUploaderIsVisible} from '../actions'


class TableUploader extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.uploadTable = this.uploadTable.bind(this)
  }

  handleInputChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  handleFileChange(e){
    this.setState({
      file:e.target.files[0]
    })
  }

  uploadTable(e){
    e.preventDefault()
    const {dispatch} = this.props
    const {name,description,file} = this.state
    if(name&&description&&file){
      //use built-in FormData API
      const formData = new FormData()
      formData.append('file',file)
      formData.append('name',name)
      formData.append('description',description)
      dispatch(addTable(formData))
      dispatch(setTableUploaderIsVisible())
    }
  }

  render(){
    const {dispatch} = this.props
    return (
      <div>
        Table Uploader here

        <p onClick={e=>dispatch(setTableUploaderIsVisible())}>
          X
        </p>


        <form onSubmit={this.uploadTable}>
          Name:
          <input required name="name" onChange={this.handleInputChange}/>
          Description:
          <textarea required name="description" onChange={this.handleInputChange}></textarea>
          Choose the table
          <input required type="file" onChange={this.handleFileChange}/>
          <button type="submit">Save it!</button>
        </form>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(TableUploader)
