import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Select, Label, Button } from 're-bulma';
import logo from './logo.svg';
import './App.css';
// import {Chart} from './Chart';


class NameForm extends React.Component {
  constructor ( props ) {
    super(props);
    this.state = {
      metrics: 'count',
      channel: 'all',
      product: 'all',
      yaxis: 'fico',
      xaxis: 'month',
      axis: [
        'month',
        'quarter',
        'year',
        'product',
        'channel',
        'fico',
        'income',
        'pre_loan_dti',
        'state',
        'loan_amount',
        'interest_rate',
        'apr',
        'internal_credit_score',
        'post_loan_dti',
        'loan_purpose',
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.transformData = this.transformData.bind(this);
  }

  transformData ( dataArr ) {
    console.log('what is dataArr', dataArr);
    const xaxisKey = `${this.state.xaxis}_group`;
    const yaxisKey = `${this.state.yaxis}_group`;

    const superMergedObject = dataArr.reduce(( current, next ) => {

      const xaxisValue = next[xaxisKey];
      const yaxisValue = next[yaxisKey];
      const metricValue = this.state.metrics;

      console.log('what is xaxisKey',xaxisKey)
      console.log('what is yaxisKey',yaxisKey)
      console.log('what is xaxisValue',xaxisValue)
      console.log('what is yaxisValue',yaxisValue)

      console.log('what is metricValue',metricValue)
      current[xaxisValue] = Object.assign({}, current[xaxisValue], {
        [yaxisValue]: next[metricValue]
      })
      return current;
    },{})
    console.log('what is superMergedObject', superMergedObject);
    const output = Object.keys(superMergedObject).reduce((current,next)=>{
      const obj =  Object.assign({}, superMergedObject[next],{
        [xaxisKey]:next
      });
      return [...current, obj]

    },[])
    console.log('what is output', output);
    return output
  }

  handleChange ( type ) {
    return ( event ) => {
      console.log(event.target.type);
      // if ( event.target.type !== 'text' ){
      //   this.handleSubmit(event)
      // }
      this.setState({
        [type]: event.target.value
      })


    }
  }

  handleSubmit ( event ) {
    const metrics = this.state.metrics;
    // debugger;
    let metricsParam = (metrics && typeof metrics === 'string' && metrics.length && metrics.indexOf(',') !== -1) ? `"${metrics.split(',').join('","').replace(/\s/g, '')}"` : `"${metrics}"`;
    // const baseEndPoint = 'http://localhost:8786/aggregations/applications/channel/all/product/all?limit=10000&xaxis=month&yaxis=fico&metric=[%22rejected%22,%22preapproved%22]&startdate=2016-01-01&enddate=2016-12-31';
    const baseEndPoint = `http://localhost:8786/aggregations/applications/channel/${this.state.channel}/product/${this.state.product}?limit=10000&xaxis=${this.state.xaxis}&yaxis=${this.state.yaxis}&startdate=2016-01-01&enddate=2016-12-30`;
    const newEndPoint = `${baseEndPoint}&metric=[${encodeURI(metricsParam)}]`
    console.log('what is newEndPoint', newEndPoint);


    fetch(newEndPoint,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    )
    .then(response => {
      return response.json();
    })
    .then(response2 => {
      // console.log('what is response2', response2);


      this.setState({
        dataItems: response2.size,
        dataGroup: this.transformData(response2.size)
      })
    })
    .catch(err => {
      console.log('what is error', err)
      // Error :(
    });

    event.preventDefault();
    return false;
  }

  render () {

    // const items = this.state.metrics.split(',');
    // items.push(this.state.yaxis);
    // console.log('what is isArray this.state.datas', Array.isArray(this.state.datas));
    console.log('what is this.state.dataItems', this.state.dataItems);
    return (
      <Container>


        <label>
          Product:
          <select value={this.state.product} onChange={this.handleChange('product')}>
            <option value="all">All</option>
            <option value="personal">Personal Loan</option>
            <option value="cosigner">Cosigner Loan</option>
          </select>
        </label>

        <label>
          Channel:
          <select value={this.state.channel} onChange={this.handleChange('channel')}>
            <option value="all">All</option>
            <option value="aggregator">Aggregator</option>
            <option value="direct">Direct</option>
            <option value="search">Search</option>
            <option value="social">Social Media</option>
          </select>
        </label>
        <label>
          Y-Axis:
          <select value={this.state.yaxis} onChange={this.handleChange('yaxis')}>
            {this.state.axis.map(( item, index ) => {
              return <option key={index} value={item}>{item}</option>;
            })}
          </select>
        </label>
        <label>
          X-Axis:
          <select value={this.state.xaxis} onChange={this.handleChange('xaxis')}>
            {this.state.axis.map(( item, index ) => {
              return <option key={index} value={item}>{item}</option>;
            })}
          </select>
        </label>

        <label>
          Metrics:
          <input type="text" value={this.state.metrics} onChange={this.handleChange('metrics')} />
        </label>
        <Button onClick={this.handleSubmit}>Click</Button>
        {/*<input type="submit" value="Submit" />*/}
        {/*</form>*/}

        <ResponsiveContainer width={1200} height={600}>
          <BarChart
            data={this.state.dataGroup
              ? this.state.dataGroup
              : []
            }
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis dataKey={this.state.xaxis} />
            {/*<XAxis/>*/}
            <YAxis />
            {/*<YAxis dateKey={this.state.yaxis}/>*/}
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            { (this.state.dataItems)
              ? this.state.dataItems.map(( data, index ) => {
              console.log('what is index',index);
                console.log('what is data', data);
                const xaxis = data[`${this.state.xaxis}_group`];
                const yaxis = data[`${this.state.yaxis}_group`]

                const random = Math.random();
                const first = 244;
                const second = Math.floor(37 + (7 * (index + 1)) * random)
                const third = Math.floor(33 + (9 * (index + 1)) * random)

                const rgbColor = (index % 2 == 1)
                  ? `rgb(${first},${second}, ${third})`
                  : `rgb(${second},${third}, ${first})`;


                return (
                  <Bar key={index} dataKey={yaxis} stackId={xaxis} fill={rgbColor} />
                )
              })
              : undefined
            }
          </BarChart>
        </ResponsiveContainer>
      </Container>
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
