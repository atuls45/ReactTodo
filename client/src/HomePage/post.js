import React, { Component } from 'react';

function FormArea(props) {
    return (
        <div style={{padding: 15}}>
            <h1>To-Do List</h1>
            <input type="text" placeholder="Title" style={{width: 300}} /><br/><br/>
            <textarea placeholder="What to do" style={{height: 200, width: 300}}></textarea><br/><br/>
            <button style={{width: 70}} onClick={props.add}>Add</button>
        </div>
    );
}

class PostArea extends Component {

    render() {
        const bor = {
            border: '1px solid #000',
            padding: '10px'
        };
        console.log('this.props.posts')
        return (
            <div style={{padding: 15}}>
                <hr/>
                <h1>Lists of What To Do</h1>
                {(this.props.posts).map((x, i) => {
                    return <div style={bor} key={i}>
                        <h2>{x.title}</h2>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{x.content}</p>
                        <label>
                            Is Done: <input id={x.id}
                                name="isGoing"
                                type="checkbox"
                                checked={x.isDone}
                                onChange={this.props.changeStatus} />
                        </label> <br/>
                        <button id={x.id} onClick={this.props.modify}>Modify</button>
                        <button id={x.id} onClick={this.props.remove}>Delete</button>
                    </div>
                })}
            </div>
        );
    }
}

export { 
    FormArea,
    PostArea
};