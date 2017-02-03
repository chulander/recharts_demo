import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import logo from './logo.svg';
import './App.css';







const transformData = ( dataArr ) => {
  return dataArr.map(data => {

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

const sortTransformedData = function(transformedData){


}

class NameForm extends React.Component {
  constructor ( props ) {
    super(props);
    this.state = {
      metrics: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange ( event ) {
    this.setState({metrics: event.target.value});
    // this.setState({
    //   datas:datas
    // })
  }

  handleSubmit ( event ) {
    const metrics = this.state.metrics;
    let metricsParam = (metrics && typeof metrics ==='string' && metrics.length) ? `"${metrics.split(',').join('","').replace(/\s/g,'')}"` : `"all"`;
    // const baseEndPoint = 'http://localhost:8786/aggregations/applications/channel/all/product/all?limit=10000&xaxis=month&yaxis=fico&metric=[%22rejected%22,%22preapproved%22]&startdate=2016-01-01&enddate=2016-12-31';
    const baseEndPoint = `http://localhost:8786/aggregations/applications/channel/all/product/all?limit=10000&xaxis=month&yaxis=fico&startdate=2016-01-01&enddate=2016-12-31`;
    const newEndPoint = `${baseEndPoint}&metric=[${encodeURI(metricsParam)}]`
    console.log('what is newEndPoint', newEndPoint);
    fetch(newEndPoint, {
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
      const arr = transformData(response2.size);
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
              Metrics:
              <input type="text" value={this.state.metrics} onChange={this.handleChange}/>
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
              {this.state.metrics.split(',').map((item,index)=>{
                const random = Math.random();
                {/*const first = Math.floor(77+(3*(index+1)) * random)*/}
                const first = 244;
                const second = Math.floor(37+(7*(index+1)) * random)
                const third = Math.floor(33+(9*(index+1)) * random)
                {/*const third = 217;*/}
                const rgbColor = (index%2==1)
                  ? `rgb(${first},${second}, ${third})`
                  : `rgb(${second},${third}, ${first})`;
                console.log('what is rgbColor', rgbColor)
                return (
                  <Bar key={index} dataKey={item.trim()} stackId="a" fill={rgbColor} />
                )

              })}
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
