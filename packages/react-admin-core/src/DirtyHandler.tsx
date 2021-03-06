import * as React from "react";
import { DirtyHandlerApiContext, IDirtyHandlerApi, IDirtyHandlerApiBinding } from "./DirtyHandlerApiContext";
import { RouterPrompt } from "./router";

interface IProps {}

interface IBinding {
    obj: object;
    binding: IDirtyHandlerApiBinding;
}
type Bindings = IBinding[];
export class DirtyHandler extends React.Component<IProps> {
    public static contextType = DirtyHandlerApiContext;

    public dirtyHandlerApi: IDirtyHandlerApi;
    private bindings: Bindings;

    constructor(props: IProps) {
        super(props);

        this.bindings = [];

        this.dirtyHandlerApi = {
            registerBinding: this.registerBinding.bind(this),
            unregisterBinding: this.unregisterBinding.bind(this),
            isBindingDirty: this.isBindingDirty.bind(this),
            resetBindings: this.resetBindings.bind(this),
            submitBindings: this.submitBindings.bind(this),
            getParent: this.getParent.bind(this),
        };
    }

    public componentDidMount() {
        if (this.context) {
            this.context.registerBinding(this, {
                isDirty: () => {
                    return this.isBindingDirty();
                },
                submit: () => {
                    return this.submitBindings();
                },
                reset: () => {
                    return this.resetBindings();
                },
            });
        }
    }

    public componentWillUnmount() {
        if (this.context) {
            this.context.unregisterBinding(this);
        }
    }

    public render() {
        return (
            <DirtyHandlerApiContext.Provider value={this.dirtyHandlerApi}>
                <RouterPrompt message={this.promptMessage} />
                {this.props.children}
            </DirtyHandlerApiContext.Provider>
        );
    }

    private promptMessage = (): string | boolean => {
        if (!this.isBindingDirty()) {
            return true;
        } else {
            return "Nicht gespeicherte Änderungen verwerfen?";
        }
    };

    private isBindingDirty() {
        return this.bindings
            .map(binding => {
                return binding.binding.isDirty();
            })
            .reduce((accumulator, currentValue) => accumulator || currentValue, false);
    }

    private submitBindings() {
        return Promise.all(
            this.bindings.map(binding => {
                return binding.binding.submit();
            }),
        );
    }

    private resetBindings() {
        return Promise.all(
            this.bindings.map(binding => {
                return binding.binding.reset();
            }),
        );
    }

    private registerBinding(obj: object, binding: IDirtyHandlerApiBinding) {
        this.bindings.push({ obj, binding });
    }
    private unregisterBinding(obj: object) {
        this.bindings = this.bindings.filter(item => item.obj !== obj);
    }

    private getParent(): IDirtyHandlerApi | undefined {
        return this.context;
    }
}
