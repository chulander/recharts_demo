import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import logo from './logo.svg';
import './App.css';


let testData = {
  "coordinates": [
    {
      "month": "2016-11",
      "fico": "Missing"
    },
    {
      "month": "2016-11",
      "fico": "700-719"
    },
    {
      "month": "2016-11",
      "fico": "780-799"
    },
    {
      "month": "2016-11",
      "fico": "<580"
    },
    {
      "month": "2016-11",
      "fico": "760-779"
    },
    {
      "month": "2016-11",
      "fico": "580-599"
    },
    {
      "month": "2016-11",
      "fico": "720-739"
    },
    {
      "month": "2016-11",
      "fico": "640-659"
    },
    {
      "month": "2016-11",
      "fico": ">=800"
    },
    {
      "month": "2016-11",
      "fico": "740-759"
    },
    {
      "month": "2016-11",
      "fico": "620-639"
    },
    {
      "month": "2016-11",
      "fico": "680-699"
    },
    {
      "month": "2016-11",
      "fico": "600-619"
    },
    {
      "month": "2016-11",
      "fico": "660-679"
    }
  ],
  "rejected": [
    182,
    118,
    27,
    447,
    55,
    260,
    98,
    229,
    54,
    65,
    244,
    193,
    244,
    185
  ]
}

// let newTestData = testData.reduce((current,next)=>{
//
// })


let datas = testData.coordinates

// console.log('what is datas', datas);


const dataTransform = ( dataArr ) => {
  return dataArr.map(data => {

    //start with transforming coordindates;

    // now handle the non-coordinate props

    const objMonth = Object.keys(data).reduce(( current, next, index ) => {
      const month = data['coordinates']['month'];
      console.log('what is month', month);
      if (next==='coordinates'){

        console.log('what is current1', current)
          Object.keys(data[next]).forEach(item => {
            console.log('what is item', item);
            console.log('what is data[next][item]', data[next][item]);
            // if ( item !== 'month' ){
            current = Object.assign({}, current, {
              // [month]:Object.assign({},current[month],{
                [item]: data[next][item]
              // })
            })
          })
      } else {

        console.log('what is next', next);
        console.log('what is current2', current)
        current = Object.assign({}, current, {
          // [month]: Object.assign({}, current[month], {
            [next]: data[next]
          // })
        })
      }
      console.log('what is current', current);
      return current;
    }, {});
    console.log('what is objMonth', objMonth);
    return objMonth;
  })
}

class NameForm extends React.Component {
  constructor ( props ) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange ( event ) {
    // this.setState({value: event.target.value});
    // this.setState({
    //   datas:datas
    // })
  }

  handleSubmit ( event ) {

    fetch('http://localhost:8786/aggregations/applications/channel/all/product/all?limit=10000&xaxis=month&yaxis=fico&metric=[%22rejected%22,%22preapproved%22]&startdate=2016-01-01&enddate=2016-12-31', {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      return response.json();
    })
    .then(response2 => {
      console.log('what is response2', response2);
      const arr = dataTransform(response2.size);
      console.log('what is arr', arr)
      this.setState({ datas: arr })
    })
    .catch(err => {
      console.log('what is error', err)
      // Error :(
    });
    event.preventDefault();
  }

  render () {
    return (
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.value} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <ResponsiveContainer width={1200} height={600}>
            <BarChart
              data={this.state.datas}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="fico" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="rejected" stackId="a" fill="#8884d8" />
              <Bar dataKey="preapproved" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    );
  }
}

class App extends Component {
  render () {
    return (
      <div className="App">
        <NameForm />
      </div>
    );
  }
}

export default App;
