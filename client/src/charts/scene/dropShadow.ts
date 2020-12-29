import { Observable, property } from "../util/observable";

export class DropShadow extends Observable {
    enabled = property('enabled', true, this, 'change');
    color = property('color', 'rgba(0, 0, 0, 0.5)', this, 'change');
    xOffset = property('xOffset', 0, this, 'change');
    yOffset = property('yOffset', 0, this, 'change');
    blur = property('blur', 5, this, 'change');
}
