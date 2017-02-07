import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Select, Label, Button } from 're-bulma';
import logo from './logo.svg';
import './App.css';
// import {Chart} from './Chart';

const colors = [
  '#f4e542',
  '#f44242',
  '#42f48f',
  '#42f4eb',
  '#4277f4',
  '#f442f1',
  '#f4428f',
  '#f4426e',
  '#4c0315',
  '#37034c',
  '#03164c',
  '#034c2b',
  '#434c03',
  '#4c0903',
  '#272835',
  '#190e10',
]
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
    this.sortData = this.sortData.bind(this);
    this.handleKeyPress=this.handleKeyPress.bind(this);
    this.prefixTransformedData=this.prefixTransformedData.bind(this);
  }

  sortData ( dataArr ) {
    console.log('what is dataArr', dataArr);
    const yaxisKey = `${this.state.yaxis}_group`;
    const _parseNumber = ( item ) => item && item.split('-').length === 2 ? item.split('-')[0] : undefined;
    const _isEquality = ( item ) => (/</.test(item) || />=/.test(item)) ? true : false;
    const _parseEquality = ( item ) => {
      if ( /</.test(item) ){
        return -1
      }
      if ( />=/.test(item) ){
        return 1
      }
      return 0;
    }

    const hyphenatedArr = dataArr.filter(item => _parseNumber(item[yaxisKey]))
    .sort(( a, b ) => {
      const leftValue = a[yaxisKey];
      const rightValue = b[yaxisKey];
      const leftNumeric = _parseNumber(leftValue);
      const rightNumeric = _parseNumber(rightValue);
      if ( leftNumeric < rightNumeric ){
        return -1
      }
      if ( leftNumeric > rightNumeric ){
        return 1;
      }
      return 0;
    })
    const equalityArr = dataArr.filter(item => _isEquality(item[yaxisKey]))
    .sort(( a, b ) => {
      const leftEquality = _parseEquality(a[yaxisKey]);
      const rightEquality = _parseEquality(b[yaxisKey]);
      if ( leftEquality < rightEquality ){
        return -1
      }
      if ( leftEquality > rightEquality ){
        return 1;
      }
      return 0;
    })

    const stringArr = dataArr.filter(item => {
      return ['Missing', 'Invalid'].includes(item[yaxisKey])
    }).sort(( a, b ) => {
      if ( a === 'Invalid' ){
        return -1
      }
      if ( b === 'Invalid' ){
        return -1
      }

      return 0;

    })
    console.log('what is hyphenatedArr', hyphenatedArr)
    console.log('what is equalityArr', equalityArr);
    console.log('what is stringArr', stringArr);


    return equalityArr.length
      ? equalityArr.length === 2
        ? [...stringArr, equalityArr[0], ...hyphenatedArr, equalityArr[1]]
        : [...stringArr, ...hyphenatedArr, equalityArr.shift()]
      : dataArr.sort(( a, b ) => {

        if ( a[yaxisKey] < b[yaxisKey] ) return -1;
        if ( a[yaxisKey] > b[yaxisKey] ) return 1;
        return 0;
      })


  }

  transformData ( dataArr ) {

    console.log('what is dataArr', dataArr);

    const xaxisKey = `${this.state.xaxis}_group`;
    const yaxisKey = `${this.state.yaxis}_group`;

    console.log('what is xaxisKey', xaxisKey);
    console.log('what is yaxisKey', yaxisKey);

    const superMergedObject = dataArr.reduce(( current, next ) => {

      const xaxisValue = next[xaxisKey];
      const yaxisValue = next[yaxisKey];
      const metricValue = this.state.metrics;


      console.log('superMergedObject: xaxisValue', xaxisValue);
      console.log('superMergedObject: yaxisValue', yaxisValue);
      console.log(`superMergedObject: next[${metricValue}]`, next[metricValue])

      current[xaxisValue] = Object.assign({}, current[xaxisValue], {
        [yaxisValue]: next[metricValue]
      })
      return current;
    }, {})
    console.log('what is superMergedObject', superMergedObject);
    //transform object to array
    const output = Object.keys(superMergedObject).reduce(( current, next ) => {
      console.log('output: xaxisKey', xaxisKey);
      console.log('output: next', next);

      const obj = Object.assign({}, superMergedObject[next], {
        [xaxisKey]: next
      });
      console.log('output: what is current', current);
      return [...current, obj]

    }, [])
    console.log('what is output', output);
    return output
  }

  prefixTransformedData (dataArr){
    const xaxisKey = `${this.state.xaxis}_group`;
    const yaxisKey = `${this.state.yaxis}_group`;

    // first clone the object or suffer reference hell
    const newDataArr = dataArr.map(item=>Object.assign({},item));
    console.log('what is newDataArr', newDataArr);
    const prefixedData = newDataArr.map(data=>{
      return Object.keys(data).reduce((current,next)=>{
        console.log('prefixTransformedData: next', next)
        if(next ===xaxisKey){
          current[next]=data[next];
        } else {
          current[`${data[xaxisKey]}_${next}`] = data[next];
        }
        return current;
      },{})
    })
    console.log('what is prefixedData', prefixedData);
    return prefixedData
  }

  handleKeyPress(event){
    console.log('event.key', event.key);
    if(event.key ==='Enter'){
      this.handleSubmit(event);
    }
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
    const baseEndPoint = `http://localhost:8786/aggregations/applications/channel/${this.state.channel}/product/${this.state.product}?limit=10000&xaxis=${this.state.xaxis}&yaxis=${this.state.yaxis}&startdate=2016-01-01&enddate=2016-12-31`;
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

      const transformedData = this.transformData(response2.size);
      const prefixedTransformData = this.prefixTransformedData(transformedData);
      this.setState({
        // dataItems: this.sortData(response2.size),
        dataGroup: prefixedTransformData,
        dataItems: prefixedTransformData,

      })
    })
    .catch(err => {
      console.log('what is error', err.stack);

      // Error :(
    });

    event.preventDefault();
    return false;
  }

  render () {

    const xaxisKey = `${this.state.xaxis}_group`;
    const yaxisKey = `${this.state.yaxis}_group`;
    console.log("what is dataGroup", this.state.dataGroup);
    return (
      <Container onKeyPress={this.handleKeyPress}>


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

        <ResponsiveContainer width={1200} height={600}>
          <BarChart
            data={this.state.dataGroup
              ? this.state.dataGroup
              : []
            }
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis dataKey={xaxisKey} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            { (this.state.dataItems)
              ? this.state.dataItems.reduce(( current, data) => {

                console.log('what is data', data);
                const prefixedKey = `${yaxisKey}_`;
                const xaxis = `${yaxisKey}data[xaxisKey]`;

                {/*console.log('what is xaxis', xaxis);*/}
                {/*console.log('what is yaxis', yaxis);*/}
                // loop through the object
                const bars = Object.keys(data).reduce((c,n,index)=>{
                  {/*console.log('what is n', n)*/}
                  {/*console.log('what is index', index);*/}

                  const cleanKey = n.replace(prefixedKey,'');
                  {/*console.log('what is cleanedKey', cleanKey)*/}
                  {/*console.log('prefixedKey', prefixedKey)*/}
                  {/*const yaxis = data[n];*/}
                  //const yaxis = `${yaxisKey}_`
                  {/*console.log('what is xaxisKey', xaxisKey);*/}
                  {/*console.log('what is xaxis value', xaxis);*/}

                  {/*console.log('what is yaxisKey', yaxisKey);*/}
                  {/*console.log('what is yaxis value', yaxis);*/}
                  console.log('what is dataKey:stackId', n, xaxis);
                  {/*console.log('what is stackid', xaxis);*/}

                  if(n !==xaxisKey){
                    const bar = <Bar key={index + 1} dataKey={n} stackId={xaxis} fill={colors[index]} />

                    return [...c,bar]
                  } else {
                    console.log("hit else statement")
                    return c;
                  }

                },[])






                return [...current, ...bars];


              }, [])
              : []
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
