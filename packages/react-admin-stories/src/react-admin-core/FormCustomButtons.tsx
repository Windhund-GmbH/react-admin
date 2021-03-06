import { ApolloProvider } from "@apollo/react-hooks";
import { Button } from "@material-ui/core";
import { BeachAccess as BeachAccessIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import { FinalForm } from "@vivid-planet/react-admin-core";
import { Field, FormPaper, Input } from "@vivid-planet/react-admin-form";
import { styled } from "@vivid-planet/react-admin-mui";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import * as React from "react";
import { AnyObject } from "react-final-form";

interface IProps {
    formRenderProps: AnyObject;
}

const StyledButton = styled(Button)`
    && {
        text-transform: capitalize;
        background-color: #006699;
        color: white;
        &:disabled {
            color: lightgrey;
            background-color: slategrey;
        }
        &:hover {
            background-color: #006699;
        }
    }
`;

const FormCustomButtons: React.FC<IProps> = ({ formRenderProps }) => {
    return (
        <StyledButton
            startIcon={<BeachAccessIcon />}
            variant="text"
            color="default"
            disabled={formRenderProps.pristine || formRenderProps.hasValidationErrors || formRenderProps.submitting}
            onClick={handleCustomButtonClick}
        >
            {formRenderProps.pristine ? "Please fill out the form" : "Click Me - I'm a Custom button"}
        </StyledButton>
    );

    function handleCustomButtonClick() {
        window.alert(`Form values: ${JSON.stringify(formRenderProps.values)}`);
    }
};

function Story() {
    return (
        <FinalForm
            mode={"edit"}
            onSubmit={() => {
                // add your form-submit function here
            }}
            renderButtons={props => <FormCustomButtons formRenderProps={props} />}
        >
            <FormPaper>
                <Field label="Foo" name="foo" component={Input} />
                <Field label="Bar" name="bar" component={Input} />
            </FormPaper>
        </FinalForm>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(story => {
        const link = ApolloLink.from([
            new RestLink({
                uri: "https://jsonplaceholder.typicode.com/",
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{story()}</ApolloProvider>;
    })
    .add("FormCustomButtons", () => <Story />);
