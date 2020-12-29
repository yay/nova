import { OHLCSeriesMarker } from "./series/cartesian/ohlc/ohlcSeries";
import { ChartTheme } from "./themes/chartTheme";

type FontStyle = 'normal' | 'italic' | 'oblique';
type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter'
    | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ChartThemeName = 'default' | 'default-dark'
    | 'material' | 'material-dark'
    | 'pastel' | 'pastel-dark'
    | 'solar' | 'solar-dark'
    | 'vivid' | 'vivid-dark';

export interface ChartThemePalette {
    fills: string[];
    strokes: string[];
}

export interface ChartThemeOptions {
    palette?: ChartThemePalette;
    overrides?: ChartThemeOverrides;
}

export interface DerivedChartThemeOptions extends ChartThemeOptions {
    baseTheme?: ChartThemeName | ChartTheme;
}

export interface ChartThemeOverrides {
    cartesian?: CartesianChartOptions<CartesianAxesTheme, CartesianSeriesTheme>;
    column?: CartesianChartOptions<CartesianAxesTheme, BarSeriesOptions>;
    bar?: CartesianChartOptions<CartesianAxesTheme, BarSeriesOptions>;
    line?: CartesianChartOptions<CartesianAxesTheme, LineSeriesOptions>;
    area?: CartesianChartOptions<CartesianAxesTheme, AreaSeriesOptions>;
    scatter?: CartesianChartOptions<CartesianAxesTheme, ScatterSeriesOptions>;
    histogram?: CartesianChartOptions<CartesianAxesTheme, HistogramSeriesOptions>;

    polar?: PolarChartOptions<PolarAxesTheme, PolarSeriesTheme>;
    pie?: PolarChartOptions<PolarAxesTheme, PieSeriesOptions>;

    common?: any;
}

export interface CartesianAxesTheme {
    number?: Omit<NumberAxisOptions, 'type'>;
    category?: Omit<CategoryAxisOptions, 'type'>;
    groupedCategory?: Omit<GroupedCategoryAxisOptions, 'type'>;
    time?: Omit<TimeAxisOptions, 'type'>;
}

export interface CartesianSeriesTheme {
    line?: LineSeriesOptions;
    scatter?: ScatterSeriesOptions;
    area?: AreaSeriesOptions;
    bar?: BarSeriesOptions;
    column?: BarSeriesOptions;
    histogram?: HistogramSeriesOptions;
}

export interface PolarAxesTheme {
    // polar charts don't support axes at the moment
    // (used by radar charts, for example)
}

export interface PolarSeriesTheme {
    pie?: PieSeriesOptions;
}

export interface ChartPaddingOptions {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

interface ChartLabelOptions {
    enabled?: boolean;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}

interface DropShadowOptions {
    enabled?: boolean;
    color?: string;
    xOffset?: number;
    yOffset?: number;
    blue?: number;
}

export interface ChartCaptionOptions {
    enabled?: boolean;
    padding?: ChartPaddingOptions;
    text?: string;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}

interface NavigatorMaskOptions {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fillOpacity?: number;
}

interface NavigatorHandleOptions {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    width?: number;
    height?: number;
    gripLineGap?: number;
    gripLineLength?: number;
}

export interface NavigatorOptions {
    enabled?: boolean;
    height?: number;
    margin?: number;
    min?: number;
    max?: number;
    mask?: NavigatorMaskOptions;
    minHandle?: NavigatorHandleOptions;
    maxHandle?: NavigatorHandleOptions;
}

type ChartLegendPosition = 'top' | 'right' | 'bottom' | 'left';

interface ChartLegendMarkerOptions {
    size?: number;
    shape?: string | (new () => any); // Remove the (new () => any) eventually.
    padding?: number;
    strokeWidth?: number;
}

interface ChartLegendLabelOptions {
    color?: string;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize?: number;
    fontFamily?: string;
}

interface ChartLegendItemOptions {
    marker?: ChartLegendMarkerOptions;
    label?: ChartLegendLabelOptions;
    paddingX?: number;
    paddingY?: number;
}

export interface ChartLegendOptions {
    enabled?: boolean;
    position?: ChartLegendPosition;
    spacing?: number;
    item?: ChartLegendItemOptions;
}

interface ChartTooltipOptions {
    enabled?: boolean;
    class?: string;
    tracking?: boolean;
    delay?: number;
}

interface BaseChartOptions {
    container?: HTMLElement | null;
    data?: any[];
    width?: number;
    height?: number;
    autoSize?: boolean;
    padding?: ChartPaddingOptions;
    background?: {
        visible?: boolean;
        fill?: string;
    },
    title?: ChartCaptionOptions;
    subtitle?: ChartCaptionOptions;
    tooltip?: ChartTooltipOptions;
    navigator?: NavigatorOptions;
    legend?: ChartLegendOptions;
    listeners?: { [key in string]: Function };
    theme?: string | ChartTheme | DerivedChartThemeOptions;
}

interface BaseAxisOptions {
    keys?: string[];
}

type CartesianAxisPosition = 'top' | 'right' | 'bottom' | 'left';

interface AxisLineOptions {
    width?: number;
    color?: string;
}

interface AxisTickOptions {
    width?: number;
    size?: number;
    color?: string;
    count?: any;
}

interface AxisLabelFormatterParams {
    readonly value: any;
    readonly index: number;
    readonly fractionDigits?: number;
    readonly formatter?: (x: any) => string;
}

interface AxisLabelOptions {
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize?: number;
    fontFamily?: string;
    padding?: number;
    color?: string;
    rotation?: number;
    // mirrored?: boolean;
    // parallel?: boolean;
    format?: string;
    formatter?: (params: AxisLabelFormatterParams) => string;
}

interface AxisGridStyle {
    stroke?: string;
    lineDash?: number[];
}

interface BaseCartesianAxisOptions extends BaseAxisOptions {
    position?: CartesianAxisPosition;
    title?: ChartCaptionOptions;
    line?: AxisLineOptions;
    tick?: AxisTickOptions;
    label?: AxisLabelOptions;
    gridStyle?: AxisGridStyle[];
}

interface NumberAxisOptions extends BaseCartesianAxisOptions {
    type: 'number';
    nice?: boolean;
    min?: number;
    max?: number;
}

interface CategoryAxisOptions extends BaseCartesianAxisOptions {
    type: 'category';
    paddingInner?: number;
    paddingOuter?: number;
}

interface GroupedCategoryAxisOptions extends BaseCartesianAxisOptions {
    type: 'groupedCategory';
}

interface TimeAxisOptions extends BaseCartesianAxisOptions {
    type: 'time';
    nice?: boolean;
}

export type CartesianAxisOptions =
    NumberAxisOptions |
    CategoryAxisOptions |
    GroupedCategoryAxisOptions |
    TimeAxisOptions;

type PolarAxisOptions = any;

interface BaseSeriesOptions {
    data?: any[];
    visible?: boolean;
    showInLegend?: boolean;
    listeners?: { [key in string]: Function };
}

export interface TooltipRendererResult {
    title?: string;
    content?: string;
}

interface SeriesTooltipRendererParams {
    readonly datum: any;
    readonly title?: string;
    readonly color?: string;
}

interface CartesianSeriesTooltipRendererParams extends SeriesTooltipRendererParams {
    readonly xKey: string;
    readonly xValue?: any;
    readonly xName?: string;

    readonly yKey: string;
    readonly yValue?: any;
    readonly yName?: string;
}

export interface PolarSeriesTooltipRendererParams extends SeriesTooltipRendererParams {
    readonly angleKey: string;
    readonly angleValue?: any;
    readonly angleName?: string;

    readonly radiusKey?: string;
    readonly radiusValue?: any;
    readonly radiusName?: string;
}

interface ScatterSeriesTooltipRendererParams extends CartesianSeriesTooltipRendererParams {
    readonly sizeKey?: string;
    readonly sizeName?: string;

    readonly labelKey?: string;
    readonly labelName?: string;
}

interface SeriesMarker {
    enabled?: boolean;
    shape?: string;
    size?: number;
    maxSize?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface CartesianSeriesMarkerFormatterParams {
    xKey: string;
    yKey: string;
}

export interface CartesianSeriesMarkerFormat {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    size?: number;
}

export type CartesianSeriesMarkerFormatter = (params: CartesianSeriesMarkerFormatterParams) => CartesianSeriesMarkerFormat;

interface CartesianSeriesMarker extends SeriesMarker {
    formatter?: CartesianSeriesMarkerFormatter;
}

export interface SeriesTooltip {
    enabled?: boolean;
}

export interface LineSeriesTooltip extends SeriesTooltip {
    renderer?: (params: CartesianSeriesTooltipRendererParams) => string | TooltipRendererResult;
}

export interface LineSeriesOptions extends BaseSeriesOptions {
    type?: 'line';
    marker?: CartesianSeriesMarker;
    xKey?: string;
    yKey?: string;
    xName?: string;
    yName?: string;
    title?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    tooltip?: LineSeriesTooltip;
}

export interface OHLCSeriesOptions extends BaseSeriesOptions {
    type: 'ohlc';
    marker?: OHLCSeriesMarker;
    dateKey?: string;
    openKey?: string;
    highKey?: string;
    lowKey?: string;
    closeKey?: string;
    labelKey?: string;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
}

export interface ScatterSeriesTooltip extends SeriesTooltip {
    renderer?: (params: ScatterSeriesTooltipRendererParams) => string | TooltipRendererResult;
}

export interface ScatterSeriesOptions extends BaseSeriesOptions {
    type?: 'scatter';
    marker?: CartesianSeriesMarker;
    xKey?: string;
    yKey?: string;
    xName?: string;
    yName?: string;
    title?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    tooltip?: ScatterSeriesTooltip;
}

export interface AreaSeriesTooltip extends SeriesTooltip {
    renderer?: (params: CartesianSeriesTooltipRendererParams) => string | TooltipRendererResult;
    format?: string;
}

export interface AreaSeriesOptions extends BaseSeriesOptions {
    type?: 'area';
    marker?: CartesianSeriesMarker;
    xKey?: string;
    yKeys?: string[];
    xName?: string;
    yNames?: string[];
    fills?: string[];
    strokes?: string[];
    strokeWidth?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    shadow?: DropShadowOptions;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    tooltip?: AreaSeriesTooltip;
}

interface BarSeriesLabelOptions extends ChartLabelOptions {
    formatter?: (params: { value: number; }) => string;
}

export interface BarSeriesFormatterParams {
    readonly datum: any;
    readonly fill?: string;
    readonly stroke?: string;
    readonly strokeWidth: number;
    readonly highlighted: boolean;
    readonly xKey: string;
    readonly yKey: string;
}

export interface BarSeriesFormat {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface BarSeriesTooltip extends SeriesTooltip {
    renderer?: (params: CartesianSeriesTooltipRendererParams) => string | TooltipRendererResult;
}

export interface BarSeriesOptions extends BaseSeriesOptions {
    type?: 'bar' | 'column';
    grouped?: boolean;
    normalizedTo?: number;
    xKey?: string;
    yKeys?: string[] | string[][];
    xName?: string;
    yNames?: string[] | { [key in string]: string };
    fills?: string[];
    strokes?: string[];
    strokeWidth?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    shadow?: DropShadowOptions;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    label?: BarSeriesLabelOptions;
    tooltip?: BarSeriesTooltip;
    formatter?: (params: BarSeriesFormatterParams) => BarSeriesFormat;
}

interface HistogramSeriesLabelOptions extends ChartLabelOptions {
    formatter?: (params: { value: number; }) => string;
}

export interface HistogramSeriesTooltip extends SeriesTooltip {
    renderer?: (params: CartesianSeriesTooltipRendererParams) => string | TooltipRendererResult;
}

export interface HistogramSeriesOptions extends BaseSeriesOptions {
    type?: 'histogram';
    fill?: string;
    stroke?: string;
    fillOpacity?: number;
    strokeOpacity?: number;
    strokeWidth?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    xKey?: string;
    xName?: string;
    yKey?: string;
    yName?: string;
    areaPlot?: boolean;
    bins?: [number, number][];
    binCount?: number;
    aggregation?: 'count' | 'sum' | 'mean';
    shadow?: DropShadowOptions;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    label?: HistogramSeriesLabelOptions;
    tooltip?: HistogramSeriesTooltip;
}

interface PieSeriesLabelOptions extends ChartLabelOptions {
    offset?: number;
    minAngle?: number;
}

export interface PieSeriesFormatterParams {
    readonly datum: any;
    readonly fill?: string;
    readonly stroke?: string;
    readonly strokeWidth: number;
    readonly highlighted: boolean;
    readonly angleKey: string;
    readonly radiusKey?: string;
}

export interface PieSeriesFormat {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface PieSeriesTooltip extends SeriesTooltip {
    renderer?: (params: PieSeriesTooltipRendererParams) => string | TooltipRendererResult;
}

export interface PieSeriesOptions extends BaseSeriesOptions {
    type?: 'pie';
    title?: ChartCaptionOptions;
    label?: PieSeriesLabelOptions;
    callout?: {
        colors?: string[];
        length?: number;
        strokeWidth?: number;
    };
    angleKey?: string;
    angleName?: string;
    radiusKey?: string;
    radiusName?: string;
    labelKey?: string;
    labelName?: string;
    fills?: string[];
    strokes?: string[];
    fillOpacity?: number;
    strokeOpacity?: number;
    strokeWidth?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    rotation?: number;
    outerRadiusOffset?: number;
    innerRadiusOffset?: number;
    shadow?: DropShadowOptions;
    highlightStyle?: {
        fill?: string;
        stroke?: string;
    };
    tooltip?: PieSeriesTooltip;
    formatter?: (params: PieSeriesFormatterParams) => PieSeriesFormat;
}

interface PieSeriesTooltipRendererParams extends PolarSeriesTooltipRendererParams {
    labelKey?: string;
    labelName?: string;
}

type CartesianSeriesOptions =
    LineSeriesOptions |
    ScatterSeriesOptions |
    AreaSeriesOptions |
    BarSeriesOptions |
    HistogramSeriesOptions;

type PolarSeriesOptions = PieSeriesOptions;

export interface CartesianChartOptions<TAxisOptions = CartesianAxisOptions[], TSeriesOptions = CartesianSeriesOptions[]> extends BaseChartOptions {
    type?: 'cartesian' | 'groupedCategory' | 'line' | 'bar' | 'column' | 'area' | 'scatter';
    axes?: TAxisOptions;
    series?: TSeriesOptions;
}

export interface PolarChartOptions<TAxisOptions = PolarAxisOptions[], TSeriesOptions = PolarSeriesOptions[]> extends BaseChartOptions {
    type?: 'polar' | 'pie';
    axes?: TAxisOptions; // will be supported in the future and used by radar series
    series?: TSeriesOptions;
}

export type ChartOptions = CartesianChartOptions | PolarChartOptions;