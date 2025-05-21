import { useState } from "react"

const Menu = () => {
    const [left, setLeft] = useState(0)

    return (
        <div 
            className="Menu"
            style={{left: left}}
        >
            Menu

            <div
                className="drawer-bar"
                onClick={() => {
                    setLeft(left === 0 ? -300 : 0)
                }}
            ></div>
        </div>
    )
}

export default Menu;
