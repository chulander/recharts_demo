import React, { Component } from 'react';
// import {Bar} from 'react-chartjs-2';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Select, Label, Button } from 're-bulma';


class Chart extends React.Component {
  constructor ( props ) {
    super(props);
    this.state = Object.assign({}, props)

  }


  render () {

    return (
      <ResponsiveContainer width={1200} height={600}>
        <BarChart
          data={props.datas}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis dataKey={this.state.xaxis} />

          <YAxis />
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

                if ( n !== 'month' && !/2016/g.test(n) ){
                  console.log('what is n', n);
                  console.log('what is typeof n', typeof n);
                  const random = Math.random();
                  const first = 244;
                  const second = Math.floor(37 + (7 * (index + 1)) * random)
                  const third = Math.floor(33 + (9 * (index + 1)) * random)

                  const rgbColor = (index % 2 == 1)
                    ? `rgb(${first},${second}, ${third})`
                    : `rgb(${second},${third}, ${first})`;
                  {/*console.log('what is rgbColor', rgbColor);*/
                  }


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
    );
  }
}


export default Chart;
