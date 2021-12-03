import React, { Component } from "react";
import {retrieveString, storeString} from "./lib"

class App extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
    imageBase64: null
  };
 
  onLoadFromIPFS = async () => {
    const cid = this.inputNode.value;
    const image = await retrieveString(cid);
    this.setState({ imageBase64: image });
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const cid = await storeString(reader.result);
      console.log(cid);
      this.setState({ imageBase64: reader.result, cid });
    };
    reader.onerror = (error) => {
        console.log('Error: ', error);
    };
  }

  onFileUpload = () => {
    const formData = new FormData();

    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    this.getBase64(this.state.selectedFile)
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>

          <p>File Name: {this.state.selectedFile.name}</p>

          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  getImageData = () => {
    return (
      <div>
        { this.state.cid && <p>CID: {this.state.cid} </p> }
        { this.state.imageBase64 && 
          <p><img alt='your upload' src={this.state.imageBase64}></img></p>
        }
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>IPFS Demo For Encode Bootcamp</h1>
        <h3>File Upload using React and IPFS!</h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
        <h3>OR</h3>
        <div>
          <input type="input" ref={node => (this.inputNode = node)}/>
          <button onClick={this.onLoadFromIPFS}>Retrieve from IPFS!</button>
        </div>
        {this.fileData()}
        {this.getImageData()}
      </div>
    );
  }
}

export default App;
