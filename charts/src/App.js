import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Select, Label, Button } from 're-bulma';
import logo from './logo.svg';
import './App.css';


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
      const excludes = ['count', 'month'];
      if ( !excludes.includes(next) ){
        current[month] = Object.assign({}, current[month], {
          id: month,
          [mergedObj[next]]: mergedObj.count
        })
      }

      return current;
    }, c)
    return c;
  }, {})
  return superMergedObject
  //transformed obj to array;
  // const outputObj = Object.keys(superMergedObject).reduce((current,next)=>{
  //   current.push(superMergedObject[next]);
  //   return current;
  //
  // },[])
  //
  // return outputObj
  //   const objMonth = Object.keys(data).reduce(( current, next, index ) => {
  //     const month = data['coordinates']['month'];
  //     console.log('what is month', month);
  //     if ( next === 'coordinates' ){
  //
  //       console.log('what is current1', current)
  //       Object.keys(data[next]).forEach(item => {
  //         console.log('what is item', item);
  //         console.log('what is data[next][item]', data[next][item]);
  //         // if ( item !== 'month' ){
  //         current = Object.assign({}, current, {
  //           // [month]:Object.assign({},current[month],{
  //           [item]: data[next][item]
  //           // })
  //         })
  //       })
  //     }
  //     else {
  //
  //       console.log('what is next', next);
  //       console.log('what is current2', current)
  //       current = Object.assign({}, current, {
  //         // [month]: Object.assign({}, current[month], {
  //         [next]: data[next]
  //         // })
  //       })
  //     }
  //     console.log('what is current', current);
  //     return current;
  //   }, {});
  //   console.log('what is objMonth', objMonth);
  //   return objMonth;
  // })
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
    const baseEndPoint = `http://localhost:8786/aggregations/applications/channel/${this.state.channel}/product/${this.state.product}?limit=10000&xaxis=${this.state.xaxis}&yaxis=${this.state.yaxis}&startdate=2016-11-01&enddate=2016-11-30`;
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

        <ResponsiveContainer width={1700} height={600}>
          <BarChart
            data={this.state.datas}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis dataKey={sortTransformedDataToArray(this.state.datas)} />
            {/*<XAxis/>*/}
            <YAxis />
            {/*<YAxis dateKey={this.state.yaxis}/>*/}
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            { this.state.datas
              ? this.state.datas.reduce(( current, next , index) => {

              console.log("what is next", next);


                const random = Math.random();
                const first = 244;
                const second = Math.floor(37 + (7 * (index + 1)) * random)
                const third = Math.floor(33 + (9 * (index + 1)) * random)

                const rgbColor = (index % 2 == 1)
                  ? `rgb(${first},${second}, ${third})`
                  : `rgb(${second},${third}, ${first})`;
                console.log('what is rgbColor', rgbColor);


                const bar = <Bar key={index} dataKey={next} stackId="a" fill={rgbColor} />
                current.push(bar);
                return current;





            },[])
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
