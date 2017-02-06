import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Select, Label, Button } from 're-bulma';
import logo from './logo.svg';
import './App.css';
import {Chart} from './Chart';


const transformData = ( dataArr ) => {
  console.log('what is dataArr', dataArr);

  const superMergedObject = dataArr.reduce(( c, data ) => {
    const dataIds = data._id;

    const mergedObj = Object.assign({}, Object.keys(data).reduce(( current, next ) => {
      if ( typeof data[next] !== 'object' ){

        current[next] = data[next];

      }

      return current;
    }, {}), dataIds);
    console.log('what is mergedObj', mergedObj);

    const month = mergedObj.month;
    return Object.keys(mergedObj).reduce(( current, next, index ) => {
      //first thing is to merge object
      const excludes = ['count', 'id'];
      if ( !excludes.includes(next) ){
        current[month] = Object.assign({}, current[month], {
          month: month,
          [mergedObj[next]]: mergedObj.count
        })
      }

      return current;
    }, c)
    return c;
  }, {})
  return superMergedObject

}

const sortTransformedDataToArray = function ( datas ) {
  return (typeof datas === 'object')
    ? Object.keys(datas).reduce(( current, next ) => {
      const monthObj = datas[next];
      return [...current, monthObj]
    }, [])
    : undefined
}

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
  }

  handleChange ( type ) {
    return ( event ) => {
      console.log(event.target.type);
      if(event.target.type !=='text'){
        this.handleSubmit(event)
      }
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
      console.log('what is response2', response2);
      const arr = transformData(response2.size);
      console.log('what is arr', arr)
      // const arr = response2.size;

      this.setState({ datas: arr })
    })
    .catch(err => {
      console.log('what is error', err)
      // Error :(
    });

    event.preventDefault();
    return false;
  }

  render () {

    const items = this.state.metrics.split(',');
    // items.push(this.state.yaxis);
    console.log('what is isArray this.state.datas', Array.isArray(this.state.datas));
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
            data={this.state.datas
              ? sortTransformedDataToArray(this.state.datas)
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
            { (this.state.datas)
              ? Object.keys(this.state.datas).reduce(( current, next, counter ) => {
                console.log('what is counter', counter);
                const data = this.state.datas[next];
                console.log("what is next", next);
                console.log("what is data", data);
                const month = data[this.state.xaxis];
                console.log('what is month', month);
                const chartArr = Object.keys(data).reduce(( c, n, index ) => {

                  if(n!=='month' && !/2016/g.test(n)){
                    console.log('what is n', n);
                    console.log('what is typeof n', typeof n);
                    const random = Math.random();
                    const first = 244;
                    const second = Math.floor(37 + (7 * (index + 1)) * random)
                    const third = Math.floor(33 + (9 * (index + 1)) * random)

                    const rgbColor = (index % 2 == 1)
                      ? `rgb(${first},${second}, ${third})`
                      : `rgb(${second},${third}, ${first})`;
                    {/*console.log('what is rgbColor', rgbColor);*/}


                    const bar = <Bar key={index} dataKey={n} stackId={month} fill={rgbColor} />
                    c.push(bar);
                  }

                  return c;
                }, [])
                console.log('what is charArr', chartArr);

                return [...chartArr];
              }, [])
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
