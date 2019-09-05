import * as React from 'react';
import Select, { IOptions } from '@/components/select';
import Input from '@/components/Input';
import { ArgumentsTree } from './ArgumentsTree';
import { IArgument } from './store/interface/invoke.interface';
import { IIntl } from '@/store/interface/intl.interface';

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

export class Arguments extends React.Component<IProps, IState>{

    public state: IState = {
        arguments: { type: 'String', value: "" },
        inputValue: ""
    }

    private paramType = [
        { id: 'none', name: this.props.intl.message.invoke[ 10 ] },
        { id: 'String', name: 'String' },
        { id: 'Integer', name: 'Integer' },
        { id: 'Address', name: 'Address' },
        { id: 'bytearray', name: 'bytearray' },
        { id: 'hex256', name: 'hex256' },
        { id: 'hex160', name: 'hex160' },
        { id: 'Array', name: this.props.intl.message.invoke[ 11 ] }
    ]

    public render() {
        const title = this.props.title ? this.props.title + "-" + (this.props.index + 1) : (this.props.index + 1) + "";
        const option = this.paramType.find(item => item.id === this.props.arguments.type)
        return (
            <>
                <div className="invoke-arg">
                    <div className="arg-title">
                        { this.props.intl.message.invoke[ 9 ] }{ title }
                    </div>
                    <div className="arg-type">
                        <Select defaultValue={ this.props.arguments.type } current={ option } options={ this.paramType } onCallback={ this.onSelectChange } text="" />
                    </div>
                    { this.props.arguments.type === "Array" ?
                        <div className="arg-value type-array">
                            <ArgumentsTree intl={ this.props.intl } title={ title } arguments={ Array.isArray(this.props.arguments.value) ? this.props.arguments.value : [] } onChange={ this.onArgChange } />
                        </div>
                        :
                        <div className="arg-value">
                            <Input type="text" value={ this.state.inputValue } onChange={ this.onChange } placeholder="" />
                        </div>
                    }
                </div>

            </>
        )
    }

    private onSelectChange = (event: IOptions) => {
        const args = this.props.arguments;
        args.type = event.id;
        if (event.id === "Array") {
            args.value = [];
        }
        this.setState({ arguments: args }, () => {
            this.props.onChange(this.props.title, this.props.index, args)
        })
    }

    private onArgChange = (value: IArgument[]) => {
        const args = this.props.arguments;
        args.value = value;
        this.setState({ arguments: args }, () => {
            this.props.onChange(this.props.title, this.props.index, args)
        })
    }

    private onChange = (event) => {
        const args = this.props.arguments;
        args.value = event;
        this.setState({
            inputValue: event,
            arguments: args
        }, () => {
            this.props.onChange(this.props.title, this.props.index, args)
        })
        console.log(event);
    }

}