
import { useEffect } from 'react';
import Menu from './components/Menu';
import Main from './components/Main';
import Properties from './components/Properties';
import { MeshTypes, useThreeStore } from './store';

import './App.scss'


function App() {
    const { data, addMesh } = useThreeStore();


    return <div className='wrap'>

        <Menu />
        
        <div className='editor'>
            <Main />

            <Properties />
        </div>
    </div>
}

export default App
