import React, { Component } from 'react'
import moment from 'moment'

function DateSquare (props) {
  console.log('date square!!!', typeof props.date, props.date)
  const date = moment(props.date)

  return (
    <div style={ styles.container }>
      <div style={ styles.block }>
        <div style={ styles.month }>{ date.format('MMM') }</div>
        <div style={ styles.date }>{ date.date() }</div>
      </div>
      <div style={ styles.day }>{ date.format('dddd') }</div>
    </div>
  )
}

const styles = {
  container: {
    border: 'solid 3px #000',
    fontSize: '10px',
  },
  block: {
    padding: '1em',
    display: 'flex',
    width: '9em',
    height: '8em',
  },
  month: {
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    textTransform: 'uppercase',
    fontSize: '2em',
  },
  date: {
    fontSize: '6em',
    lineHeight: '1em',
  },
  day: {
    padding: '1em',
    backgroundColor: '#000',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '1.5em',
  },
}

export default DateSquare
