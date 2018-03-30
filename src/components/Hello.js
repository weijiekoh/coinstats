import React from 'react'

const Hello = ({ greeting, sayHello }) => {
  return (
    <div>
      <p>Greeter</p>
      <button onClick={sayHello}>Say hello</button>
      { greeting && <p>Greeting: {greeting}</p> }
    </div>
  )
}

export default Hello
