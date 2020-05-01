import * as React from 'react';
import Input from '@/components/Input';
import { ArgumentsTree } from './ArgumentsTree';
import { IIntl } from '@/store/interface/intl.interface';
import { IArgument } from './store/interface/invoke.interface';

interface IProps {
    intl: IIntl;
    title: string;
    index: number;
    arguments: IArgument;
    onChange: (title: string, index: number, event: IArgument) => void;
}

interface IState {
    arguments: IArgument;
    inputValue: string;
}

export class Parameters extends React.Component<IProps, IState>{

    public state: IState = {
        arguments: { type: 'String', value: "" },
        inputValue: ""
    }

    public render() {
        // const title = this.props.title ? this.props.title + "-" + (this.props.index + 1) : (this.props.index + 1) + "";
        return (
            <>
                <div className="invoke-arg">
                    <div className="arg-title">
                        { this.props.title }
                    </div>
                    { this.props.arguments.type === "Array" ?
                        <div className="arg-value type-array">
                            <ArgumentsTree intl={ this.props.intl } title="" arguments={ Array.isArray(this.props.arguments.value) ? this.props.arguments.value : [] } onChange={ this.onArgChange } />
                        </div>
                        :
                        <div className="arg-value">
                            <Input type="text" value={ this.state.inputValue } onChange={ this.onChange } placeholder={ this.props.arguments.type } />
                        </div>
                    }
                </div>
            </>
        )
    }

    private onArgChange = (value: IArgument[]) => {
        const args = this.props.arguments;
        args.value = value;
        this.setState({ arguments: args }, () => {
            this.props.onChange(this.props.title, this.props.index, args)
        });
    }

    private onChange = (event) => {
        const args = this.props.arguments;
        args.value = event;
        this.setState({
            inputValue: event,
            arguments: args
        }, () => {
            this.props.onChange(this.props.title, this.props.index, args)
        });
    }

}