import { FontStyle, FontWeight } from "../scene/shape/text";
import { Observable, property } from "../util/observable";

export class Label extends Observable {
    enabled = property('enabled', true, this, ['change']);
    fontStyle?: FontStyle = property('fontStyle', undefined, this, ['change']);
    fontWeight?: FontWeight = property('fontWeight', undefined, this, ['change']);
    fontSize = property('fontSize', 12, this, ['change']);
    fontFamily = property('fontFamily', 'Verdana, sans-serif', this, ['change']);
    color = property('color', 'rgba(70, 70, 70, 1)', this, ['change']);
}
