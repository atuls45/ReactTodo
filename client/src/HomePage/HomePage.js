import React, { Component } from 'react';
import { FormArea, PostArea } from './post';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            //idTrack: ''
        };
        this.add = this.add.bind(this);
        this.modify = this.modify.bind(this);
        this.remove = this.remove.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.idTrack = '';
    }
    componentDidMount() {
        this.props.dispatch(userActions.getAll());
        fetch('/tasks')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    posts: (data.posts).reverse()
                });
                console.log('1111 here===');
            })
            .catch(err => console.log(err));
    }

    add() {
        if (this.idTrack === '') {
            fetch('/tasks', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    title: document.querySelector('input').value,
                    content: document.querySelector('textarea').value
                })
            })
                .then(res => res.json())
                .then(data => {
                    document.querySelector('input').value = '';
                    document.querySelector('textarea').value = '';
                    this.setState({
                        posts: (data.posts).reverse()
                    });
                })
                .catch(err => console.log(err));
        } else {
            fetch('/tasks', {
                method: 'put',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.idTrack,
                    title: document.querySelector('input').value,
                    content: document.querySelector('textarea').value
                })
            })
                .then(res => res.json())
                .then(data => {
                    document.querySelector('input').value = '';
                    document.querySelector('textarea').value = '';
                    this.idTrack = '';
                    this.setState({
                        posts: (data.posts).reverse(),
                    });
                })
                .catch(err => console.log(err));
        }

    }

    modify(e) {
        var extract = (this.state.posts).filter(x => x.id === e.target.id);
        console.log(extract[0].id);
        this.idTrack = extract[0].id;

        document.querySelector('input').value = extract[0].title;
        document.querySelector('textarea').value = extract[0].content;
    }

    changeStatus(e) {
        var extract = (this.state.posts).filter(x => x.id === e.target.id);
        console.log(extract[0]);
        this.idTrack = extract[0].id;
        fetch('/tasks', {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: this.idTrack,
                isDone: !extract[0].isDone
            })
        })
            .then(res => res.json())
            .then(data => {
                this.idTrack = '';
                this.setState({
                    posts: (data.posts).reverse(),
                });
            })
            .catch(err => console.log(err));
    }

    remove(e) {
        fetch('/tasks', {
            method: 'delete',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.id
            })
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    posts: (data.posts).reverse(),
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { user, users } = this.props;
        console.log('user here==', user);
        console.log('users here==', users);
        return (
            <div>
                <FormArea add={this.add} />
                <PostArea posts={this.state.posts} modify={this.modify} remove={this.remove} changeStatus={this.changeStatus} />
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };

// export default App;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';

// import { userActions } from '../_actions';

// class HomePage extends React.Component {
//     componentDidMount() {
//         this.props.dispatch(userActions.getAll());
//     }

//     handleDeleteUser(id) {
//         return (e) => this.props.dispatch(userActions.delete(id));
//     }

//     render() {
//         const { user, users } = this.props;
//         return (
//             <div className="col-md-6 col-md-offset-3">
//                 <h1>Hi {user.firstName}!</h1>
//                 <p>You're logged in with React!!</p>
//                 <h3>All tasks assigned to you:</h3>
//                 {users.loading && <em>Loading users...</em>}
//                 {users.error && <span className="text-danger">ERROR: {users.error}</span>}
//                 {users.items &&
//                     <ul>
//                         {users.items.map((user, index) =>
//                             <li key={user.id}>
//                                 {user.firstName + ' ' + user.lastName}
//                                 {
//                                     user.deleting ? <em> - Deleting...</em>
//                                     : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
//                                     : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
//                                 }
//                             </li>
//                         )}
//                     </ul>
//                 }
//                 <p>
//                     <Link to="/login">Logout</Link>
//                 </p>
//             </div>
//         );
//     }
// }

// function mapStateToProps(state) {
//     const { users, authentication } = state;
//     const { user } = authentication;
//     return {
//         user,
//         users
//     };
// }

// const connectedHomePage = connect(mapStateToProps)(HomePage);
// export { connectedHomePage as HomePage };