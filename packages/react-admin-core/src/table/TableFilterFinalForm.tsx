import { Button, Grid, Typography } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { AnyObject } from "final-form";
import * as React from "react";
import { Form, FormProps, FormRenderProps } from "react-final-form";
import { renderComponent } from "../finalFormRenderComponent";
import { IFilterApi } from "./useTableQueryFilter";

type Props<FilterValues = AnyObject> = Omit<FormProps<FilterValues>, "onSubmit" | "initialValues"> & {
    headline?: string;
    resetButton?: boolean;
    onSubmit?: FormProps<FilterValues>["onSubmit"];
    filterApi: IFilterApi<FilterValues>;
};

// tslint:disable-next-line:max-classes-per-file
export class TableFilterFinalForm<FilterValues = AnyObject> extends React.Component<Props<FilterValues>> {
    public render() {
        // remove render, children and component from forwardProps as we define render and those would interfere
        const { headline, resetButton, render, children, component, onSubmit, ...forwardProps } = this.props;
        return (
            <Form
                onSubmit={
                    onSubmit
                        ? onSubmit
                        : () => {
                              return;
                          }
                }
                form={this.props.filterApi.formApi}
                render={this.renderForm}
                {...forwardProps}
            />
        );
    }
    private renderForm = (formRenderProps: FormRenderProps<FilterValues>) => {
        return (
            <form>
                <Grid container justify="space-between" alignItems="center" spacing={2}>
                    {(this.props.headline || this.props.resetButton) && (
                        <Grid item xs={12}>
                            <Grid container justify="space-between" alignItems="center" spacing={2}>
                                {this.props.headline && (
                                    <Grid item>
                                        <Typography variant="h4">{this.props.headline}</Typography>
                                    </Grid>
                                )}
                                {this.props.resetButton && (
                                    <Grid item>
                                        <Button
                                            variant="text"
                                            color="default"
                                            startIcon={<CancelIcon />}
                                            onClick={() => {
                                                formRenderProps.form.reset();
                                            }}
                                        >
                                            <Typography variant="button">Filter zurücksetzen</Typography>
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {renderComponent(this.props, formRenderProps)}
                    </Grid>
                </Grid>
            </form>
        );
    };
}
