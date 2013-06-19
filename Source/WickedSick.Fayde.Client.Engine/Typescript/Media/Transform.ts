/// <reference path="GeneralTransform.ts" />
/// CODE
/// <reference path="../Primitives/RawMatrix.ts" />
/// <reference path="Matrix.ts" />

module Fayde.Media {
    export interface ITransformChangedListener {
        Callback: (source: Transform) => void;
        Detach();
    }

    export class Transform extends GeneralTransform {
        private _Value: Matrix;

        constructor() {
            super();
            XamlNode.SetShareable(this.XamlNode);
        }

        get Value(): Matrix {
            var val = this._Value;
            if (!val) {
                var val = new Matrix();
                val._Raw = this._BuildValue();
                this._Value = val;
            }
            return val;
        }
        get Inverse(): Transform {
            var inverse = this.Value.Inverse;
            if (inverse == null)
                return;

            var mt = new MatrixTransform();
            mt.Matrix = inverse;
            return mt;
        }

        Transform(p: Point): Point {
            var val = this.Value;
            var v: number[];
            if (!val || !(v = val._Raw))
                return new Point(p.X, p.Y);
            v = mat3.transformVec2(v, vec2.createFrom(p.X, p.Y));
            return new Point(v[0], v[1]);
        }
        TransformBounds(r: rect): rect {
            if (!r)
                return undefined;
            var v = this.Value;
            if (!v || !v._Raw)
                return rect.copyTo(r);
            return rect.transform(rect.copyTo(r), v._Raw);
        }
        TryTransform(inPoint: Point, outPoint: Point): bool {
            return false;
        }

        private _Listeners: ITransformChangedListener[] = [];
        Listen(func: (source: Transform) => void ): ITransformChangedListener {
            var listeners = this._Listeners;
            var listener = {
                Callback: func,
                Detach: () => {
                    var index = listeners.indexOf(listener);
                    if (index > -1)
                        listeners.splice(index, 1);
                }
            };
            listeners.push(listener);
            return listener;
        }

        _InvalidateValue() {
            if (this._Value !== undefined)
                this._Value = undefined;
            var listeners = this._Listeners;
            var len = listeners.length;
            for (var i = 0; i < len; i++) {
                listeners[i].Callback(this);
            }
        }
        _BuildValue(): number[] {
            //Abstract Method
            return undefined;
        }
    }
    Nullstone.RegisterType(Transform, "Transform");

    export class MatrixTransform extends Transform {
        static MatrixProperty: DependencyProperty = DependencyProperty.RegisterFull("Matrix", () => Matrix, MatrixTransform, undefined, (d, args) => (<MatrixTransform>d)._MatrixChanged(args));
        Matrix: Matrix;

        _BuildValue(): number[] {
            var m = this.Matrix;
            if (m)
                return m._Raw;
            return mat3.identity();
        }

        private _MatrixListener: IMatrixChangedListener = null;
        _MatrixChanged(args: IDependencyPropertyChangedEventArgs) {
            if (this._MatrixListener) {
                this._MatrixListener.Detach();
                this._MatrixListener = null;
            }
            var newv: Matrix = args.NewValue;
            if (newv)
                this._MatrixListener = newv.Listen((newMatrix) => this._InvalidateValue());
            this._InvalidateValue();
        }
    }
    Nullstone.RegisterType(MatrixTransform, "MatrixTransform");
}