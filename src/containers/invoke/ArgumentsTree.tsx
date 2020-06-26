import * as React from 'react';
import Button from '@/components/Button';
import { Arguments } from './Arguments';
import { IArgument } from './store/interface/invoke.interface';
import { IIntl } from '@/store/interface/intl.interface';

interface IProps {
    title: string;
    arguments: IArgument[];
    onChange: (args: IArgument[]) => void;
    intl: IIntl
}

interface IState {
    arguments: IArgument[];
}

export class ArgumentsTree extends React.Component<IProps, IState>{

    public state: IState = {
        arguments: []
    }

    public render() {
        return (
            <>
                {
                    this.props.arguments.map((item, index) => {
                        return (
                            <Arguments intl={ this.props.intl } key={ index } title={ this.props.title } index={ index } arguments={ item } onChange={ this.onSelectChange } />
                        )
                    })
                }
                <div className="invoke-button">
                    <Button text={ this.props.intl.message.button[ 6 ] } btnSize="bg-btn" onClick={ this.onAddArgs } />
                </div>
            </>
        )
    }

    private onSelectChange = (title: string, index: number, event: IArgument) => {
        const args = this.state.arguments;
        args[ index ] = event;
        if (event.type === "none") {
            args.splice(index, 1);
        }
        // console.log("arguments tree", args);

        this.setState({ arguments: args }, () => {
            this.props.onChange(args)
        })
    }

    private onAddArgs = () => {
        const args = this.state.arguments;
        args.push({ type: "String", value: "" });
        this.setState({ arguments: args }, () => {
            this.props.onChange(args)
        })

    }

}