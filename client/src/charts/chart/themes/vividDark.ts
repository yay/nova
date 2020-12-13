import { DarkTheme } from "./darkTheme";
import { ChartThemePalette } from "../chartOptions";

const palette: ChartThemePalette = {
    fills: [
        '#5BC0EB',
        '#FDE74C',
        '#9BC53D',
        '#E55934',
        '#FA7921',
        '#fa3081'
    ],
    strokes: [
        '#4086a4',
        '#b1a235',
        '#6c8a2b',
        '#a03e24',
        '#af5517',
        '#af225a'
    ]
};

export class VividDark extends DarkTheme {
    protected getPalette(): ChartThemePalette {
        return palette;
    }
}