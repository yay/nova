import React, { useState } from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';

import { AutoComplete, Row, Col, List, Button, Slider } from 'antd';
import { Company, Quote } from "../../server/src/stock_i";
import { ReactChart } from './charts/react';
import { CartesianChartOptions } from './charts/chart/chartOptions';

const { Option } = AutoComplete;

async function completeSymbol(part: string, max = 10): Promise<Company[]> {
    return fetch(`/api/symbol/complete/${part}/${max}`)
        .then(response => response.json());
}

// const quotes: OHLCV[] = await fetch(`/api/history/${data}`)
//     .then(response => response.json());

// https://ant.design/components/auto-complete/#components-auto-complete-demo-basic
export const SymbolComplete: React.FC<{ onSelect?: Function }> = (props) => {
    const [value, setValue] = useState('');
    const [results, setResults] = useState<Company[]>([]);
    const onSearch = async (searchText: string) => {
        setResults(await completeSymbol(searchText));
    };
    const onSelect = async (data: string) => {
        props.onSelect && props.onSelect(data);
    };
    const onChange = (data: string) => {
        setValue(data.toUpperCase());
    };
    const onKeyUp = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            await onSelect(value);
        }
    };
    return (
        <AutoComplete
            style={{ width: '100%' }}
            value={value}
            onSelect={onSelect}
            onSearch={onSearch}
            onChange={onChange}
            onKeyUp={onKeyUp}
            placeholder="Company symbol"
        >
            {
                results.map(company => (
                    <Option key={company.symbol} value={company.symbol}>
                        <div><strong>{company.symbol}</strong></div>
                        <div style={{ fontSize: '0.8em' }}>{company.name}</div>
                    </Option>
                ))
            }
        </AutoComplete>
    );
};

export const Watchlist: React.FC<{}> = (props) => {
    const [data, setData] = useState<Quote[]>([]);
    const [width, setWidth] = useState(900);
    const onSelect = async (symbol: string) => {
        const data: Quote[] = await fetch(`/api/history/${symbol}`).then(response => response.json());
        setData(data);
    };
    function onWidthChange(value: number) {
        setWidth(value);
    }
    function onClick() {

    }
    return (
        <>
            <Col
                style={{ width: '100%', height: '600px' }}
            >
                <Row>
                    <SymbolComplete
                        onSelect={onSelect}
                    />
                    {/* <Button type="primary" onClick={onClick}>Click Me</Button> */}
                </Row>
                <Slider min={0} step={1} max={600} defaultValue={width} style={{ width: "500px" }} onChange={onWidthChange} />
                <ReactChart options={{
                    type: 'cartesian',
                    autoSize: false,
                    width,
                    data,
                    axes: [{
                        type: 'time',
                        position: 'bottom',
                        label: {
                            rotation: 45
                        }
                    }, {
                        type: 'number',
                        position: 'left'
                    }],
                    series: [{
                        type: 'ohlc',
                        dateKey: 'date',
                        closeKey: 'close'
                    }]
                }} />
                <List
                    bordered
                    dataSource={data}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <Row><span>{item.close}</span></Row>
                            </List.Item>
                        );
                    }}
                />
            </Col>
        </>
    );
};

function App() {
    const [width, setWidth] = useState(600);
    const onChange = (value: number) => {
        setWidth(value);
    };
    const [padding, setPadding] = useState(200);
    const onPaddingChange = (value: number) => {
        setPadding(value);
    };
    return (
        <div className="App">
            <Col style={{ margin: '10px', width: '800px' }}>
                <Row style={{ width: padding }}>
                    <Watchlist />
                    <Col>
                        {/* <Slider min={100} step={1} max={800} defaultValue={600} style={{ width: "500px" }} onChange={onChange} /> */}
                        <Slider min={0} step={1} max={600} defaultValue={padding} style={{ width: "500px" }} onChange={onPaddingChange} />
                        {/* <ReactChart options={{
                            type: 'cartesian',
                            autoSize: false,
                            width,
                            height: 300,
                            data: [{
                                x: 'Jan',
                                y: 10
                            }, {
                                x: 'Feb',
                                y: 20
                            }],
                            series: [{
                                type: 'line',
                                xKey: 'x',
                                yKey: 'y'
                            }]
                        }} /> */}
                    </Col>
                </Row>
            </Col>
            {/*<header className="App-header">*/}
            {/*  <img src={logo} className="App-logo" alt="logo" />*/}
            {/*  <p>*/}
            {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
            {/*  </p>*/}
            {/*  <a*/}
            {/*    className="App-link"*/}
            {/*    href="https://reactjs.org"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*  >*/}
            {/*    Learn React*/}
            {/*  </a>*/}
            {/*</header>*/}
        </div>
    );
}

export default App;
