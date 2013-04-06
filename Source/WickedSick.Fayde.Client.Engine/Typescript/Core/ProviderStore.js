var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Fayde;
(function (Fayde) {
    /// CODE
    /// <reference path="DependencyObject.ts" />
    /// <reference path="../Runtime/BError.ts" />
    /// <reference path="../Runtime/Nullstone.ts" />
    /// <reference path="InheritedProvider.ts" />
    /// <reference path="../Controls/Control.ts" />
    (function (Provider) {
        (function (_PropertyPrecedence) {
            _PropertyPrecedence._map = [];
            _PropertyPrecedence.IsEnabled = 0;
            _PropertyPrecedence.LocalValue = 1;
            _PropertyPrecedence.DynamicValue = 2;
            _PropertyPrecedence.LocalStyle = 3;
            _PropertyPrecedence.ImplicitStyle = 4;
            _PropertyPrecedence.Inherited = 5;
            _PropertyPrecedence.InheritedDataContext = 6;
            _PropertyPrecedence.DefaultValue = 7;
            _PropertyPrecedence.AutoCreate = 8;
            _PropertyPrecedence.Lowest = 8;
            _PropertyPrecedence.Highest = 0;
            _PropertyPrecedence.Count = 9;
        })(Provider._PropertyPrecedence || (Provider._PropertyPrecedence = {}));
        var _PropertyPrecedence = Provider._PropertyPrecedence;
        var PropertyProvider = (function () {
            function PropertyProvider() { }
            PropertyProvider.prototype.GetPropertyValue = function (store, propd) {
            };
            PropertyProvider.prototype.RecomputePropertyValueOnClear = function (propd) {
            };
            PropertyProvider.prototype.RecomputePropertyValueOnLower = function (propd) {
            };
            return PropertyProvider;
        })();
        Provider.PropertyProvider = PropertyProvider;        
        var AutoCreateProvider = (function (_super) {
            __extends(AutoCreateProvider, _super);
            function AutoCreateProvider() {
                _super.apply(this, arguments);

                this._ht = [];
            }
            AutoCreateProvider.prototype.GetPropertyValue = function (store, propd) {
                var value = this.ReadLocalValue(propd);
                if(value !== undefined) {
                    return value;
                }
                value = propd._IsAutoCreated ? propd._AutoCreator.GetValue(propd, store._Object) : undefined;
                if(value === undefined) {
                    return undefined;
                }
                this._ht[propd._ID] = value;
                var error = new BError();
                store._ProviderValueChanged(_PropertyPrecedence.AutoCreate, propd, undefined, value, false, true, false, error);
                return value;
            };
            AutoCreateProvider.prototype.ReadLocalValue = function (propd) {
                return this._ht[propd._ID];
            };
            AutoCreateProvider.prototype.RecomputePropertyValueOnClear = function (propd) {
                this._ht[propd._ID] = undefined;
            };
            AutoCreateProvider.prototype.ClearValue = function (propd) {
                this._ht[propd._ID] = undefined;
            };
            return AutoCreateProvider;
        })(PropertyProvider);
        Provider.AutoCreateProvider = AutoCreateProvider;        
        var LocalValueProvider = (function (_super) {
            __extends(LocalValueProvider, _super);
            function LocalValueProvider() {
                _super.apply(this, arguments);

                this._ht = [];
            }
            LocalValueProvider.prototype.GetPropertyValue = function (store, propd) {
                return this._ht[propd._ID];
            };
            LocalValueProvider.prototype.SetValue = function (propd, value) {
                this._ht[propd._ID] = value;
            };
            LocalValueProvider.prototype.ClearValue = function (propd) {
                this._ht[propd._ID] = undefined;
            };
            return LocalValueProvider;
        })(PropertyProvider);
        Provider.LocalValueProvider = LocalValueProvider;        
        var InheritedIsEnabledProvider = (function (_super) {
            __extends(InheritedIsEnabledProvider, _super);
            function InheritedIsEnabledProvider(store) {
                        _super.call(this);
                this._CurrentValue = true;
                this._Store = store;
            }
            InheritedIsEnabledProvider.prototype.GetPropertyValue = function (store, propd) {
                if(propd._ID === Fayde.Controls.Control.IsEnabledProperty._ID) {
                    return this._CurrentValue;
                }
                return undefined;
            };
            InheritedIsEnabledProvider.prototype.SetDataSource = function (source) {
                if(source) {
                    var curNode = source.XamlNode;
                    while(curNode) {
                        if(curNode.XObject instanceof Fayde.Controls.Control) {
                            break;
                        } else if(curNode.XObject instanceof Fayde.FrameworkElement) {
                            curNode = curNode.ParentNode;
                        } else {
                            curNode = null;
                        }
                    }
                    source = (curNode) ? (curNode.XObject) : null;
                }
                if(this._Source !== source) {
                    this._DetachListener(this._Source);
                    this._Source = source;
                    this._AttachListener(source);
                }
                if(!source && (this._Store._Object.XamlNode.IsAttached)) {
                    this.LocalValueChanged();
                }
            };
            InheritedIsEnabledProvider.prototype._AttachListener = function (source) {
                if(!source) {
                    return;
                }
                var matchFunc = function (sender, args) {
                    return this === args.Property;//Closure - Control.IsEnabledProperty
                    
                };
                (source).PropertyChanged.SubscribeSpecific(this._IsEnabledChanged, this, matchFunc, Fayde.Controls.Control.IsEnabledProperty);
                //TODO: Add Handler - Destroyed Event
                            };
            InheritedIsEnabledProvider.prototype._DetachListener = function (source) {
                if(!source) {
                    return;
                }
                (source).PropertyChanged.Unsubscribe(this._IsEnabledChanged, this, Fayde.Controls.Control.IsEnabledProperty);
                //TODO: Remove Handler - Destroyed Event
                            };
            InheritedIsEnabledProvider.prototype._IsEnabledChanged = function (sender, args) {
                this.LocalValueChanged();
            };
            InheritedIsEnabledProvider.prototype.LocalValueChanged = function (propd) {
                if(propd && propd._ID !== Fayde.Controls.Control.IsEnabledProperty._ID) {
                    return false;
                }
                var store = this._Store;
                var localEnabled = store.GetValueSpec(Fayde.Controls.Control.IsEnabledProperty, _PropertyPrecedence.LocalValue);
                var parentEnabled = false;
                var source = this._Source;
                if(source && (store._Object.XamlNode).VisualParentNode) {
                    parentEnabled = source.GetValue(Fayde.Controls.Control.IsEnabledProperty) === true;
                }
                var newValue = localEnabled === true && parentEnabled;
                if(newValue !== this._CurrentValue) {
                    var oldValue = this._CurrentValue;
                    this._CurrentValue = newValue;
                    var error = new BError();
                    store._ProviderValueChanged(_PropertyPrecedence.IsEnabled, Fayde.Controls.Control.IsEnabledProperty, oldValue, newValue, true, false, false, error);
                    return true;
                }
                return false;
            };
            return InheritedIsEnabledProvider;
        })(PropertyProvider);
        Provider.InheritedIsEnabledProvider = InheritedIsEnabledProvider;        
        var InheritedDataContextProvider = (function (_super) {
            __extends(InheritedDataContextProvider, _super);
            function InheritedDataContextProvider(store) {
                        _super.call(this);
                this._Store = store;
            }
            InheritedDataContextProvider.prototype.GetPropertyValue = function (store, propd) {
                var source = this._Source;
                if(!source) {
                    return;
                }
                if(propd._ID !== Fayde.FrameworkElement.DataContextProperty._ID) {
                    return;
                }
                return source._Store.GetValue(Fayde.FrameworkElement.DataContextProperty);
            };
            InheritedDataContextProvider.prototype.SetDataSource = function (source) {
                var oldSource = this._Source;
                if(oldSource === source) {
                    return;
                }
                var oldValue = oldSource ? oldSource._Store.GetValue(Fayde.FrameworkElement.DataContextProperty) : undefined;
                var newValue = source ? source._Store.GetValue(Fayde.FrameworkElement.DataContextProperty) : undefined;
                this._DetachListener(oldSource);
                this._Source = source;
                this._AttachListener(source);
                if(!Nullstone.Equals(oldValue, newValue)) {
                    var error = new BError();
                    this._Store._ProviderValueChanged(_PropertyPrecedence.InheritedDataContext, Fayde.FrameworkElement.DataContextProperty, oldValue, newValue, false, false, false, error);
                }
            };
            InheritedDataContextProvider.prototype._AttachListener = function (source) {
                if(!source) {
                    return;
                }
                var matchFunc = function (sender, args) {
                    return this === args.Property;//Closure - FrameworkElement.DataContextProperty
                    
                };
                (source).PropertyChanged.SubscribeSpecific(this._SourceDataContextChanged, this, matchFunc, Fayde.FrameworkElement.DataContextProperty);
                //TODO: Add Handler - Destroyed Event
                            };
            InheritedDataContextProvider.prototype._DetachListener = function (source) {
                if(!source) {
                    return;
                }
                (source).PropertyChanged.Unsubscribe(this._SourceDataContextChanged, this, Fayde.FrameworkElement.DataContextProperty);
                //TODO: Remove Handler - Destroyed Event
                            };
            InheritedDataContextProvider.prototype._SourceDataContextChanged = function (sender, args) {
                var error = new BError();
                this._Store._ProviderValueChanged(_PropertyPrecedence.InheritedDataContext, Fayde.FrameworkElement.DataContextProperty, args.OldValue, args.NewValue, true, false, false, error);
            };
            InheritedDataContextProvider.prototype.EmitChanged = function () {
                if(this._Source) {
                    var error = new BError();
                    this._Store._ProviderValueChanged(_PropertyPrecedence.InheritedDataContext, Fayde.FrameworkElement.DataContextProperty, undefined, this._Source._Store.GetValue(Fayde.FrameworkElement.DataContextProperty), true, false, false, error);
                }
            };
            return InheritedDataContextProvider;
        })(PropertyProvider);
        Provider.InheritedDataContextProvider = InheritedDataContextProvider;        
        var ProviderStore = (function () {
            function ProviderStore(dobj) {
                this._Providers = [
                    null, 
                    null, 
                    null, 
                    null, 
                    null, 
                    null, 
                    null, 
                    null, 
                    null
                ];
                this._ProviderBitmasks = [];
                this._AnimStorage = [];
                this._Object = dobj;
            }
            ProviderStore.BuildBitmask = function BuildBitmask(propd) {
                var bitmask = (1 << _PropertyPrecedence.Inherited) | (1 << _PropertyPrecedence.DynamicValue);
                if(propd._IsAutoCreated) {
                    bitmask |= (1 << _PropertyPrecedence.AutoCreate);
                }
                if(propd._HasDefaultValue) {
                    bitmask |= (1 << _PropertyPrecedence.DefaultValue);
                }
                return bitmask;
            };
            ProviderStore.prototype.GetValue = function (propd) {
                var startingPrecedence = _PropertyPrecedence.Highest;
                var endingPrecedence = _PropertyPrecedence.Lowest;
                //Establish providers used
                var bitmask = this._ProviderBitmasks[propd._ID] | propd._BitmaskCache;
                //Loop through providers and find the first provider that is on and contains the property value
                for(var i = startingPrecedence; i <= endingPrecedence; i++) {
                    if(!(bitmask & (1 << i))) {
                        continue;
                    }
                    var provider = this._Providers[i];
                    if(!provider) {
                        continue;
                    }
                    var val = provider.GetPropertyValue(this, propd);
                    if(val === undefined) {
                        continue;
                    }
                    return val;
                }
                return undefined;
            };
            ProviderStore.prototype.GetValueSpec = function (propd, startingPrecedence, endingPrecedence) {
                if(startingPrecedence === undefined) {
                    startingPrecedence = _PropertyPrecedence.Highest;
                }
                if(endingPrecedence === undefined) {
                    endingPrecedence = _PropertyPrecedence.Lowest;
                }
                //Establish providers used
                var bitmask = this._ProviderBitmasks[propd._ID] | propd._BitmaskCache;
                //Loop through providers and find the first provider that is on and contains the property value
                for(var i = startingPrecedence; i <= endingPrecedence; i++) {
                    if(!(bitmask & (1 << i))) {
                        continue;
                    }
                    var provider = this._Providers[i];
                    if(!provider) {
                        continue;
                    }
                    var val = provider.GetPropertyValue(this, propd);
                    if(val === undefined) {
                        continue;
                    }
                    return val;
                }
                return undefined;
            };
            ProviderStore.prototype.SetValue = function (propd, value) {
                if(value instanceof Fayde.UnsetValue) {
                    this.ClearValue(propd, true);
                    return;
                }
                if(value && propd.GetTargetType() === String) {
                    if(typeof value !== "string") {
                        value = value.toString();
                    }
                    //TODO: More type checks
                                    }
                var isValidOut = {
                    IsValid: false
                };
                value = propd.ValidateSetValue(this._Object, value, isValidOut);
                if(!isValidOut) {
                    return;
                }
                var currentValue;
                var equal = false;
                if((currentValue = this.ReadLocalValue(propd)) === undefined) {
                    if(propd._IsAutoCreated) {
                        currentValue = this._AutoCreateProvider.ReadLocalValue(propd);
                    }
                }
                if(currentValue !== undefined && value !== undefined) {
                    equal = !propd._AlwaysChange && Nullstone.Equals(currentValue, value);
                } else {
                    equal = currentValue === undefined && value === undefined;
                }
                if(!equal) {
                    var newValue;
                    this._LocalValueProvider.ClearValue(propd);
                    if(propd._IsAutoCreated) {
                        this._AutoCreateProvider.ClearValue(propd);
                    }
                    newValue = value;
                    if(newValue !== undefined) {
                        this._LocalValueProvider.SetValue(propd, newValue);
                    }
                    var error = new BError();
                    this._ProviderValueChanged(_PropertyPrecedence.LocalValue, propd, currentValue, newValue, true, true, true, error);
                    if(error.Message) {
                        throw new Exception(error.Message);
                    }
                }
            };
            ProviderStore.prototype.ClearValue = function (propd, notifyListeners) {
                if(notifyListeners === undefined) {
                    notifyListeners = true;
                }
                if(this._GetAnimationStorageFor(propd)) {
                    return;
                }
                var oldLocalValue;
                if((oldLocalValue = this.ReadLocalValue(propd)) === undefined) {
                    if(propd._IsAutoCreated) {
                        oldLocalValue = this._AutoCreateProvider.ReadLocalValue(propd);
                    }
                }
                if(oldLocalValue !== undefined) {
                    this._DetachValue(oldLocalValue);
                    this._LocalValueProvider.ClearValue(propd);
                    if(propd._IsAutoCreated) {
                        this._AutoCreateProvider.ClearValue(propd);
                    }
                }
                var count = _PropertyPrecedence.Count;
                for(var i = _PropertyPrecedence.LocalValue + 1; i < count; i++) {
                    var provider = this._Providers[i];
                    if(provider) {
                        provider.RecomputePropertyValueOnClear(propd);
                    }
                }
                if(oldLocalValue !== undefined) {
                    var error = new BError();
                    this._ProviderValueChanged(_PropertyPrecedence.LocalValue, propd, oldLocalValue, undefined, notifyListeners, true, false, error);
                    if(error.Message) {
                        throw new Exception(error.Message);
                    }
                }
            };
            ProviderStore.prototype.ReadLocalValue = function (propd) {
                var val = this._LocalValueProvider.GetPropertyValue(this, propd);
                if(val === undefined) {
                    return new Fayde.UnsetValue();
                }
                return val;
            };
            ProviderStore.prototype._ProviderValueChanged = function (providerPrecedence, propd, oldProviderValue, newProviderValue, notifyListeners, setParent, mergeNamesOnSetParent, error) {
                delete this._Object._CachedValues[propd._ID];
                var bitmask = this._ProviderBitmasks[propd._ID] | 0;
                if(newProviderValue !== undefined) {
                    bitmask |= 1 << providerPrecedence;
                } else {
                    bitmask &= ~(1 << providerPrecedence);
                }
                this._ProviderBitmasks[propd._ID] = bitmask;
                var higher = (((1 << (providerPrecedence + 1)) - 2) & bitmask) | propd._BitmaskCache;
                var propPrecHighest = _PropertyPrecedence.Highest;
                for(var j = providerPrecedence - 1; j >= propPrecHighest; j--) {
                    if(!(higher & (1 << j))) {
                        continue;
                    }
                    var provider = this._Providers[j];
                    if(!provider) {
                        continue;
                    }
                    if(provider.GetPropertyValue(this, propd) !== undefined) {
                        this._CallRecomputePropertyValueForProviders(propd, providerPrecedence);
                        return;
                    }
                }
                var oldValue;
                var newValue;
                if(oldProviderValue === undefined || newProviderValue === undefined) {
                    var lowerPriorityValue = this.GetValueSpec(propd, providerPrecedence + 1);
                    if(newProviderValue === undefined) {
                        oldValue = oldProviderValue;
                        newValue = lowerPriorityValue;
                    } else if(oldProviderValue === undefined) {
                        oldValue = lowerPriorityValue;
                        newValue = newProviderValue;
                    }
                } else {
                    oldValue = oldProviderValue;
                    newValue = newProviderValue;
                }
                //INTENTIONAL: Below checks are different
                if(oldValue === null && newValue === null) {
                    return;
                }
                if(oldValue === undefined && newValue === undefined) {
                    return;
                }
                if(!propd._AlwaysChange && Nullstone.Equals(oldValue, newValue)) {
                    return;
                }
                var iiep;
                if(providerPrecedence !== _PropertyPrecedence.IsEnabled && (iiep = this._InheritedIsEnabledProvider) && iiep.LocalValueChanged(propd)) {
                    return;
                }
                this._CallRecomputePropertyValueForProviders(propd, providerPrecedence);
                var setsParent = setParent && !propd.IsCustom;
                this._DetachValue(oldValue);
                this._AttachValue(newValue);
                //Construct property changed event args and raise
                if(notifyListeners) {
                    var args = {
                        Property: propd,
                        OldValue: oldValue,
                        NewValue: newValue
                    };
                    try  {
                        this._Object._OnPropertyChanged(args);
                    } catch (err) {
                        error.Message = err.Message;
                    }
                    if(propd && propd._ChangedCallback) {
                        propd._ChangedCallback(this._Object, args);
                    }
                    if(propd._Inheritable > 0 && providerPrecedence !== _PropertyPrecedence.Inherited) {
                        // NOTE: We only propagate if inherited exists and has the highest priority in the bitmask
                        var inheritedProvider = this._InheritedProvider;
                        // GetPropertyValueProvider(propd) < _PropertyPrecedence.Inherited
                        if(inheritedProvider && ((this._ProviderBitmasks[propd._ID] & ((1 << _PropertyPrecedence.Inherited) - 1)) !== 0)) {
                            inheritedProvider.PropagateInheritedProperty(this, propd, this._Object, this._Object);
                        }
                    }
                }
            };
            ProviderStore.prototype._GetAnimationStorageFor = function (propd) {
                var list = this._AnimStorage[propd._ID];
                if(list && list.length > 0) {
                    return list[list.length - 1];
                }
                return undefined;
            };
            ProviderStore.prototype._CloneAnimationStorage = function (sourceStore) {
                var srcRepo = sourceStore._AnimStorage;
                var thisRepo = this._AnimStorage;
                var list;
                for(var key in srcRepo) {
                    thisRepo[key] = srcRepo[0].slice(0);
                }
            };
            ProviderStore.prototype._AttachAnimationStorage = function (propd, storage) {
                var list = this._AnimStorage[propd._ID];
                if(!list) {
                    this._AnimStorage[propd._ID] = list = [
                        storage
                    ];
                    return undefined;
                }
                var attached = list[list.length - 1];
                if(attached) {
                    attached.Disable();
                }
                list.push(storage);
                return attached;
            };
            ProviderStore.prototype._DetachAnimationStorage = function (propd, storage) {
                var list = this._AnimStorage[propd._ID];
                if(!list) {
                    return;
                }
                var len = list.length;
                if(len < 1) {
                    return;
                }
                var i;
                var cur;
                for(i = len - 1; i >= 0; i++) {
                    cur = list[i];
                    if(cur === storage) {
                        break;
                    }
                }
                if(i === (len - 1)) {
                    list.pop();
                    if(len > 1) {
                        list[len - 2].Enable();
                    }
                } else {
                    list.splice(i, 1);
                    if(i > 0) {
                        list[i - 1].StopValue = storage.StopValue;
                    }
                }
            };
            ProviderStore.prototype._CallRecomputePropertyValueForProviders = function (propd, providerPrecedence) {
                for(var i = 0; i < providerPrecedence; i++) {
                    var provider = this._Providers[i];
                    if(provider) {
                        provider.RecomputePropertyValueOnLower(propd);
                    }
                }
            };
            ProviderStore.prototype._AttachValue = function (value) {
                if(!value) {
                    return;
                }
                if(value instanceof Fayde.DependencyObject) {
                    (value).XamlNode.AttachTo(this._Object.XamlNode);
                    //TODO:
                    //  AddPropertyChangedListener (SubPropertyChanged)
                    //  If (is collection)
                    //      Subscribe Changed
                    //      Subscribe ItemChanged
                                    } else if(value instanceof Fayde.XamlObject) {
                    (value).XamlNode.AttachTo(this._Object.XamlNode);
                }
            };
            ProviderStore.prototype._DetachValue = function (value) {
                if(!value) {
                    return;
                }
                if(value instanceof Fayde.DependencyObject) {
                    (value).XamlNode.Detach();
                    //TODO:
                    //  RemovePropertyChangedListener (SubPropertyChanged)
                    //  If (is collection)
                    //      Unsubscribe Changed
                    //      Unsubscribe ItemChanged
                                    } else if(value instanceof Fayde.XamlObject) {
                    (value).XamlNode.Detach();
                }
            };
            return ProviderStore;
        })();
        Provider.ProviderStore = ProviderStore;        
    })(Fayde.Provider || (Fayde.Provider = {}));
    var Provider = Fayde.Provider;
})(Fayde || (Fayde = {}));
//@ sourceMappingURL=ProviderStore.js.map
