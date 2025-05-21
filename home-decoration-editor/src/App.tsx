import { useState } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'
import Main from './components/Main'
import Properties from './components/Properties'
import './App.scss'

function App() {
    return (
        <div className='wrap'>
            <Header />

            <div className='editor'>
                <Menu />

                <Main />

                <Properties />
            </div>
        </div>
    )
}

export default App
