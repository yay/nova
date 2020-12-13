import { Component, createElement, createRef, RefObject } from "react";
import * as PropTypes from "prop-types";
import { ChartOptions } from "./chart/chartOptions";
import { Chart } from "./chart/chart";
import { ChartFactory } from "./chart/chartFactory";

export interface ChartProps {
    options: ChartOptions;
}

interface ChartState {
}

export class ReactChart extends Component<ChartProps, ChartState> {
    static propTypes: any;

    private chart!: Chart;

    protected chartRef: RefObject<HTMLElement>;

    constructor(public props: any) {
        super(props);
        this.chartRef = createRef();
    }

    render() {
        return createElement<any>('div', {
            style: this.createStyleForDiv(),
            ref: this.chartRef
        });
    }

    createStyleForDiv() {
        return {
            height: "100%",
            ...this.props.containerStyle
        };
    }

    componentDidMount() {
        const options = this.applyContainerIfNotSet(this.props.options);
        this.chart = ChartFactory.create(options);
    }

    private applyContainerIfNotSet(propsOptions: any) {
        if (propsOptions.container) {
            return propsOptions;
        }

        return { ...propsOptions, container: this.chartRef.current };
    }

    shouldComponentUpdate(nextProps: any) {
        this.processPropsChanges(this.props, nextProps);

        // We want full control of the DOM, as charts don't use React internally,
        // so for performance reasons we tell React we don't need 'render' called
        // on property changes.
        return false;
    }

    processPropsChanges(prevProps: any, nextProps: any) {
        ChartFactory.update(this.chart, this.applyContainerIfNotSet(nextProps.options));
    }

    componentWillUnmount() {
        this.chart.destroy();
    }
}

ReactChart.propTypes = {
    options: PropTypes.object
};

