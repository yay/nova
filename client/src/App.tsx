import React, { useState } from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';

import { AutoComplete, Row, Col } from 'antd';
import { Company, Quote } from "../../server/src/stock_i";

const { Option } = AutoComplete;

async function completeSymbol(part: string, max = 10): Promise<Company[]> {
    return fetch(`/api/symbol/complete/${part}/${max}`)
        .then(response => response.json());
}

// const quotes: OHLCV[] = await fetch(`/api/history/${data}`)
//     .then(response => response.json());

// https://ant.design/components/auto-complete/#components-auto-complete-demo-basic
export const Complete: React.FC<{ onSelect?: Function }> = (props) => {
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
    return (
        <>
            <Col style={{padding: '10px'}}>
                <Row>
                    <AutoComplete
                        value={value}
                        style={{ width: 200 }}
                        onSelect={onSelect}
                        onSearch={onSearch}
                        onChange={onChange}
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
                </Row>
            </Col>
        </>
    );
};

function App() {
  return (
    <div className="App">
        <Complete />
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
