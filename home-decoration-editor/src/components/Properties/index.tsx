import {useState} from 'react'

const Properties = () => {
    const [right, setRight] = useState(0);

    return (
        <div
            className="Properties"
            style={{right}}
        >
            Properties

            <div
                className="drawer-bar"
                onClick={() => {
                    setRight(right === 0 ? -300 : 0)
                }}
            ></div>
        </div>
    )
}

export default Properties;