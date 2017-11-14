import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import moment from 'moment'
import axios from 'axios'

import muiThemeable from 'material-ui/styles/muiThemeable';
import DateSquare from './DateSquare'
import './App.css'

const fetchQuery = `
query FetchShowtimes($id: ID!) {
  node(id: $id) {
    id
    ...on Event {
      showtimes {
        id
        timestamp
        remaining
      }
    }
  }
}
`

const createOrder = `
mutation CreateOrder ($input: CreateOrderInput){
  createOrder(input:$input){
    clientMutationId
    order {
      id
      tickets {
        id
        type
      }
      created
    }
    user {
      id
      name
    }
  }
}
`
const choices = ['1', '2', '3', '4', '5+']

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      quantity: 2,
      showtime: null,
      price: 1000,
      showtimes: []
    }
  }

  setQuantity (choice) {
    return () => this.setState({
      quantity: choice,
    })
  }

  setShowtime (choice) {
    return () => this.setState({
      showtime: choice,
    })
  }

  componentWillMount () {
    const handler = window.StripeCheckout.configure({
      key: 'pk_test_H47OVZI3S4bsjb2K5UWTuRX4',
      locale: 'auto',
      zipCode: true,
      // image: image,
      // name: title.text(),
      token: (token) => {
        const variables = {
          input: {
            clientMutationId: "1234",
            email: "sethtippetts@gmail.com",
            payment: {
              source: token.id,
              type: 'stripe'
            },
            items: [
              {
                sku: this.state.showtime.id,
                quantity: this.state.quantity
              }
            ]
          }
        }
        console.log('variables', variables)
        this.setState({ token })

        axios.post('http://localhost:5000/api/graphql', {
          query: createOrder,
          variables
        })
        .then(res => {
          console.log(res.data)
        })
        .catch(ex => {
          console.error(ex)
        })
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      },
    })

      // Close Checkout on page navigation:
    window.addEventListener('popstate', function () {
      handler.close()
    })
    this.setState({
      stripe: handler
    })
    axios
      .post('http://localhost:5000/api/graphql', {
        query: fetchQuery,
        variables: {
          id: this.props.event
        }
      }, {
        headers: {
          Authorization: 'Bearer _lfT8WlpAYZPtDwwhdX8Pw4vHWaqP0dU'
        }
      })
      .then(({ data }) => data)
      .then(({ data }) => {
        const showtimes = data.node.showtimes
          .map((showtime) => {
            showtime.date = moment(showtime.timestamp).format('dddd Do')
            showtime.time = moment(showtime.timestamp).format('h:mm a')
            console.log(showtime)
            return showtime
          })
        this.setState({ showtimes })
      })
      .catch(ex => {
        console.warn('graphql error', ex)
      })

  }

  checkout () {
    const { showtime, quantity, price } = this.state
    console.log(this.state)
    this.state.stripe.open({
      panelLabel: 'Buy ' + quantity + ' ' + (quantity > 1 ? 'tickets' : 'ticket') + ' for {{amount}}',
      description: showtime.date + ' ' + quantity + ' tickets at $' + price + '/ea',
      amount: price * quantity,
    })
  }

  render () {
    console.log('log width', document.width)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
        <div>
          <h3 style={{ color: this.props.muiTheme.palette.textColor, fontFamily: 'Roboto' }}>Choose number of tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {
              choices.map((choice, idx) => {
                return <RaisedButton
                  key={ choice }
                  label={ choice }
                  primary={ (this.state.quantity - 1) === idx }
                  onClick={ this.setQuantity(choice) }
                  style={{ width: '20%', minWidth: 0 }}
                />
              })
            }
          </div>
        </div>
        { this.state.quantity &&
          <div>
            <h3 style={{ color: this.props.muiTheme.palette.textColor, fontFamily: 'Roboto' }}>Choose date & time</h3>
            {
              Object
                .entries(toTable(this.state.showtimes))
                .map(([ day, showtime ]) => {
                  return (
                    <div
                      key={ day + showtime }
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        marginBottom: '15px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{
                        color: this.props.muiTheme.palette.textColor,
                        minWidth: '100px',
                        textAlign: 'right',
                        marginRight: '15px',
                        alignItems: 'center',
                        display: 'flex',
                      }}>
                        <DateSquare date={ showtime[0].timestamp } />
                      </div>
                      <div>
                        {
                          showtime.map((thing, idx) => {
                            return thing.time ?
                              <RaisedButton
                                key={ thing.time }
                                style={{ width: '20%' }}
                                label={ thing.time }
                                onClick={ this.setShowtime(thing) }
                                primary={ this.state.showtime === thing }
                              /> :
                              <FlatButton
                                key={ idx }
                                style={{ width: '20%' }}
                                disabled
                                label="-"
                              />
                          })
                        }
                      </div>
                    </div>
                  )
                })
            }
          </div>
        }
        {
          this.state.showtime &&
          <div>
            <RaisedButton
              onClick={ () => this.checkout() }
              primary
              label={ `Buy ${ this.state.quantity } tickets for $${ (this.state.quantity * this.state.price / 100).toFixed(2) }`}
              fullWidth
            />
          </div>
        }
      </div>
    )
  }
}

export default muiThemeable()(App)

function toTable (showtimes) {
  const possibleTimes = showtimes.reduce((prev, curr) => {
    if (!curr) return prev
    if (!prev.includes(curr.time)) {
      prev.push(curr.time)
    }
    return prev
  }, []).sort()

  const showdays = showtimes.reduce((prev, curr) => {
    if (!Array.isArray(prev[curr.date])) prev[curr.date] = []
    prev[curr.date].push(curr)
    return prev
  }, {})

  return Object.keys(showdays)
    .reduce((prev, day) => {
      const arr = new Array(possibleTimes.length).fill({})
      showdays[day].forEach((showtime) => {
        const idx = possibleTimes.indexOf(showtime.time)
        arr[idx] = showtime
      })

      prev[day] = arr

      return prev
    }, {})
}

  // var handler = StripeCheckout.configure({
  //   key: 'pk_test_H47OVZI3S4bsjb2K5UWTuRX4',
  //   locale: 'auto',
  //   zipCode: true,
  //   image: image,
  //   name: title.text(),
  //   token: function (token) {
  //   // You can access the token ID with `token.id`.
  //   // Get the token ID to your server-side code for use.
  //   },
  // })

  // handler.open({
  //   panelLabel: 'Buy ' + quantity + ' ' + (quantity > 1 ? 'tickets' : 'ticket') + ' for {{amount}}',
  //   description: el.data('date') + ' ' + quantity + ' tickets at $' + price + '/ea',
  //   amount: price * quantity * 100,
  // })

  //   // Close Checkout on page navigation:
  // window.addEventListener('popstate', function () {
  //   handler.close()
  // })

