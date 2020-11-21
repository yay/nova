import React, { useState } from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';

import { AutoComplete, Row, Col, List, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Company, Quote } from "../../server/src/stock_i";

const {Option} = AutoComplete;

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
        props.onSelect?.(data);
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
            style={{width: '100%'}}
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
                        <div style={{fontSize: '0.8em'}}>{company.name}</div>
                    </Option>
                ))
            }
        </AutoComplete>
    );
};

export const Watchlist: React.FC<{}> = (props) => {
    const [data, setData] = useState<Quote[]>([]);
    const onSelect = async (symbol: string) => {
        const data: Quote[] = await fetch(`/api/history/${symbol}`).then(response => response.json());
        setData(data);
    };
    return (
        <>
            <Col
                style={{width: '300px'}}
            >
                <SymbolComplete
                    onSelect={onSelect}
                />
                <List
                    bordered
                    dataSource={data}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <Row><span>{item.close}</span><Button shape="circle" icon={<SearchOutlined />} /></Row>
                            </List.Item>
                        );
                    }}
                />
            </Col>
        </>
    );
};

function App() {
    return (
        <div className="App">
            <Col style={{margin: '10px'}}>
                <Row>
                    <Watchlist/>
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
