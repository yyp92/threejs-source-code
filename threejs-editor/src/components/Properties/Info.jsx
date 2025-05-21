import {useEffect} from 'react'
import { ColorPicker, Form, Input } from "antd";
import { useThreeStore } from "../../store";


const Info = () => {
    const {
        selectedObj,
        updateMaterial
    } = useThreeStore();

    const [form] = Form.useForm()

    useEffect(() => {
        if (selectedObj?.isMesh) {
            form.setFieldValue('color', selectedObj.material.color.getHexString())
        }
    }, [selectedObj])


    function handleValuesChange(changeValues) {
        const colorStr = changeValues.color.toHexString();

        updateMaterial(selectedObj.name, {
            color: colorStr.length > 6
                ? colorStr.slice(0, 7)
                : colorStr
        });
    }


    return (
        <div
            className='Info'
            style={{
                margin: 20
            }}
        >
            {
                selectedObj?.isMesh
                    ?
                        <Form
                            form={form}
                            initialValues={{
                                color: selectedObj.material.color.getHexString()
                            }}
                            onValuesChange={handleValuesChange}
                        >
                            <Form.Item
                                label="材质颜色"
                                name="color"
                            >
                                <ColorPicker/>
                            </Form.Item>
                        </Form>
                    : null
            }
        </div>
    )
}

export default Info;
