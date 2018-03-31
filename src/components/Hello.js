import React from 'react'

const Hello = props => {
  return (
    <div>
      <h1>Greeter</h1>
      <button onClick={props.sayHello}>Say hello</button>

      <br />
      <br />

      <button onClick={props.fetchGreeting}>Fetch greeting</button>
      <br />

      <br />
      <br />

      {props.isFetching &&
        <p>Fetching...</p>
      }
      {!props.isFetching &&
        <p>
          Greeting: { props.greeting && props.greeting }
        </p>
      }
    </div>
  )
}

export default Hello
