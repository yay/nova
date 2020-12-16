import { BandScale } from "../../scale/bandScale";
import { ChartAxis } from "../chartAxis";

export class CategoryAxis extends ChartAxis {
    static className = 'CategoryAxis';
    static type = 'category';

    constructor(public readonly scale: BandScale<string> = new BandScale<string>()) {
        super(scale);
        this.scale.paddingInner = 0.2;
        this.scale.paddingOuter = 0.3;
    }

    set paddingInner(value: number) {
        this.scale.paddingInner = value;
    }
    get paddingInner(): number {
        return this.scale.paddingInner;
    }

    set paddingOuter(value: number) {
        this.scale.paddingOuter = value;
    }
    get paddingOuter(): number {
        return this.scale.paddingOuter;
    }
}
