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

    constructor(public props: ChartProps) {
        super(props);
        this.chartRef = createRef();
    }

    render() {
        return createElement('div', {
            ref: this.chartRef
        });
    }

    private layoutDone = true;

    componentDidMount() {
        this.chart = ChartFactory.create(this.setContainerIfNotSet(this.props.options));
        this.chart.addEventListener('layoutDone', () => this.layoutDone = true);
    }

    private setContainerIfNotSet(chartOptions: ChartOptions) {
        if (chartOptions.container) {
            return chartOptions;
        }

        return { ...chartOptions, container: this.chartRef.current };
    }

    shouldComponentUpdate(nextProps: ChartProps): boolean {
        this.processPropsChanges(this.props, nextProps);
        // We want full control of the DOM, as charts don't use React internally,
        // so for performance reasons we tell React we don't need 'render' called
        // on property changes.
        return false;
    }

    processPropsChanges(prevProps: ChartProps, nextProps: ChartProps) {
        if (this.layoutDone) {
            ChartFactory.update(this.chart, this.setContainerIfNotSet(nextProps.options));
            this.layoutDone = false;
        }
    }

    componentWillUnmount() {
        this.chart.destroy();
    }
}

ReactChart.propTypes = {
    options: PropTypes.object
};

