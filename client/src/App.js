import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      listMembers: '',
      msg: '',
      firstname: '',
      lastname: '',
      email: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, name) {
    this.setState({ [name]: e.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch("/api/addMember", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({firstname: this.state.firstname , lastname: this.state.lastname , email: this.state.email})
              })
            .then(function(data) {
            alert('Success')
           })
       .catch(function(error) {
           alert('Failed')
         });
  }

  getMembers = () => {
    fetch("/api/memberList")
    .then((res) => {
      return res.json();
    }).then( (json) => {
      this.setState({
        listMembers: json.members
      });
    })
    .catch((err) => {
      console.log("error", err);
    });
  }

  addMember = () => {
    fetch("/api/addMember")
    .then((res) => {
      return res.json();
    }).then( (json) => {
      this.setState({
        listMembers: json.members
      });
    })
    .catch((err) => {
      console.log("error", err);
    });
  }

  testApiCall = () => {
    fetch("/api/genericCall")
    .then((res) => {
      return res.json();
    }).then ( (json) => {
      this.setState({
        msg: json.msg
      });
    })
  }

  render() {
    let mailingList;
    let members = this.state.listMembers;
    if (this.state.listMembers) {
      mailingList = <div>
                      <ul>
                        {
                          members.map((member, index) =>
                            <li key={index}>{`${member.email_address}`}</li>
                            )
                         }
                      </ul>
                  </div>
      
    } 
    return (
      <div>
            <div>
              <h1>Mailing List Members</h1>
              {mailingList}
              <button onClick={this.addMember}>Get Members</button>
              <hr/>
              <button onClick={this.testApiCall}>Test Api Call</button>
              <h1>{this.state.msg}</h1>
            </div>

        <div>
          <form onSubmit={this.handleSubmit}>
              <label>
                First Name:
                <input type="text" value={this.state.firstname} onChange={ (e) => this.handleChange(e, 'firstname') }  />
              </label>

              <label>
                Last Name:
                <input type="text" value={this.state.lastname} onChange={(e) => this.handleChange(e, 'lastname') } />
              </label>

              <label>
                Email:
                <input type="text" value={this.state.email} onChange={(e) => this.handleChange(e, 'email') } />
              </label>

              <input type="submit" value="Submit" />
            </form>
        </div>
      </div>
    );
  }
}

export default App;
