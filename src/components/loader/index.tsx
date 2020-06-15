import React from 'react'
import ReactDOM from 'react-dom'
import loader from '../../assets/images/load.gif'
import './index.css'

const Loader = () => (
  <div className="comp-load">
    <div className="comp-load-content">
      <img src={loader} alt="loading" />
    </div>
  </div>
)

class load {
  pool = 0
  finishFlag = true
  start() {
    this.pool += 1
    if (this.pool === 1) {
      setTimeout(() => {
        if (this.pool > 0) {
          this.open()
        }
      }, 200)
    }
  }
  close() {
    if (this.pool > 0) {
      this.pool = this.pool - 1
    }
    setTimeout(() => {
      if (this.pool === 0 && !this.finishFlag) {
        const el = document.getElementById('load')
        if (el) {
          ReactDOM.unmountComponentAtNode(el)
          this.finishFlag = true
        }
      }
    }, 100)
  }
  open() {
    if (this.finishFlag) {
      ReactDOM.render(<Loader />, document.getElementById('load'))
      this.finishFlag = false
    }
  }
}

export default new load()
