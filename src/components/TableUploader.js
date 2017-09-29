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
      <div className="table-uploader">

        <div className="table-uploader__overlay"></div>

        <section>
          <p className="close-btn" onClick={e=>dispatch(setTableUploaderIsVisible())}>
            X
          </p>

          <form onSubmit={this.uploadTable}>

            <div className="table-uploader__field">
              <h6>Name</h6>
              <input required name="name" onChange={this.handleInputChange}/>
            </div>

            <div className="table-uploader__field">
              <h6>Description</h6>
              <textarea required name="description" onChange={this.handleInputChange}></textarea>
            </div>

            <input required type="file" id="table-uploader--file" onChange={this.handleFileChange}/>
            <label htmlFor="table-uploader--file">Select a table</label>

            <button type="submit">Upload</button>
          </form>
        </section>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(TableUploader)
